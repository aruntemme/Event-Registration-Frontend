<template>
<div>
<Header />
  <div class=" w-10/12 md:w-6/12 m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>

    <ul class="list-reset mt-4">
      <li><h3 class="text-md font-mono uppercase font-semibold text-gray-700 mx-2"><router-link to="/events">All Events</router-link></h3></li>
      <li class="py-4 mx-2" v-for="event in events" :key="event.id" :record="event">
          <router-link :to="{ name: 'event', params: { id: event.id }}" >
        <div class="flex border border-gray-400 p-4 rounded-md shadow-sm cursor-pointer focus:shadow-lg hover:shadow-lg ">
          <div class="flex flex-col gap-2 justify-between pr-4">
          <p class="flex font-semibold text-2xl items-center">
            {{ event.title }}
          </p>
          <p class="block"> {{ event.description }}</p>
          <div class="flex flex-row gap-2"  v-html="convertIntoTags(event.tags)"></div>
          <div class="flex flex-row gap-4 mt-3">
            <p class="flex felx-row gap-1"><ClockTimeFiveOutline :size="22" /> {{ secondsToHms(event.duration) }}</p>
            <p class="flex felx-row gap-1">₹ {{ event.fees }}</p>
            <p class="flex felx-row gap-1"><AccountMultipleCheckOutline :size="22" />{{ event.maxparticipants }}</p>
          </div>
        </div>

        <!-- <button class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded"
          @click.prevent="editRecord(event)">Edit</button>

        <button class="bg-transparent text-sm hover:bg-red text-red hover:text-white no-underline font-bold py-2 px-4 rounded border border-red"
         @click.prevent="removeRecord(event)">Delete</button> -->
        </div>
        </router-link>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import ClockTimeFiveOutline from 'vue-material-design-icons/ClockTimeFiveOutline.vue'
import AccountMultipleCheckOutline from 'vue-material-design-icons/AccountMultipleCheckOutline.vue'
export default {
  components: {
    Header,
    ClockTimeFiveOutline,
    AccountMultipleCheckOutline
  },
  name: 'Events',
  data () {
    return {
      artists: [],
      events: [],
      newRecord: [],
      error: '',
      editedRecord: ''
    }
  },
  created () {
    // if (!localStorage.signedIn) {
    //   this.$router.replace('/')
    // } else {
    this.$http.secured.get('/api/v1/events')
      .then(response => { this.events = response.data })
      .catch(error => this.setError(error, 'Something went wrong'))

  //  }
  },
  methods: {
    convertIntoTags (tags) {
      const tagsArray = tags.split(',')
      let appendString = ''
      tagsArray.forEach(tag => {
        appendString += `<div class="rounded-full p-1 py-2 h-full w-full bg-purple-200 text-center">${tag}</div>`
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
    getArtist (record) {
      const recordArtistValues = this.artists.filter(artist => artist.id === record.artist_id)
      let artist

      recordArtistValues.forEach(function (element) {
        artist = element.name
      })

      return artist
    },
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
    },
    removeRecord (record) {
      this.$http.secured.delete(`/api/v1/records/${record.id}`)
        .then(response => {
          this.records.splice(this.records.indexOf(record), 1)
        })
        .catch(error => this.setError(error, 'Cannot delete record'))
    },
    editRecord (record) {
      this.editedRecord = record
    },
    updateRecord (record) {
      this.editedRecord = ''
      this.$http.secured.patch(`/api/v1/records/${record.id}`, { record: { title: record.title, year: record.year, artist_id: record.artist } })
        .catch(error => this.setError(error, 'Cannot update record'))
    }
  }
}
</script>
