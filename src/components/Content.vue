<template>
  <div class="content">
    <nav class="navbar navbar-dark topBar">
      <div class="dropdown">
        <button class="btn btn-link dropdown-toggle linkBtn" type="button" id="seasonDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ season }}
        </button>
        <div class="dropdown-menu" aria-labelledby="seasonDropdown">
          <a v-for="season in seasons" v-bind:key="season.name" class="dropdown-item text" href="#">{{ season.name }}</a>
        </div>
      </div>
      <div class = "dropdown">
        <a class="navbar-brand" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img class = "profilePicture" src="../assets/pro.jpg" width="30" height="30" alt="">
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a v-for="season in seasons" v-bind:key="season.name" class="dropdown-item text" href="#">{{ season.name }}</a>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Content',
  data () {
    return {
      msg: this.message,
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

.text {
  font-size: 14px;
  padding-left: 15px;
}

.content {
  background-color: var(--light-gray);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.topBar {
  height: 50px;
  background-color: var(--body);
  flex-shrink: 0;
  flex-grow: 0;
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

</style>
