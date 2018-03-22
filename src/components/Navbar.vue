<template>
  <div id="navbar" :style="{width: navBarCollapsed?'65px':'190px'}">
    <div class = "logoBox navBarItem">
      <img class = "logoImage" src="../assets/whiteLogo.svg">
    </div>
    <div class = "navBox">
      <div class = "schoolBox">
        <div class = "navBarItem school">
          {{ getSchoolName($route.params.school) }}
        </div>
        <button type="button" class="btn btn-link linkBtn">CHANGE</button>
      </div>
      <div class = "menu">
        <router-link to="splitscreen">
          <div class = "menuItem">
            <i class="material-icons">chrome_reader_mode</i><span v-if="!navBarCollapsed">Splitscreen</span>
          </div>
        </router-link>
        <router-link to="search">
          <div class = "menuItem">
            <i class="material-icons">search</i><span v-if="!navBarCollapsed">Search</span>
          </div>
        </router-link>
        <router-link to="calendar">
          <div class = "menuItem">
            <i class="material-icons">grid_on</i><span v-if="!navBarCollapsed">Calendar</span>
          </div>
        </router-link>
        <router-link to="requirements">
          <div class = "menuItem">
            <i class="material-icons">check</i><span v-if="!navBarCollapsed">Requirements</span>
          </div>
        </router-link>
        <div class = "menuItem">
          <i class="material-icons">bookmark</i><span v-if="!navBarCollapsed">Saved Searches</span>
        </div>
        <div class = "menuItem">
          <i class="material-icons">screen_share</i><span v-if="!navBarCollapsed">Share</span>
        </div>
        <router-link to="advising">
          <div class = "menuItem">
            <i class="material-icons">chat</i><span v-if="!navBarCollapsed">Advising</span>
          </div>
        </router-link>
      </div>
    </div>
    <div v-on:click="alterNavbar()" class = "footer navBarItem">
      <i class="material-icons">chevron_left</i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      navBarCollapsed: false,
      obj: {
        color: 'red',
        fontSize: '50px'
      },
      items: [
        { message: 'Foo' },
        { message: 'Bar' }
      ]
    }
  },
  methods: {
    getSchoolName: function (name) {
      if (name === 'gwu') {
        return 'George Washington University'
      }
    },
    alterNavbar: function () {
      this.navBarCollapsed = !this.navBarCollapsed
      console.log(this.navBarCollapsed)
    }
  },
  computed: {
  }
}
</script>

<style scoped>

.linkBtn {
  color: white;
  padding-left: 20px;
  font-size: 14px;
  padding-bottom: 10px;
}

.linkBtn:focus {
  text-decoration: none;
}

.linkBtn:hover {
  text-decoration: underline;
}

#navbar {
  user-select: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 190px;
  background-color: var(--red);
  flex-shrink: 0;
  flex-grow: 0;
}

.logoBox {
  height: 50px;
  border-bottom: 0.5px var(--unselected-link) solid;
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  align-items: center;
}

.logoImage {
  height: 30px;
}

.material-icons {
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}

.navBarItem {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  display: flex;
  color: var(--unselected-link)
}

.navBox {
  flex-grow: 1;
  overflow-x: scroll;
  background-color: var(--red);
  display: flex;
  flex-direction: column;
}

.school {
  padding-bottom: 0px;
}

.schoolBox {
  padding-bottom: 0px;
  flex-grow: 0;
  border-bottom: 0.5px var(--unselected-link) solid;
}

.menu {
  background-color: var(--dark-red);
  flex-grow: 1;
  padding-bottom: 20px;
}

.menuItem {
  padding-left: 20px;
  display: flex;
  align-content: center;
  color: var(--unselected-link);
  padding-top: 13px;
  cursor: pointer;
}

.menuItem:hover {
  padding-left: 20px;
  display: flex;
  align-content: center;
  color: white;
  padding-top: 13px;
}

a {
  text-decoration: none;
}

.footer {
  border-top: 0.5px var(--unselected-link) solid;
  display: flex;
  align-content: center;
  justify-content: flex-end;
  flex-grow: 0;
  flex-shrink: 0;
  height: 45px;
  cursor: pointer;
}

</style>
