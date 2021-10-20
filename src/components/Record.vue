<template>
  <div>
    <Header />
    <div class=" w-10/12 md:w-6/12 m-auto py-10">
      <ul class="list-reset mt-4">
        <li>
          <h3
            class="text-md font-mono uppercase font-semibold text-gray-700 mx-2"
          >
            <router-link to="/events">Recorder</router-link>
          </h3>
        </li>
        <li>
          <!-- Intro -->
          <section id="intro" class="flex mx-auto flex-col py-12 items-center" v-show="intro">
            <button class="btn-primary rounded-md border p-1 m-1 w-1/2" @click="startCamera">Open Camera</button>
            <p class="p-1 m-1"> It will ask permission for camera and microphone</p>
          </section>
          <!-- Recorder -->
          <section id="recorder" v-show="recorder">
            <video ref="video" autoplay playsinline muted></video>
              <button class="bg-red-400 rounded-md border p-1 m-1" @click="closeCamera">
                close
              </button>
              <button class="btn-primary rounded-md border p-1 m-1" @click="flipCamera" v-if="!recording">
                Flip Camera
              </button>
              <button class="btn-primary rounded-md border p-1 m-1 stop" @click="endRecording" v-if="recording">
                stop
              </button>
              <button class="btn-primary rounded-md border p-1 m-1 record" @click="startRecording" v-else>
                Record Video
              </button>
          </section>
          <!-- Preview -->
          <section id="preview" v-show="preview">
            <video ref="preview" autoplay playsinline controls loop></video>
            <button class="bg-red-400 rounded-md border p-1 m-1" @click="closePreview">
              close
            </button>
            <button class="btn-primary rounded-md border p-1 m-1" @click="toggleMute">
              {{ muted ? 'muted' : 'mute' }}
            </button>
            <a class="bg-gradient-to-br from-purple-800 to-purple-600 text-white rounded-md border p-1 m-1" :href="downloadLink">
              Download
            </a>
          </section>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import Header from './Header.vue'
import axios from 'axios'
export default {
  props: ['uploadUrl'],
  components: {
    Header
  },
  data () {
    return {
      blob: null,
      blobs: [],
      facingMode: 'user',
      intro: true,
      muted: false,
      preview: false,
      previewing: false,
      recorder: false,
      recording: false,
      stream: null,
      downloadLink: '',
      count: 0,
      uploadId: '',
      videoName: '',
      location: '',
      isMultipart: false,
      minChunkSize: 5242880,
      interval: null,
      tempBlobs: [],
      tempBlob: null,
      tempBlobSize: 0
    }
  },
  methods: {
    async startCamera () {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: this.facingMode
        }
      })

      this.$refs.video.srcObject = this.stream

      this.intro = false
      this.preview = false
      this.recorder = true

      let options = { videoBitsPerSecond: 2500000, mimeType: 'video/webm;codecs=vp9' }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported')
        options = { videoBitsPerSecond: 2500000, mimeType: 'video/webm;codecs=vp8' }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported')
          options = { videoBitsPerSecond: 2500000, mimeType: 'video/webm' }
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported')
            options = {
              videoBitsPerSecond: 2500000,
              mimeType: ''
            }
          }
        }
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options)

      this.mediaRecorder.ondataavailable = event => {
        if (event.data) {
          console.log(`Triggered Blob Size :${event.data.size}`)
          if (event.data.size < this.minChunkSize) {
            event.data.name = this.videoName
            this.tempBlobs.push(event.data)
            this.tempBlobSize += event.data.size
          } else {
            event.data.name = this.videoName
            this.isMultipart = true
            this.blobs.push(event.data)
            this.count += 1
            this.sendMultipartVideo(event.data)
            console.log(`completed Blob Size :${event.data.size}`)
          }
          if (this.tempBlobSize > this.minChunkSize) {
            this.isMultipart = true
            this.tempBlob = new Blob(this.tempBlobs, {
              type: this.mediaRecorder.mimeType
            })
            this.tempBlob.name = this.videoName
            this.tempBlobs = []
            this.tempBlobSize = 0
            this.blobs.push(this.tempBlob)
            console.log(this.tempBlob)
            this.count += 1
            this.sendMultipartVideo(this.tempBlob)
            console.log(`completed Blob Size :${this.tempBlob.size}`)
          }
          const recorderState = this.mediaRecorder.state
          if (recorderState === 'inactive' && event.data.size < this.minChunkSize && !this.isMultipart) {
            event.data.name = this.videoName
            this.blobs.push(event.data)
            this.sendSingleVideo(event.data)
          } else if (recorderState === 'inactive' && event.data.size < this.minChunkSize && this.isMultipart) {
            event.data.name = this.videoName
            this.blobs.push(event.data)
            console.log(event.data)
            this.count += 1
          }
        }
      }
      this.mediaRecorder.onstart = () => {
        this.recording = true
      }

      this.mediaRecorder.onstop = () => {
        this.recording = false

        this.doPreview()
        if (this.isMultipart) {
          this.isMultipart = false
          const request = {
            bucket: 'flicstest',
            key: this.videoName,
            upload_id: this.uploadId
          }
          axios.post('http://localhost:3000/record/complete_upload', request)
            .then(response => {
              this.location = response.data.location
              console.log(this.location)
              this.downloadLink = this.location
            })
        }
      }
    },
    sendMultipartVideo (data) {
      const formData = {
        bucket: 'flicstest',
        key: this.videoName,
        upload_id: this.uploadId,
        part_number: this.count,
        type: 'multiple'
      }
      const options = { headers: { 'Content-Type': data.type } }
      axios.post('http://localhost:3000/record/get_presigned_url', formData)
        .then(response => {
          console.log(response)
          axios.put(response.data.url, data, options)
        })
    },
    sendSingleVideo (data) {
      const requestData = {
        bucket: 'flicstest',
        key: this.videoName,
        type: 'single'
      }
      const options = { headers: { 'Content-Type': data.type } }
      axios.post('http://localhost:3000/record/get_presigned_url', requestData)
        .then(response => {
          console.log(response)
          axios.put(response.data.url, data, options).then((response) => console.log(response))
          this.downloadLink = `https://flicstest.s3.ap-south-1.amazonaws.com/${this.videoName}`
        })
    },
    flipCamera () {
      this.stopCamera()

      if (this.facingMode === 'environment') {
        this.facingMode = 'user'
      } else {
        this.facingMode = 'environment'
      }

      this.startCamera()
    },
    stopCamera () {
      this.stream.getTracks().forEach(track => track.stop())

      this.stream = null
    },
    closeCamera () {
      this.stopCamera()

      this.recorder = false
      this.intro = true
    },
    startRecording () {
      this.mediaRecorder.start()
      console.log(`Recorder State : ${this.mediaRecorder.state}`)
      this.videoName = `recorded-video-${new Date().toISOString()}.webm`
      const request = {
        bucket: 'flicstest',
        key: this.videoName
      }
      axios.post('http://localhost:3000/record/start_upload', request)
        .then(response => {
          this.uploadId = response.data.uploadId
          console.log(this.uploadId)
        })
      const self = this
      this.interval = setInterval(function () {
        self.captureMedia()
      }, 5000)
    },
    endRecording () {
      this.mediaRecorder.stop()
      console.log(`Recorder State : ${this.mediaRecorder.state}`)
      this.stopCamera()
      this.tempBlobs = []
      this.tempBlobSize = 0
      this.tempBlob = null
      clearInterval(this.interval)
    },
    captureMedia () {
      this.mediaRecorder.requestData()
    },
    doPreview () {
      this.blob = new Blob(this.blobs, {
        type: this.mediaRecorder.mimeType
      })
      console.log(this.blobs)
      this.$refs.preview.src = URL.createObjectURL(this.blob)
      this.downloadLink = URL.createObjectURL(this.blob)

      this.recorder = false
      this.preview = true
    },
    toggleMute () {
      this.$refs.preview.muted = !this.$refs.preview.muted

      this.muted = this.$refs.preview.muted
    },
    closePreview () {
      this.$refs.preview.src = null

      this.blobs = []
      this.blob = null
      this.videoName = ''
      this.count = 0
      this.startCamera()
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-custom-opacity {
  background-color: rgba(165, 165, 165, 0.74);
}
video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
