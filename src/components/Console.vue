<template>
  <div class="console">
    <router-view v-if="this.$store.state.allCourses.length !== 0"></router-view>
    <div v-else class = "pulling">
      <div class = "loader"></div>
      <h3>Loading {{ this.$store.state.schoolName }} courses</h3>
    </div>
</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import Sidebar from '../components/Sidebar'
import { pullCourses } from '../networking/database'

export default {
  name: 'Console',
  components: {
    Sidebar
  },
  data () {
    return {
      msg: this.message,
      login: false,
      season: 'Summer 2018',
      obj: {
        color: 'red',
        fontSize: '50px'
      },
      seasons: [
        { name: 'Summer 2018' },
        { name: 'Spring 2018' },
        { name: 'Fall 2017' }
      ]
    }
  },
  mounted () {
    if (this.$store.state.allCourses.length === 0) {
      this.chooseSchool(this.$route.params.school)
    }
  },
  methods: {
    logIn: function () {
      var provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken
        console.log(token)
        // The signed-in user info.
        var user = result.user
        console.log(user)
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        console.log(errorCode, errorMessage, email, credential)
        // ...
      })
    },
    chooseSchool: async function (school) {
      pullCourses(school)
    }
  },
  computed: {
    reversedMessage: function () {
      return this.msg.split('').reverse().join('')
    }
  }
}
</script>

<style scoped>

.text {
  font-size: 14px;
  padding-left: 15px;
}

a {
  color: white;
}

.console {
  background-color: var(--light-gray);
  width: 100%;
  display: flex;
  flex-grow: 1;
  font-size: 14px;
}

.topBar {
  flex-basis: 50px;
  background-color: var(--dark-red);
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
  z-index: 15;
}

.dropdown:focus {
  outline: none;
}

.linkBtn {
  color: var(--unselected-link);
  font-size: 14px;
  padding-left: 0px;
}

.linkBtn:focus {
  text-decoration: none;
}

.linkBtn:hover {
  text-decoration: underline;
}

.profilePicture {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.navbar-brand.picture {
  margin: 0px;
}

.built {
  color: var(--unselected-link);
  font-size: 12px;
}

.btn-sm {
  margin-left: 20px;
}

.loginBox {
  background-color: white;
  width: 250px;
  position: fixed;
  right: 10px;
  top: 45px;
  box-shadow: 0px 4px 5px rgb(175, 175, 175);
  padding: 14px;
}

.btn-group {
  display: flex;
  justify-content: center;
  padding: 15px 15px 5px 15px;
  background-color: var(--light-body);
}

.btn-secondary {
  width: 100px;
  padding: 5px 15px 10px 15px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.white {
  color: white;
  font-size: 14px;
}

.material-icons {
  color: white;
  font-size: 24px;
  margin-top: 6px;
}

.pulling {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.loader {
  border: 8px solid lightgray; /* Light grey */
  border-top: 8px solid var(--red); /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  /* margin: auto; */
  margin-top: 55px;
  margin-bottom: 25px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
