<template>
  <div id="navbar" :class = "navClass">
    <div class = "logoBox navBarItem">
      <img v-if="!navBarCollapsed" class = "logoImage" src="../assets/whiteLogo.svg">
      <img v-else class = "logoImage" src="../assets/whiteHat.svg">
    </div>
    <div class = "navBox">
      <div class = "schoolBox" key = "name">
        <transition name = "fade">
          <div v-if = "!navBarCollapsed" class = "navBarItem school">
            {{ getSchoolName($route.params.school) }}
          </div>
          <!-- <button type="button" class="btn btn-link linkBtn">CHANGE</button> -->
          <div v-else class = "menuItem">
            <i class="material-icons">school</i>
          </div>
        </transition>
      </div>
      <div class = "menu">
        <router-link to="schedule">
          <div class = "menuItem">
            <i class="material-icons">search</i>
            <transition name = "fade">
              <span v-if="!navBarCollapsed">Schedule</span>
            </transition>
          </div>
        </router-link>
        <router-link to="requirements">
          <div class = "menuItem">
            <i class="material-icons">check</i>
            <transition name = "fade">
              <span v-if="!navBarCollapsed">Requirements</span>
            </transition>
          </div>
        </router-link>
        <router-link to="social">
          <div class = "menuItem">
            <i class="material-icons">group</i>
            <transition name = "fade">
              <span v-if="!navBarCollapsed">Social</span>
            </transition>
          </div>
        </router-link>
        <router-link to="advising">
          <div class = "menuItem">
            <i class="material-icons">chat</i>
            <transition name = "fade">
              <span v-if="!navBarCollapsed">Advising</span>
            </transition>
          </div>
        </router-link>
      </div>
    </div>
    <div v-on:click="collapseNav()" class = "footer navBarItem">
      <i v-if = "!navBarCollapsed" class="material-icons">chevron_left</i>
      <i v-else class="material-icons">chevron_right</i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      isMobileOpen: false,
      isMobileClosed: false,
      navBarCollapsed: false
    }
  },
  computed: {
    navClass: function () {
      if (this.$mq === 'lg') {
        this.$store.commit('closeMobile')
      }
      return {
        navBarCollapsed: this.navBarCollapsed,
        nothing: this.$mq === 'lg',
        mobileOpen: this.$mq !== 'lg' && this.$store.state.mobileNavOpen,
        mobileClosed: this.$mq !== 'lg' && !this.$store.state.mobileNavOpen
      }
    }
  },
  methods: {
    getSchoolName: function (name) {
      if (name === 'gwu') {
        return 'George Washington University'
      }
    },
    collapseNav: function () {
      if (this.$mq === 'lg') {
        this.navBarCollapsed = !this.navBarCollapsed
      } else {
        this.$store.commit('closeMobile')
      }
    }
  }
}
</script>

<style scoped>

.linkBtn {
  color: white;
  padding-left: 20px;
  font-size: 14px;
  padding-bottom: 0px;
}

.linkBtn:focus {
  text-decoration: none;
}

.linkBtn:hover {
  text-decoration: underline;
}

#navbar {
  z-index: 31;
  user-select: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 190px;
  background-color: var(--light-body);
  flex-shrink: 0;
  flex-grow: 0;
  transition: width 0.2s;
}

.mobileClosed {
  display: none !important;
}

.mobileOpen {
  position: absolute;
}

.navBarCollapsed {
  width: 65px !important;
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
  padding-left: 4px;
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
  background-color: var(--light-body);
  display: flex;
  flex-direction: column;
}

.school {
  padding-bottom: 0px;
}

.schoolBox {
  padding-bottom: 10px;
  flex-grow: 0;
  border-bottom: 0.5px var(--unselected-link) solid;
}

.menu {
  background-color: var(--body);
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
  transition: visibility 2s;
}

.menuItem:hover {
  padding-left: 20px;
  display: flex;
  align-content: center;
  color: white;
  padding-top: 13px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
