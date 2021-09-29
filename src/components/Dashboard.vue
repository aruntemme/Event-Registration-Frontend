<template>
<div>
<Header />
<div class="flex h-screen" v-if="isloading">
  <div class="m-auto">
  <spinner />
  </div>
</div>
  <div v-else class=" w-10/12 md:w-6/12 m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>

    <ul class="list-reset mt-4">
      <li><h3 class="text-md font-mono uppercase font-semibold text-gray-700 border-b mb-4 pb-6 mx-2"><router-link to="/events">All Events</router-link>{{title}}</h3></li>
      <h3 class="py-4 mx-2 uppercase font-semibold font-mono text-2xl" v-if="emptyEvent"> no events </h3>
      <li class="py-4 mx-2" v-for="event in availableEvents" :key="event.title" :event="event">
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
              <p class="text-black">{{ formatDate(event.date) }}</p>
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
import Spinner from './Spinner.vue'

export default {
  components: {
    Header,
    Spinner
  },
  name: 'Events',
  data () {
    return {
      events: [],
      error: '',
      title: '',
      userEmail: '',
      emptyEvent: false,
      isloading: false
    }
  },
  // render cards again whenever the route changes
  watch: {
    $route (to, from) {
      this.renderCurrentCards()
    }
  },
  // filter available events
  computed: {
    availableEvents () {
      return this.events.filter(event => event.maxparticipants > 0)
    }
  },
  created () {
    this.isloading = true
    this.userEmail = localStorage.email
    this.renderCurrentCards()
  },
  methods: {
    // render events cards based on the routes
    renderCurrentCards () {
      this.isloading = true
      this.emptyEvent = false
      this.events = []
      // events created by the user
      if (this.$route.name === 'created') {
        if (!localStorage.csrf) {
          this.$router.replace('/events')
        }
        this.$http.secured.get('/api/v1/events?current_user=1')
          .then((response) => {
            if (response.data.length <= 0) {
              this.emptyEvent = true
            }
            this.events = response.data
            this.isloading = false
            this.title = ' > Created Events'
          })
          .catch(error => this.setError(error, 'Something went wrong'))
          // events registered by the user
      } else if (this.$route.name === 'Registered') {
        this.$http.secured.get('/api/v1/registrations?current_user=1')
          .then(response => {
            if (response.data.length <= 0) {
              this.emptyEvent = true
            }
            this.events = response.data
            this.isloading = false
            this.title = ' > Registered Events'
          })
          // all events
      } else {
        this.$http.secured.get('/api/v1/events?all=1')
          .then((response) => {
            if (response.data.length <= 0) {
              this.emptyEvent = true
            }
            this.events = response.data
            this.isloading = false
            this.title = ''
          })
          .catch(error => this.setError(error, 'Something went wrong'))
      }
    },
    // format the date input
    formatDate (input) {
      input = input.substring(0, 10)
      const datePart = input.match(/\d+/g)
      const year = datePart[0].substring(0)
      const month = datePart[1]; var day = datePart[2]
      return day + '-' + month + '-' + year
    },
    // component for small tags in the card
    convertIntoTags (tags) {
      const tagsArray = tags.split(',')
      let appendString = ''
      tagsArray.forEach(tag => {
        appendString += `<div class="rounded-lg py-1 px-2 w-m-xl bg-black bg-opacity-20 border text-center">${tag}</div>`
      })
      return appendString
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    }
  }
}
</script>
