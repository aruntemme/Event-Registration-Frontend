<template>
<div>
  <login-header />
  <div class="max-w-xs m-auto z-30 my-12 mt-32">
    <div class="container">
      <h3 class="text-4xl mb-6 ">Sign In</h3>
      <form @submit.prevent="signin">
        <div class="mb-6 mt-12">
          <label for="email" class="label">Email Address</label>
          <input type="email" v-model="email" @keyup="removeError" class="input rounded-lg" id="email" placeholder="your-name@email.com">
          <div class="text-red-700  text-sm p-1" v-if="errorEmail">{{errorEmail}}</div>
        </div>
        <div class="mb-6">
          <label for="password" class="label">Password</label>
          <input type="password" v-model="password" @keyup="removeError" class="input text-sm rounded-lg" id="password" placeholder="password">
          <div class="text-red-700 text-sm p-1" v-if="errorPassword">{{errorPassword}}</div>
        </div>
         <div class="text-red-700 p-1 text-sm" v-if="error">{{ error }}</div>
        <button type="submit" class="w-full py-4 mt-5 text-white font-bold px-4 rounded-lg cursor-pointer ">Sign In</button>
        <p class=" z-30 text-center route-link mt-5"><router-link to="/signup" >Sign up</router-link> </p>
      </form>
       <div class="flex my-14" v-if="isloading">
          <div class="m-auto">
          <spinner />
          </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import LoginHeader from './Login-Header.vue'
import Spinner from './Spinner.vue'
export default {
  name: 'Signin',
  components: {
    LoginHeader,
    Spinner
  },
  data () {
    return {
      email: '',
      password: '',
      error: '',
      errorEmail: '',
      errorPassword: '',
      isloading: false,
      // eslint-disable-next-line no-useless-escape
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  created () {
    this.isloading = false
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    // when signin button is pressed
    signin () {
      // to validate email and password
      if (this.email == null || this.email === '') {
        this.errorEmail = 'Please Enter Email'
      } else if (!this.reg.test(this.email)) {
        this.errorEmail = 'Please Enter Correct Email'
      } else {
        this.errorEmail = false
      }
      if (this.password == null || this.password === '') {
        this.errorPassword = 'Please Enter Password'
      } else if (this.password.length < 6) {
        this.errorPassword = 'Password must contain 6 characters'
      } else {
        this.errorPassword = false
      }

      // if both are true
      if (!this.errorEmail && !this.errorPassword) {
        this.isloading = true
        this.$http.plain.post('/signin', { email: this.email, password: this.password })
          .then(response => this.signinSuccessful(response))
          .catch(error => this.signinFailed(error))
      }
    },
    // !remove error message when typing again
    removeError () {
      this.errorEmail = ''
      this.error = ''
      this.errorPassword = ''
    },
    // sigin success method
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      localStorage.csrf = response.data.csrf
      localStorage.email = this.email
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('/events')
    },
    // if faled clear data and display error
    signinFailed (error) {
      this.isLoading = false
      this.error = (error.response && error.response.data && error.response.data.error) || 'Account doesnt exist'
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    // check signedin on page load
    // *if yes redirect to /events
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/events')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  background: #7a2ad6;
}

button:hover,
button:focus {
  background: #5d22a1;
}

.route-link {
  color: #5d22a1;
}

.route-link:hover,
.route-link:focus{
  color: #371261;
}

</style>
