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
          v-model.trim="newEvent.tags">
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
      <p class="uppercase font-semibold mt-4 mb-1"> List down the fields for participants</p>
      <p class="uppercase text-xs my-1 mb-3">Example: (name, email, phonenumber)</p>
        <div class="form-group" v-for="(field, index) in configurefields" :key="index">
          <div class="flex flex-row md:justify-between gap-1">
            <div class="flex md:flex-row flex-col gap-1">
              <div class="mt-2">
                <label for="event_fields" class="label">Field Name</label>
                <input
                  type="text"
                  class="input"
                  autocomplete="off"
                  @keypress="removeError"
                  placeholder="Enter Field Name"
                  v-model="field.field">
              </div>
              <div class="my-2 md:self-end">
                <input type="checkbox" class="ml-2" :id="index" v-model="field.required">
                <label class="ml-3" :for="index">{{ Required }}</label>
            </div>
          </div>
          <div class="flex felx-row gap-1">
            <button type="button" class="md:mt-5 mt-9 md:self-end border-2 text-xl bg-green-100 border-green-600 w-12 md:h-10 h-8 rounded-lg" @click="addAnotherField(index)" v-show="index == configurefields.length-1"> + </button>
            <button type="button" class="md:mt-5 mt-9 md:self-end border-2 text-xl bg-red-100 border-red-600 w-12 md:h-10 h-8 rounded-lg" @click="removeCurrentField(index)" v-show="index || ( !index && configurefields.length > 1)"> -</button>
          </div>
        </div>
      </div>
      <div class="text-red-700  text-sm p-1" v-if="responseError">{{responseError}}</div>
       <div class="flex my-14" v-if="isloading">
          <div class="m-auto">
            <spinner />
          </div>
        </div>
      <input type="submit" v-if="isEdit" value="Update Event" class="mt-8 btn-primary p-4 w-full rounded-md font-semibold cursor-pointer text-white">
      <input type="submit" v-else value="Add Event" class="mt-8 btn-primary p-4 w-full rounded-md font-semibold cursor-pointer text-white">
    </form>
  </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import Spinner from './Spinner'
export default {
  components: {
    Header,
    Spinner
  },
  name: 'CreateEvent',
  data () {
    return {
      newEvent: [],
      error: [],
      responseError: '',
      isLoading: false,
      isEdit: false,
      configurefields: [{
        field: '',
        required: true
      }]
    }
  },
  created () {
    this.isLoading = false
    // kick him if not logged in
    if (!localStorage.signedIn) {
      this.$router.replace('/events')
    }
    this.isEdit = false
    // when route is events/:id/edit
    if (this.$route.name === 'EditEvent') {
      this.isEdit = true
      this.eventId = this.$route.params.id
      this.currentUser = localStorage.email
      this.isLoading = true
      this.$http.secured
        .get(`/api/v1/events/${this.$route.params.id}`)
        .then(response => {
          // set existing data into the field
          this.setCurrentEvent(response.data)
        })
        .catch(error => this.setError(error, 'Something went wrong'))
    }
  },
  methods: {
    // add field for custom input fields
    addAnotherField () {
      this.configurefields.push({
        field: '',
        required: true
      })
    },
    // remove field for custom input fields
    removeCurrentField (index) {
      this.configurefields.splice(index, 1)
    },
    // render current event by setting data newEvent from server response
    setCurrentEvent (EventData) {
      this.newEvent = EventData
      this.newEvent.date = this.newEvent.date.substring(0, 10)
      this.configurefields = JSON.parse(EventData.configurefields)
      this.isLoading = false
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
    // add this event to the server + state
    addEvent () {
      this.responseError = ''
      const isNumber = true
      const value = this.newEvent
      // validate input fields
      this.error.title = this.validate(value.title)
      this.error.description = this.validate(value.description)
      this.error.location = this.validate(value.location)
      this.error.fees = this.validate(value.fees, isNumber)
      this.error.maxparticipants = this.validate(value.maxparticipants, isNumber)
      this.error.tags = this.validate(value.tags)
      this.error.date = this.validate(value.date)
      const inputData = {
        title: value.title,
        description: value.description,
        location: value.location,
        fees: value.fees,
        maxparticipants: value.maxparticipants,
        tags: value.tags,
        date: value.date,
        configurefields: JSON.stringify(this.configurefields),
        createdby: localStorage.email
      }
      if (!this.error.title &&
        !this.error.description &&
        !this.error.location &&
        !this.error.fees &&
        !this.error.tags &&
        !this.error.maxparticipants &&
        !this.error.date) {
        // if the route is events/:id/edit then update
        if (this.isEdit) {
          this.isLoading = true
          this.$http.secured.patch(`/api/v1/events/${this.eventId}`, { event: inputData })
            .then(response => {
              if (response.data.status === 'success') {
                this.$router.replace(`/events/${this.eventId}`)
                this.newEvent = []
                this.isLoading = false
              }
            })
            .catch(error => this.setError(error, 'Cannot update Event'))
        // else insert
        } else {
          this.isLoading = true
          this.$http.secured.post('/api/v1/events/', { event: inputData })
            .then(response => {
              if (response.data.status === 'success') {
                this.$router.replace('/events')
                this.events.push(response.data.event)
                this.newEvent = []
                this.isLoading = false
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
