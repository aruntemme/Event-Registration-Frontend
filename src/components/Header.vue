<template>
  <header class="bg-purple-600 py-4">
    <div class="container m-auto flex flex-wrap items-center justify-end px-4">
      <div class="flex-1 flex items-center">
        <a href="/" class="uppercase text-xl font-semibold font-mono "
          ><img src="../assets/flicks_logo.png" class="w-32" alt="flicks-logo"/></a
        >
      </div>
      <div class="flex flex-row gap-2">
        <router-link
          to="/events"
          class=" w-12/12 p-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Dashboard
        </router-link>
        <router-link
          to="/signin"
          v-if="!signedIn()"
          class=" w-12/12 p-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Sign in
        </router-link>
        <router-link
          to="/signup"
          v-if="!signedIn()"
          class=" w-12/12 p-2 text-sm font-medium bg-white text-purple-800 rounded-md hover:bg-opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Sign up
        </router-link>
        <div v-if="signedIn()" class="">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                Account<unicon name="angle-down" class="ml-2" fill="white"></unicon>
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute right-0 w-56 mt-2  origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="px-1 py-1">
                  <MenuItem class="" v-slot="{ active }">
                    <div
                      :class="[
                        active ? 'bg-violet-500 text-white' : 'text-white',
                        'group flex rounded-md items-center  w-full px-2 py-2 text-sm bg-purple-600'
                      ]"
                      v-if="signedIn()"
                      >{{ this.userEmail }}</div
                    >
                  </MenuItem>
                  <MenuItem class="" v-slot="{ active }">
                    <router-link
                      :class="[
                             active ? 'bg-violet-500 text-white' : 'text-gray-900',
                        'group flex rounded-md items-center w-full px-2 py-2 mt-1 text-sm hover:bg-purple-600'
                      ]"
                      v-if="signedIn()"
                      to="/events"
                      >All Events</router-link
                    >
                  </MenuItem>
                  <MenuItem class="" v-slot="{ active }">
                    <router-link
                      :class="[
                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                        'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-purple-600'
                      ]"
                      to="/events/new"
                      v-if="signedIn()"
                      >Create Event</router-link
                    >
                  </MenuItem>
                </div>
                <div class="px-1 py-1">
                  <MenuItem class="" v-slot="{ active }">
                    <router-link
                      :class="[
                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                        'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-purple-600'
                      ]"
                      to="/events/created"
                      v-if="signedIn()"
                      >Created Events</router-link
                    >
                  </MenuItem>
                  <MenuItem class="" v-slot="{ active }">
                    <router-link
                      :class="[
                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                        'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-purple-600'
                      ]"
                      to="/events/registered"
                      v-if="signedIn()"
                      >Registered Events</router-link
                    >
                  </MenuItem>
                </div>
                <div class="px-1 py-1">
                  <MenuItem v-slot="{ active }">
                    <button
                      v-if="signedIn()"
                      @click.prevent="signOut"
                      :class="[
                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                        'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-red-600'
                      ]"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
export default {
  name: 'Header',
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
  },
  created () {
    this.signedIn()
  },
  data () {
    return {
      userEmail: '',
      message: 'Hello world'
    }
  },
  channels: {
    ChatChannel: {
      connected () {},
      rejected () {},
      received (data) {},
      disconnected () {}
    }
  },
  methods: {
    sendMessage: function () {
      this.$cable.perform({
        channel: 'ChatChannel',
        action: 'send_message',
        data: {
          content: this.message
        }
      })
    },
    setError (error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text
    },
    signedIn () {
      this.userEmail = localStorage.email
      return localStorage.signedIn
    },
    signOut () {
      this.$http.secured
        .delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.email
          delete localStorage.signedIn
          this.$router.replace('/signin')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  },
  mounted () {
    this.$cable.subscribe({
      channel: 'ChatChannel',
      room: 'public'
    })
  }
}
</script>
<style lang="scss" scoped>
.bg-custom {
  background-color: #7a2ad6;
}
</style>
