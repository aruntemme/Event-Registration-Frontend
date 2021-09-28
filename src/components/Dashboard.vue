<template>
<div>
<Header />
  <div class=" w-10/12 md:w-6/12 m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>

    <ul class="list-reset mt-4">
      <li><h3 class="text-md font-mono uppercase font-semibold text-gray-700 border-b mb-4 pb-6 mx-2"><router-link to="/events">All Events</router-link>{{title}}</h3></li>
      <h3 class="py-4 mx-2 uppercase font-semibold font-mono text-2xl" v-if="emptyEvent"> no events </h3>
      <li class="py-4 mx-2" v-for="event in availableEvents" :key="event.title" :record="event">
          <router-link :to="{ name: 'event', params: { id: event.id }}" >
        <div class="flex border border-gray-200 p-4 rounded-md shadow-sm cursor-pointer focus:shadow-lg hover:shadow-lg ">
          <div class="flex flex-col gap-2 justify-between pr-4 w-full ">
          <p class="flex font-semibold text-3xl items-center">
            {{ event.title }}
          </p>
          <p class=""> {{ event.description.substring(0,150) }} {{ event.description.length > 150 ? '...' : '' }}</p>
          <div class="flex md:flex-row gap-2 w-full flex-wrap"  v-html="convertIntoTags(event.tags)"></div>
          <div class="grid grid-cols-4 gap-4 mt-3">
            <div class="flex felx-col gap-1 md:col-span-1 col-span-2 bg-purple-200 rounded-lg justify-center items-center  w-full h-12 text-center text-white">
              <unicon name="stopwatch" fill="black"></unicon>
              <p class="text-black">{{ secondsToHms(event.duration) }}</p>
            </div>
            <div class="flex felx-col gap-1 md:col-span-1 col-span-2 bg-purple-200 rounded-lg justify-center items-center  w-full h-12 text-center text-white">
              <unicon name="rupee-sign" fill="black"></unicon>
              <p class="text-black">{{ event.fees }}</p>
              </div>
            <div class="flex felx-col gap-1 md:col-span-1 col-span-2 bg-purple-200 rounded-lg justify-center items-center  w-full h-12 text-center text-white">
              <unicon name="user-plus" fill="black"></unicon>
              <p class="text-black">{{ event.maxparticipants > 0 ? event.maxparticipants : 0 }}</p>
            </div>
            <div class="flex felx-col gap-1 md:col-span-1 col-span-2 bg-purple-200 rounded-lg justify-center items-center  w-full h-12 text-center text-white">
              <unicon name="map-marker-alt" fill="black"></unicon>
              <p class="text-black">{{ event.location }}</p>
            </div>
          </div>
        </div>
        </div>
        </router-link>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
import Header from './Header.vue'

export default {
  components: {
    Header
  },
  name: 'Events',
  data () {
    return {
      artists: [],
      events: [],
      newRecord: [],
      error: '',
      editedRecord: '',
      title: '',
      userEmail: '',
      emptyEvent: false
    }
  },
  watch: {
    $route (to, from) {
      this.renderCurrentCards()
    }
  },
  computed: {
    availableEvents () {
      return this.events.filter(event => event.maxparticipants > 0)
    }
  },
  created () {
    this.userEmail = localStorage.email
    this.renderCurrentCards()
  },
  methods: {
    renderCurrentCards () {
      this.emptyEvent = false
      this.events = []
      if (this.$route.name === 'created') {
        if (!localStorage.csrf) {
          this.$router.replace('/events')
        }
        this.$http.secured.get('/api/v1/events?current_user=1')
          .then((response) => {
            console.log(response.data)
            if (response.data.length <= 0) {
              this.emptyEvent = true
            }

            this.events = response.data
            this.title = ' > Created Events'
          })
          .catch(error => this.setError(error, 'Something went wrong'))
      } else if (this.$route.name === 'Registered') {
        this.$http.secured.get('/api/v1/registrations?current_user=1')
          .then(response => {
            if (response.data.length <= 0) {
              this.emptyEvent = true
            }
            this.events = response.data
            this.title = ' > Registered Events'
          })
      } else {
        this.$http.secured.get('/api/v1/events?all=1')
          .then((response) => {
            if (response.data.length <= 0) {
              this.emptyEvent = true
            }
            this.events = response.data
            this.title = ''
          })
          .catch(error => this.setError(error, 'Something went wrong'))
      }
    },
    convertIntoTags (tags) {
      const tagsArray = tags.split(',')
      let appendString = ''
      tagsArray.forEach(tag => {
        appendString += `<div class="rounded-lg py-1 px-2 w-m-xl bg-black bg-opacity-20 border border-gray-400 text-center">${tag}</div>`
      })
      return appendString
    },
    secondsToHms (value) {
      const sec = parseInt(value, 10)
      let hours = Math.floor(sec / 3600)
      let minutes = Math.floor((sec - hours * 3600) / 60)
      let seconds = sec - hours * 3600 - minutes * 60
      if (hours < 10) { hours = '0' + hours }
      if (minutes < 10) { minutes = '0' + minutes }
      if (seconds < 10) { seconds = '0' + seconds }
      // eslint-disable-next-line eqeqeq
      if (hours == 0) {
        return +minutes + 'm' // Return in MM:SS format
      } else {
        return hours + 'h' + minutes + 'm' // Return in HH:MM:SS format
      }
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    // getArtist (record) {
    //   const recordArtistValues = this.artists.filter(artist => artist.id === record.artist_id)
    //   let artist

    //   recordArtistValues.forEach(function (element) {
    //     artist = element.name
    //   })

    //   return artist
    // },
    addRecord () {
      const value = this.newRecord
      if (!value) {
        return
      }
      this.$http.secured.post('/api/v1/records/', { record: { title: this.newRecord.title, year: this.newRecord.year, artist_id: this.newRecord.artist } })

        .then(response => {
          this.records.push(response.data)
          this.newRecord = ''
        })
        .catch(error => this.setError(error, 'Cannot create record'))
    }
  }
}
</script>
