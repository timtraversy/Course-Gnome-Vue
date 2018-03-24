<template>
  <div class="content">
    <nav class="navbar navbar-dark topBar">
      <div class="dropdown">
        <button v-on:click = "openMobileNav()" v-if="$mq !== 'lg'" class="btn btn-link linkBtn" type="button" >
            <i class="material-icons">menu</i>
        </button>
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
    openMobileNav: function () {
      this.$store.commit('openMobile')
    },
    goToSearch: function () {
      this.$router.push('search')
    },
    goToCalendar: function () {
      this.$router.push('calendar')
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

</style>
