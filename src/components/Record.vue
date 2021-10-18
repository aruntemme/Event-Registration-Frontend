<template>
  <div>
    <Header />
    <div class="flex h-screen" v-if="isloading">
      <div class="m-auto">
      <spinner />
      </div>
    </div>
    <div v-else class=" w-10/12 md:w-6/12 m-auto py-10">
      <ul class="list-reset mt-4">
        <li>
          <h3
            class="text-md font-mono uppercase font-semibold text-gray-700 mx-2"
          >
            <router-link to="/events">Record</router-link> >
            {{ event.title }}
          </h3>
        </li>
        <li>
          <div>
            <video id="myVideo" playsinline class="video-js vjs-default-skin">
                <p class="vjs-no-js">
                    To view this video please enable JavaScript, or consider upgrading to a
                    web browser that
                    <a href="https://videojs.com/html5-video-support/" target="_blank">
                        supports HTML5 video.
                    </a>
                </p>
            </video>
            <br>
            <button type="button" class="btn btn-info rounded-md border border-gray-600 px-2 py-1 m-2" @click.prevent="startStopRecording()" id="btnStart">{{ startState.text }}</button>
            <button type="button" class="btn btn-success rounded-md border border-gray-600 px-2 py-1 m-2" @click.prevent="submitVideo()" v-bind:disabled="isSaveDisabled" id="btnSave">{{ submitText }}</button>
            <button type="button" class="btn btn-primary rounded-md border border-gray-600 px-2 py-1 m-2" @click.prevent="retakeVideo()" v-bind:disabled="isRetakeDisabled" id="btnRetake">Retake</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'videojs-record/dist/css/videojs.record.css'
import videojs from 'video.js'
import 'webrtc-adapter'
import RecordRTC from 'recordrtc'
// eslint-disable-next-line no-unused-vars
import Record from 'videojs-record/dist/videojs.record.js'
// eslint-disable-next-line no-unused-vars
import FFmpegjsEngine from 'videojs-record/dist/plugins/videojs.record.ffmpegjs.js'
import Header from './Header.vue'
import Spinner from './Spinner.vue'
export default {
  props: ['uploadUrl'],
  components: {
    Header,
    Spinner
  },
  data () {
    return {
      name: '',
      event: [],
      error: '',
      startState: {
        status: true,
        text: 'Start'
      },
      currentUser: '',
      isRegistered: false,
      formvalues: {},
      formerror: false,
      isloading: false,
      player: '',
      retake: 0,
      isSaveDisabled: true,
      isStartRecording: false,
      isRetakeDisabled: true,
      submitText: 'Share',
      options: {
        controls: true,
        bigPlayButton: false,
        controlBar: {
          deviceButton: false,
          recordToggle: false,
          pipToggle: false
        },
        width: 500,
        height: 300,
        fluid: true,
        plugins: {
          record: {
            pip: false,
            audio: true,
            video: true,
            maxLength: 25,
            debug: true
          }
        }
      }
    }
  },
  mounted () {
    this.player = videojs('myVideo', this.options, () => {
      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version
      videojs.log(msg)
    })
    // error handling
    this.player.on('deviceReady', () => {
      this.player.record().start()
      console.log('device ready:')
    })
    this.player.on('deviceError', () => {
      console.log('device error:', this.player.deviceErrorCode)
    })
    this.player.on('error', (element, error) => {
      console.error(error)
    })
    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!')
    })
    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      this.isSaveDisabled = false
      if (this.retake === 0) {
        this.isRetakeDisabled = false
      }
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData)
    })
  },
  methods: {
    startStopRecording () {
      this.isStartRecording = true
      if (this.startState.status) {
        this.startState.status = false
        this.startState.text = 'Stop'
        this.player.record().getDevice()
      } else {
        this.startState.status = true
        this.isSaveDisabled = true
        this.isRetakeDisabled = true
        this.player.record().stopDevice()
        this.startState.text = 'Start'
      }
    },
    submitVideo () {
      this.isSaveDisabled = true
      this.isRetakeDisabled = true
      const data = this.player.recordedData
      const formData = new FormData()
      formData.append('video', data, data.name)
      this.$http.secured.post('/api/v1/events/', formData)
        .then(response => {
          if (response.data.status === 'success') {
            this.$router.replace('/events')
            this.events.push(response.data.event)
            this.newEvent = []
          }
        })
        .catch(error => this.setError(error, 'Cannot create Event'))
      this.submitText = 'Uploading ' + data.name
      console.log('uploading recording:', data.name)
      this.player.record().stopDevice()
    },
    retakeVideo () {
      this.isSaveDisabled = true
      this.startState.text = 'Stop'
      this.isRetakeDisabled = true
      this.startState.status = false
      this.retake += 1
      this.player.record().start()
    }
  },
  beforeUnmount () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-custom-opacity {
  background-color: rgba(165, 165, 165, 0.74);
}
</style>
