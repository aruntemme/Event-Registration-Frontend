<template>
<div>
<Header />

  <div class=" w-10/12 md:w-5/12 m-auto py-10">
    <h3 class="text-md font-mono uppercase font-semibold text-gray-700 ml-0 mx-2" >
    <router-link to="/events">All Events</router-link> > New Event
  </h3>
        <form class="mt-6 pt-6 border-t" @submit.prevent="addEvent">
      <div class="mb-6 form-group">
        <label for="event_title" class="label">Event Name</label>
        <input
          :class="{'danger-input': error.title }"
          type="text"
          id="event_title"
          class="input"
          autofocus
          @keypress="removeError"
          autocomplete="off"
          placeholder="Type Event Name"
          v-model.trim="newEvent.title">
        <div class="text-red-700  text-sm p-1" v-if="error.title">{{error.title}}</div>
      </div>
      <div class="mb-6">
        <label for="event_description" class="label">Event Description</label>
        <textarea
          type="text"
          :class="{'danger-input': error.description }"
          @keypress="removeError"
          id="event_description"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Type Event Description"
          v-model="newEvent.description"></textarea>
        <div class="text-red-700  text-sm p-1" v-if="error.description">{{error.description}}</div>
      </div>
      <div class="mb-6">
        <label for="event_duration" class="label">Duration</label>
        <input
          type="text"
          :class="{'danger-input': error.duration }"
          @keypress="removeError"
          id="event_duration"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Duration of the event ( --h --m)"
          v-model="newEvent.duration">
       <div class="text-red-700  text-sm p-1" v-if="error.duration">{{error.duration}}</div>
      </div>
      <div class="mb-6">
        <label for="event_date" class="label">Date</label>
        <input
          type="date"
          id="event_date"
          class="input"
          autofocus
          :class="{'danger-input': error.date }"
          @keypress="removeError"
          autocomplete="off"
          placeholder="Type Date"
          v-model="newEvent.date">
        <div class="text-red-700  text-sm p-1" v-if="error.date">{{error.date}}</div>
      </div>
      <div class="mb-6">
        <label for="event_location" class="label">Location</label>
        <input
          type="text"
          id="event_location"
          class="input"
          :class="{'danger-input': error.location }"
          @keypress="removeError"
          autocomplete="off"
          placeholder="Type Location"
          v-model="newEvent.location">
        <div class="text-red-700  text-sm p-1" v-if="error.location">{{error.location}}</div>
      </div>

      <div class="mb-6">
        <label for="event_fees" class="label">Fees</label>
        <input
          type="number"
          id="event_fees"
          class="input"
          :class="{'danger-input': error.fees }"
          @keypress="removeError"
          autocomplete="off"
          placeholder="Fees (in rupees)"
          v-model="newEvent.fees">
        <div class="text-red-700  text-sm p-1" v-if="error.fees">{{error.fees}}</div>
      </div>
      <div class="mb-6">
        <label for="event_tags" class="label">Tags</label>
        <input
          type="text"
          id="event_tags"
          class="input"
          :class="{'danger-input': error.tags }"
          @keypress="removeError"
          autocomplete="off"
          placeholder="Enter tags separated by , (comma)"
          v-model="newEvent.tags">
        <div class="text-red-700  text-sm p-1" v-if="error.tags">{{error.tags}}</div>
      </div>
      <div class="mb-6">
        <label for="event_max_participants" class="label">Maxmimum Participants</label>
        <input
          type="number"
          id="event_max_participants"
          class="input"
          autocomplete="off"
          :class="{'danger-input': error.maxparticipants }"
          @keypress="removeError"
          placeholder="Enter number of people can participate"
          v-model="newEvent.maxparticipants">
        <div class="text-red-700  text-sm p-1" v-if="error.maxparticipants">{{error.maxparticipants}}</div>
      </div>
      <div class="mb-6">
        <label for="event_fields" class="label">Required Fields</label>
        <input
          type="text"
          id="event_fields"
          class="input"
          autocomplete="off"
          :class="{'danger-input': error.configurefields }"
          @keypress="removeError"
          placeholder="Enter "
          v-model="newEvent.configurefields">
        <div class="text-red-700  text-sm p-1" v-if="error.configurefields">{{error.configurefields}}</div>
      </div>
        <div class="text-red-700  text-sm p-1" v-if="responseError">{{responseError}}</div>

      <input type="submit" v-if="isEdit" value="Update Event" class="btn-primary p-4 w-full rounded-md font-semibold cursor-pointer text-white">
      <input type="submit" v-else value="Add Event" class="btn-primary p-4 w-full rounded-md font-semibold cursor-pointer text-white">
    </form>
  </div>
  </div>
</template>

<script>
import Header from './Header.vue'
export default {
  components: {
    Header
  },
  name: 'CreateEvent',
  data () {
    return {
      newEvent: [],
      error: [],
      responseError: '',
      isEdit: false
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/signin')
    }
    this.isEdit = false
    if (this.$route.name === 'EditEvent') {
      this.isEdit = true
      this.eventId = this.$route.params.id
      this.currentUser = localStorage.email
      this.$http.secured
        .get(`/api/v1/events/${this.$route.params.id}`)
        .then(response => {
          this.setCurrentEvent(response.data)
        })
        .catch(error => this.setError(error, 'Something went wrong'))
    }
  },
  methods: {
    setCurrentEvent (EventData) {
      this.newEvent = EventData
    },
    // remove error message when typing again
    removeError () {
      this.error = []
      this.responseError = ''
    },
    setError (error, text) {
      this.responseError = (error.response && error.response.data && error.response.data.error) || text
    },
    isNumeric (value) {
      if (!Number.isInteger(value)) {
        return 'Enter Only Numbers'
      }
    },
    validate (value, isNumber = false) {
      if (value == null || value === '') {
        return 'Please fill this Field'
      } else if (isNumber) {
        this.isNumeric(value)
      } else {
        return false
      }
    },
    addEvent () {
      this.responseError = ''
      const isNumber = true
      const value = this.newEvent
      this.error.title = this.validate(value.title)
      this.error.description = this.validate(value.description)
      this.error.duration = this.validate(value.duration)
      this.error.location = this.validate(value.location)
      this.error.fees = this.validate(value.fees, isNumber)
      this.error.maxparticipants = this.validate(value.maxparticipants, isNumber)
      this.error.tags = this.validate(value.tags)
      this.error.date = this.validate(value.date)
      this.error.configurefields = this.validate(value.configurefields)
      const inputData = {
        title: value.title,
        description: value.description,
        duration: value.duration,
        location: value.location,
        fees: value.fees,
        maxparticipants: value.maxparticipants,
        tags: value.tags,
        date: value.date,
        configurefields: value.configurefields,
        createdby: localStorage.email
      }
      console.log(inputData)
      if (!this.error.title &&
        !this.error.description &&
        !this.error.duration &&
        !this.error.location &&
        !this.error.fees &&
        !this.error.tags &&
        !this.error.maxparticipants &&
        !this.error.configurefields &&
        !this.error.date) {
        console.log('complete')
        if (this.isEdit) {
          this.$http.secured.patch(`/api/v1/events/${this.eventId}`, { event: inputData })
            .then(response => {
              if (response.data.status === 'success') {
                this.$router.replace(`/events/${this.eventId}`)
                this.newEvent = []
              }
            })
            .catch(error => this.setError(error, 'Cannot update record'))
        } else {
          this.$http.secured.post('/api/v1/events/', { event: inputData })
            .then(response => {
              if (response.data.status === 'success') {
                this.$router.replace('/events')
                this.events.push(response.data.event)
                this.newEvent = []
              }
            })
            .catch(error => this.setError(error, 'Cannot create Event'))
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-group--error {
  input {
    border: 1px solid red !important;
  }
}

.danger-input {
  border: 1px solid  rgb(185, 28, 28) !important;
}
</style>
