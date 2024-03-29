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
            <router-link to="/events">All Events</router-link> >
            {{ event.title }}
          </h3>
        </li>
        <li class="py-4 mx-2 mt-6 pt-6 border-t" :key="event.id" :event="event">
          <div class="flex mt-4">
            <div class="flex flex-col gap-2 justify-between pr-4">
              <p class="flex font-semibold text-5xl items-center">
                {{ event.title }}
              </p>
              <p class="text-xl mt-4">{{ event.description }}</p>
              <div
                class="flex md:flex-row gap-2 w-full flex-wrap my-5 mb-7"
                v-html="convertIntoTags(event.tags)"
              ></div>
              <div class="flex flex-col gap-4 mt-3">
                <p class="flex felx-row gap-1"><span class="font-semibold uppercase mr-1">date: </span> {{ formatDate(event.date) }}</p>
                <p class="flex felx-row gap-1">
                  <span class="font-semibold uppercase mr-1">Location: </span> {{ event.location }}
                </p>
                <p class="flex felx-row gap-1"><span class="font-semibold uppercase mr-1">Cost: </span> ₹ {{ event.fees }}</p>
                <p class="flex felx-row gap-1">
                  <span class="font-semibold uppercase mr-1">Seats Available: </span> {{ event.maxparticipants > 0 ? event.maxparticipants : 0 }}
                </p>
                <p class="flex felx-row gap-1">
                  <span class="font-semibold uppercase mr-1">Created by: </span> {{ event.createdby === currentUser ? 'You' : event.createdby }}
                </p>
                <video width="400" controls>
                    <source :src="event.url" type="video/webm">
                    Your browser does not support HTML video.
                </video>
              </div>
            </div>
          </div>
          <div class="flex text-center justify-start">
            <button
              v-if="currentUser === event.createdby"
              class=" text-sm btn-primary ml-0 md:w-2/12 w-6/12 m-2 mt-4 font-bold p-4 rounded-md h-full "
              @click.prevent="editEvent(eventId)"
            >
              Edit
            </button>
            <button
              v-if="currentUser === event.createdby"
              class=" text-sm btn-outline-danger md:w-2/12 w-6/12 m-2  mt-4 font-bold p-4 rounded-md h-full "
              @click="openModal"
            >
              Delete
            </button>

            <button
              v-else-if="isRegistered"
              class=" text-sm btn-disabled mt-4 font-bold p-4 rounded-md h-full w-full md:w-7/12"
            >
              Registered
            </button>
            <button
              v-else-if="event.maxparticipants <= 0"
              class=" text-sm btn-disabled mt-4 font-bold p-4 rounded-md h-full w-full md:w-7/12"
            >
              Seats Filled
            </button>
            <button
              v-else
              class=" text-sm btn-primary mt-4 font-bold p-4 rounded-md h-full w-full md:w-7/12"
              @click="openRegisterModal"
            >
              Register
            </button>
          </div>
          <TransitionRoot appear :show="isOpen" as="template">
            <Dialog as="div" @close="closeModal">
              <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="min-h-screen px-4 text-center">
                  <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                  >
                    <DialogOverlay className="fixed inset-0  bg-custom-opacity" />
                  </TransitionChild>

                  <span
                    class="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                  >
                    <div
                      class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                    >
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete the Event
                      </DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          Are you sure you want to delete the event?
                        </p>
                      </div>

                      <div class="mt-4 flex flex-row gap-4">
                        <button
                          type="button"
                          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-800 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                          @click="deleteEvent(eventId)"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          @click="closeModal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
          <TransitionRoot appear :show="isRegisterOpen" as="template">
            <Dialog as="div" @close="closeRegisterModal">
              <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="min-h-screen px-4 text-center">
                  <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                  >
                    <DialogOverlay className="fixed inset-0  bg-custom-opacity" />
                  </TransitionChild>

                  <span
                    class="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                  >
                    <div
                      class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                    >
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium leading-6 text-gray-900"
                      >
                        Register for the event
                      </DialogTitle>
                      <form  @submit.prevent="registerEvent(eventId)">
                      <div v-for="form,index in registrationFormFields" :key="index">
                        <div class="mt-3">
                          <label for="names" class="label uppercase">{{form.field}} <span v-if="form.required" class="text-red-700" >*</span></label>
                          <input
                            type="text"
                            id="names"
                            class="input"
                            autocomplete="off"
                            :placeholder="'Enter '+form.field"
                            v-model="formvalues[form.field]" :required="form.required">
                      </div>
                      </div>
                      <div class="text-red-700  text-sm p-1" v-if="formerror">Please Fill all the fields</div>
                      <div class="mt-4 flex flex-row gap-4">
                        <button
                          type="submit"
                          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-800 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        >
                          Register
                        </button>
                        <button
                          type="button"
                          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          @click="closeRegisterModal"
                        >
                          Close
                        </button>
                      </div>
                      </form>
                    </div>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle
} from '@headlessui/vue'
import Spinner from './Spinner.vue'
export default {
  components: {
    Header,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    Spinner
  },
  // configs for headless ui dialog box
  setup () {
    const isOpen = ref(false)
    const isRegisterOpen = ref(false)
    return {
      isOpen,
      isRegisterOpen,
      closeModal () {
        isOpen.value = false
      },
      openModal () {
        isOpen.value = true
      },
      openRegisterModal () {
        isRegisterOpen.value = true
      },
      closeRegisterModal () {
        isRegisterOpen.value = false
      }
    }
  },
  name: 'Events',
  data () {
    return {
      name: '',
      event: [],
      error: '',
      currentUser: '',
      isRegistered: false,
      formvalues: {},
      formerror: false,
      isloading: false,
      registrationFormFields: false
    }
  },
  created () {
    this.isloading = true
    this.formerror = false
    this.formvalues = {}
    this.eventId = this.$route.params.id
    this.currentUser = localStorage.email
    // render events data
    this.$http.secured
      .get(`/api/v1/events/${this.$route.params.id}`)
      .then(response => {
        this.event = response.data.event
        this.event.url = response.data.video_url
        if (response.data.event.configurefields) {
          this.registrationFormFields = JSON.parse(response.data.event.configurefields)
          Object.keys(this.registrationFormFields).forEach(i => {
            this.formvalues[this.registrationFormFields[i].field] = ''
            this.isloading = false
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.$router.replace('/events')
        this.setError(error, 'Something went wrong')
      })
      // check if he is registered or not?
    this.$http.secured
      .get(`/api/v1/registrations?event_id=${this.$route.params.id}`)
      .then(response => {
        if (response.data[0].id === parseInt(this.$route.params.id, 10)) {
          this.event = response.data[0]
          this.isRegistered = true
          this.isloading = false
        }
      })
      .catch(error => this.setError(error, 'Something went wrong'))
  },
  methods: {
    convertIntoTags (tags) {
      if (tags) {
        const tagsArray = tags.split(',')
        let appendString = ''
        tagsArray.forEach(tag => {
          appendString += `<div class="rounded-lg py-1 px-2 w-m-xl bg-black bg-opacity-20 border border-gray-400 text-center">${tag}</div>`
        })
        return appendString
      }
    },
    // method to delete the event in db and state
    deleteEvent (id) {
      this.$http.secured
        .delete(`/api/v1/events/${id}`)
        .then(response => {
          if (response.data.status === 'success') {
            this.$router.replace('/events')
            this.events.splice(this.event.indexOf(id), 1)
          }
        })
        .catch(error => this.setError(error, 'Cannot delete Event'))
    },
    // edit reroute to CreateEvent page
    editEvent (id) {
      this.$router.replace(`/events/${id}/edit`)
    },
    // to register the event (form fields for register events are dynamically generated)
    registerEvent (id) {
      this.isRegistered = false
      this.$http.secured.post('/api/v1/registrations/', { registration: { event_id: id, formdata: JSON.stringify(this.formvalues) }, event_id: id })
        .then(response => {
          this.formerror = false
          if (response.data.status === 'success') {
            this.isloading = false
            this.event = response.data.event
            this.isRegistered = true
            this.closeRegisterModal()
          }
          this.registrations.push(response.data)
        })
        .catch(error => this.setError(error, 'Cannot create event'))
    },
    formatDate (input) {
      if (input) {
        input = input.substring(0, 10)
        const datePart = input.match(/\d+/g)
        const year = datePart[0].substring(0)
        const month = datePart[1]; var day = datePart[2]
        return day + '-' + month + '-' + year
      }
    },
    setError (error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-custom-opacity {
  background-color: rgba(165, 165, 165, 0.74);
}
</style>
