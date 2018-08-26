<template>
  <nav class="navbar navbar-dark topBar">
    <div class="dropdown">
      <!-- <button v-on:click = "openMobileNav()" v-if="$mq !== 'lg'" class="btn btn-link linkBtn" type="button" >
        <i class="material-icons">menu</i>
      </button> -->
      <!-- <button class="btn btn-link linkBtn">Fall 2018</button> -->
      <!-- <button class="btn btn-link dropdown-toggle linkBtn" type="button" id="seasonDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ season }}
    </button>
    <div class="dropdown-menu" aria-labelledby="seasonDropdown">
    <a v-for="season in seasons" v-bind:key="season.name" class="dropdown-item text" href="#">{{ season.name }}</a>
  </div> -->
    </div>
    <div class = "built">
      <!-- Built by <a href="https:///timtraversy.github.io" target="blank">Tim!</a> -->
      <button type="button" class="btn btn-sm cg-btn-light" v-on:click="login = !login">Log In</button>
    </div>
    <div class = "loginBox" v-if="login">
      <form novalidate>
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
      </form>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Requirements',
  data () {
    return {
      login: false
    }
  },
  methods: {
    reverseMessage: function () {
      this.items.push({message: 'me'})
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

.topBar {
  background-color: var(--red);
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
  z-index: 15;
  height: 60px;
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

.text {
  font-size: 14px;
  padding-left: 15px;
}

a {
  color: white;
}

</style>
