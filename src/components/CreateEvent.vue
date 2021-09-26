<template>
<div>
<Header />
<form @submit.prevent="submit">
  <div class="form-group" :class="{ 'form-group--error': $v.name.$error }">
    <label class="form__label">Name</label>
    <input class="form__input" v-model.trim="$v.name.$model"/>
  </div>
  <div v-if="$v.name.$error">
    <div class="error" v-if="!$v.name.required">Name is required</div>
    <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
  </div>

  <button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Submit!</button>
  <p class="typo__p" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
  <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
  <p class="typo__p" v-if="submitStatus === 'PENDING'">Sending...</p>
</form>
  <div class=" w-10/12 md:w-5/12 m-auto py-10">
        <form @submit.prevent="addEvent">
      <div class="mb-6 form-group">
        <label for="event_title" class="label">Event Name</label>
        <input
          type="text"
          id="event_title"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Type Event Name"
          v-model.trim="newEvent.title">
      </div>
      <div class="mb-6">
        <label for="event_description" class="label">Event Description</label>
        <textarea
          type="text"
          id="event_description"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Type Event Description"
          v-model="newEvent.description"></textarea>
      </div>
      <div class="mb-6">
        <label for="event_duration" class="label">Duration</label>
        <input
          type="text"
          id="event_duration"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Duration of the event ( --h --m)"
          v-model="newEvent.duration">
      </div>
      <div class="mb-6">
        <label for="event_date" class="label">Date</label>
        <input
          type="date"
          id="event_date"
          class="input"
          autofocus
          autocomplete="off"
          placeholder="Type Date"
          v-model="newEvent.date">
      </div>
      <div class="mb-6">
        <label for="event_location" class="label">Location</label>
        <input
          type="text"
          id="event_location"
          class="input"
          autocomplete="off"
          placeholder="Type Location"
          v-model="newEvent.location">
      </div>

      <div class="mb-6">
        <label for="event_fees" class="label">Fees</label>
        <input
          type="number"
          id="event_fees"
          class="input"
          autocomplete="off"
          placeholder="Fees (in rupees)"
          v-model="newEvent.fees">
      </div>
      <div class="mb-6">
        <label for="event_tags" class="label">Tags</label>
        <input
          type="text"
          id="event_tags"
          class="input"
          autocomplete="off"
          placeholder="Enter tags separated by , (comma)"
          v-model="newEvent.tags">
      </div>
      <div class="mb-6">
        <label for="event_max_participants" class="label">Maxmimum Participants</label>
        <input
          type="number"
          id="event_max_participants"
          class="input"
          autocomplete="off"
          placeholder="Enter number of people can participate"
          v-model="newEvent.maxparticipants">
      </div>
      <div class="mb-6">
        <label for="event_fields" class="label">Required Fields</label>
        <input
          type="text"
          id="event_fields"
          class="input"
          autocomplete="off"
          placeholder="Enter "
          v-model="newEvent.configurefields">
      </div>

      <input type="submit" value="Add Event" class="btn-primary p-4 w-full rounded-md font-semibold cursor-pointer text-white">
    </form>
  </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import { required, minLength } from 'vuelidate/lib/validators'
export default {
  components: {
    Header
  },
  name: 'CreateEvent',
  data () {
    return {
      newEvent: {
        title: '',
        description: ''
      },
      name: '',
      age: 0,
      submitStatus: null,
      events: [],
      error: ''
    }
  },
  validations: {
    newEvent: {
      title: {
        required,
        minLength: minLength(5)
      },
      description: {
        required,
        minLength: minLength(8)
      }
    },
    name: {
      required,
      minLength: minLength(4)
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/')
    }
  },
  methods: {
    submit () {
      console.log('submit!')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
        this.submitStatus = 'PENDING'
        setTimeout(() => {
          this.submitStatus = 'OK'
        }, 500)
      }
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    addEvent () {
      this.v$.$touch()
      if (this.v$.$pending || this.v$.$error) return
      const value = this.newEvent
      if (!value) {
        return
      }
      console.log(this.newEvent)
      // this.$http.secured.post('/api/v1/events/', { record: { title: this.newEvent.title, year: this.newEvent.year, artist_id: this.newEvent.artist } })

      //   .then(response => {
      //     this.events.push(response.data)
      //     this.newEvent = ''
      //   })
      //   .catch(error => this.setError(error, 'Cannot create record'))
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
</style>
