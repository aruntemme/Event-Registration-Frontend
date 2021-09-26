<template>
<div>
<Header />
  <div class=" w-10/12 md:w-6/12 m-auto py-10">

    <ul class="list-reset mt-4">
      <li><h3 class="text-md font-mono uppercase font-semibold text-gray-700 mx-2"> <router-link to="/events">All Events</router-link> > {{event.title}}</h3></li>
      <li class="py-4 mx-2 mt-7 border-t" :key="event.id" :record="event">
        <div class="flex mt-4">
          <div class="flex flex-col gap-2 justify-between pr-4">
          <p class="flex font-semibold text-5xl items-center">
            {{ event.title }}
          </p>
          <p class="text-xl mt-4"> {{ event.description }}</p>
          <div class="flex flex-row gap-2 mt-4"  v-html="convertIntoTags(event.tags)"></div>
          <div class="flex flex-row gap-4 mt-3">
            <p class="flex felx-row gap-1"><ClockTimeFiveOutline :size="22" /> {{ secondsToHms(event.duration) }}</p>
            <p class="flex felx-row gap-1">₹ {{ event.fees }}</p>
            <p class="flex felx-row gap-1"><AccountMultipleCheckOutline :size="22" />{{ event.maxparticipants }}</p>
          </div>
        </div>
        </div>
        <div class="flex text-center justify-start">
            <button class=" text-sm btn-primary mt-4 font-bold p-4 rounded-md h-full w-7/12 "
          @click.prevent="removeRecord(event)">Register</button>
         </div>
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
      event: [],
      error: ''
    }
  },
  created () {
    this.$http.secured.get(`/api/v1/events/${this.$route.params.id}`)
      .then(response => { this.event = response.data })
      .catch(error => this.setError(error, 'Something went wrong'))
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
    }
  }
}
</script>
