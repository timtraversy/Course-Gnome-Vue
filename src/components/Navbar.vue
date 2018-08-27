<template>
  <nav class="navbar navbar-dark topBar">
    <div class="dropdown">
      <!-- <button v-on:click = "openMobileNav()" v-if="$mq !== 'lg'" class="btn btn-link linkBtn" type="button" >
      <i class="material-icons">menu</i>
    </button> -->
      <!-- <button class="btn btn-link linkBtn">GWU - Fall 2018</button> -->
      <router-link to="/">
        <button class="btn btn-link linkBtn" type="button" id="seasonDropdown">
          {{ school }} <i v-if="school" class = "material-icons">edit</i>
        </button>
      </router-link>
    </div>
    <div class = "built">
      <!-- Built by <a href="https:///timtraversy.github.io" target="blank">Tim!</a> -->
      <button type="button" class="btn btn-sm cg-btn-light" v-on:click="login = !login">Log In</button>
    </div>
    <div class = "loginBox" v-if="login" v-click-outside="closeLogin">
      <!-- <div id="firebaseui-auth-container"></div> -->
      <!-- <div id="loader">Loading...</div> -->
      <!-- <form novalidate>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required>
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-primary">Sign In</button>
      </form> -->
    </div>
  </nav>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'Requirements',
  directives: {
    ClickOutside
  },
  computed: {
    school: function () {
      if (this.$route.params.school) {
        if (this.$route.params.school === 'gwu') {
          return 'GWU - Fall 2018'
        } else {
          return 'Emerson - Fall 2018'
        }
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      login: false,
      seasons: ['Emerson - Fall 2018']
    }
  },
  methods: {
    closeLogin: function () {
      if (this.login) {
        this.login = false
      }
    }
  }
}
</script>

<style scoped>

.topBar {
  background-color: rgb(170, 0, 0);
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
  z-index: 15;
  height: 54px;
}

.dropdown {
  color: var(--body);
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
  top: 55px;
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
  font-size: 14px;
}

.text {
  font-size: 14px;
  padding-left: 15px;
  color: var(--body)
}

a {
  color: white;
}

</style>
