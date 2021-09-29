<template>
<div>
    <login-header />
  <div class="max-w-xs m-auto z-30 my-12 mt-32">
    <div class="container">
      <h3 class="text-4xl mb-6 ">Sign Up</h3>
      <form @submit.prevent="signup">
        <div class="mb-6 mt-12">
          <label for="email" class="label">Email Address</label>
          <input type="email" v-model="email" @keyup="removeError" class="input rounded-lg" id="email" placeholder="your-name@email.com">
          <div class="text-red-700 p-1" v-if="errorEmail">{{errorEmail}}</div>
        </div>

        <div class="mb-6">
          <label for="password" class="label">Password</label>
          <input type="password" v-model="password" @keyup="removeError" class="input text-sm rounded-lg" id="password" placeholder="Password">
          <div class="text-red-700  text-sm p-1" v-if="errorPassword">{{errorPassword}}</div>
        </div>

        <div class="mb-6">
          <label for="password_confirmation" class="label">Password Confirmation</label>
          <input type="password" v-model="password_confirmation" @keyup="removeError" class="input text-sm rounded-lg" id="password_confirmation" placeholder="Password Confirmation">
          <div class="text-red-700 text-sm p-1" v-if="errorConfirmPassword">{{errorConfirmPassword}}</div>
        </div>
        <div class="text-red-700 p-1" v-if="error">{{ error }}</div>
        <button type="submit" class="w-full py-4 mt-5 text-white font-bold px-4 rounded-lg cursor-pointer ">Sign Up</button>
        <p class=" z-30 text-center route-link mt-5"><router-link to="/" >Sign In</router-link> </p>
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
  name: 'Signup',
  components: {
    LoginHeader,
    Spinner
  },
  data () {
    return {
      email: '',
      password: '',
      password_confirmation: '',
      error: '',
      errorEmail: '',
      errorPassword: '',
      errorConfirmPassword: '',
      isloading: false,
      // eslint-disable-next-line no-useless-escape
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  created () {
    this.isloading = false
    this.checkedSignedIn()
  },
  updated () {
    this.checkedSignedIn()
  },
  methods: {
    signup () {
      // validate fields
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
      if (this.password_confirmation == null || this.password_confirmation === '') {
        this.errorConfirmPassword = 'Please Confirm Password'
      } else if (this.password !== this.password_confirmation) {
        this.errorConfirmPassword = "Password doesn't match"
      } else {
        this.errorConfirmPassword = false
      }
      if (!this.errorEmail && !this.errorConfirmPassword) {
        this.isloading = true
        this.$http.plain.post('/signup', { email: this.email, password: this.password_confirmation })
          .then(response => this.signupSuccessful(response))
          .catch(error => this.signupFailed(error))
      }
    },
    removeError () {
      this.errorEmail = ''
      this.error = ''
      this.errorPassword = ''
    },
    // if sign up success redirect to /events
    signupSuccessful (response) {
      if (!response.data.csrf) {
        this.signupFailed(response)
        return
      }

      localStorage.csrf = response.data.csrf
      localStorage.email = this.email
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('/events')
    },
    // else display error
    signupFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    // *check signed in on page load and redirect to /events
    checkedSignedIn () {
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
