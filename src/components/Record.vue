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
      downloadLink: ''
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

      this.mediaRecorder = new MediaRecorder(this.stream)

      this.mediaRecorder.ondataavailable = event => {
        if (event.data) {
          this.blobs.push(event.data)
        }
      }

      this.mediaRecorder.onstart = () => {
        this.recording = true
      }

      this.mediaRecorder.onstop = () => {
        this.recording = false

        this.doPreview()
      }
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
      this.mediaRecorder.start(5000)
      console.log(`Recorder State : ${this.mediaRecorder.state}`)
    },
    endRecording () {
      this.mediaRecorder.stop()
      console.log(`Recorder State : ${this.mediaRecorder.state}`)
      this.stopCamera()
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

      this.startCamera()
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-custom-opacity {
  background-color: rgba(165, 165, 165, 0.74);
}
</style>
