<template>
  <div>
    <Header />
    <div class=" w-10/12 md:w-6/12 m-auto py-10">
      <ul class="list-reset mt-4">
        <li>
          <h3
            class="text-md font-mono uppercase font-semibold text-gray-700 mx-2"
          >
            <router-link to="/events">All Events</router-link> >
            {{ event.title }}
          </h3>
        </li>
        <li class="py-4 mx-2 mt-6 pt-6 border-t" :key="event.id" :record="event">
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
                <p class="flex felx-row gap-1"><span class="font-semibold uppercase mr-1">date: </span> {{ event.date }}</p>
                <p class="flex felx-row gap-1">
                  <span class="font-semibold uppercase mr-1">Location: </span> {{ event.location }}
                </p>
                <p class="flex felx-row gap-1">
                 <span class="font-semibold uppercase mr-1">Duration: </span> {{ secondsToHms(event.duration) }}
                </p>
                <p class="flex felx-row gap-1"><span class="font-semibold uppercase mr-1">Cost: </span> ₹ {{ event.fees }}</p>
                <p class="flex felx-row gap-1">
                  <span class="font-semibold uppercase mr-1">Seats Available: </span> {{ event.maxparticipants > 0 ? event.maxparticipants : 0 }}
                </p>
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
                        Register
                      </DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                         Register for the event
                        </p>
                      </div>
                      <div class="mt-3">
                        <label for="names" class="label">Name</label>
                        <input
                          type="text"
                          id="names"
                          class="input"
                          autocomplete="off"
                          placeholder="Enter name"
                          v-model="name">
                      </div>

                      <div class="mt-4 flex flex-row gap-4">
                        <button
                          type="button"
                          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-800 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                          @click="registerEvent(eventId)"
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
export default {
  components: {
    Header,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle
  },
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
      isRegistered: false
    }
  },
  created () {
    this.eventId = this.$route.params.id
    this.currentUser = localStorage.email
    this.$http.secured
      .get(`/api/v1/events/${this.$route.params.id}`)
      .then(response => {
        this.event = response.data
      })
      .catch(error => this.setError(error, 'Something went wrong'))
    this.$http.secured
      .get(`/api/v1/registrations?event_id=${this.$route.params.id}`)
      .then(response => {
        console.log(response)
        if (response.data[0].id === parseInt(this.$route.params.id, 10)) {
          this.event = response.data[0]
          this.isRegistered = true
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
    secondsToHms (value) {
      const sec = parseInt(value, 10)
      let hours = Math.floor(sec / 3600)
      let minutes = Math.floor((sec - hours * 3600) / 60)
      let seconds = sec - hours * 3600 - minutes * 60
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      // eslint-disable-next-line eqeqeq
      if (hours == 0) {
        return +minutes + ' minutes' // Return in MM:SS format
      } else {
        let hoursText = ' hours'
        if (hours === 1) {
          hoursText = ' hour'
        }
        return hours + hoursText + minutes + 'minutes' // Return in HH:MM:SS format
      }
    },
    deleteEvent (id) {
      this.$http.secured
        .delete(`/api/v1/events/${id}`)
        .then(response => {
          if (response.data.status === 'success') {
            this.$router.replace('/events')
            this.events.splice(this.records.indexOf(id), 1)
          }
        })
        .catch(error => this.setError(error, 'Cannot delete Event'))
    },
    editEvent (id) {
      this.$router.replace(`/events/${id}/edit`)
    },
    registerEvent (id) {
      this.isRegistered = false
      this.$http.secured.post('/api/v1/registrations/', { registration: { event_id: id }, event_id: id })
        .then(response => {
          console.log(response.data.status)
          console.log(response)
          if (response.data.status === 'success') {
            this.event = response.data.event[0]
            this.isRegistered = true
            this.closeRegisterModal()
          }
          this.registrations.push(response.data)
        })
        .catch(error => this.setError(error, 'Cannot create record'))
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
