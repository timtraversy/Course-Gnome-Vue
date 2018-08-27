<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Welcome from './components/Welcome'
import VueWorker from 'vue-worker'

export default {
  name: 'App',
  components: {
    Navbar, VueWorker, Welcome
  },
  data () {
    return {
    }
  },
  mounted () {
    if (this.$route.path === '/') {
      document.body.classList.remove('fullscreen')
      document.documentElement.classList.remove('fullscreen')
    } else {
      document.body.classList.add('fullscreen')
      document.documentElement.classList.add('fullscreen')
    }
  },
  methods: {
    closeMobile: function () {
      this.$store.commit('closeMobile')
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.path === '/') {
        document.body.classList.add('fullscreen')
        document.documentElement.classList.add('fullscreen')
      } else if (to.path === '/') {
        document.body.classList.remove('fullscreen')
        document.documentElement.classList.remove('fullscreen')
      }
    }
  }
}

</script>

<style>
#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.background {
  z-index: 30;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.40);
  height: 100%;
  width: 100%;
}

html, body {
  font-family: 'Lato', sans-serif;
}
.fullscreen {
  height: 100%;
  overflow: hidden;
}
div {
  font-size: 14px;
}
h1 {
  font-weight: bold;
  font-size: 24px;
}
h2 {
  font-size: 16px;
  font-weight: bold;
  margin: 2px;
}
@media (min-width: 413px) {
  h1 {
    font-size: 27px;
  }
  h2 {
    font-size: 16px;
  }
}
@media (min-width: 850px) {
  h1 {
    font-size: 29px;
  }
  h2 {
    font-size: 18px;
  }
}
/* Lighter placeholder text */
*::-webkit-input-placeholder {
  color: var(--line)!important
}
*:-moz-placeholder {
  /* FF 4-18 */
  color: var(--line)!important
}
*::-moz-placeholder {
  /* FF 19+ */
  color: var(--line)!important
}
*:-ms-input-placeholder {
  /* IE 10+ */
  color: var(--line)!important
}
:root {
  --red: #cf000f;
  --dark-red: #960012;
  --unselected-link: rgba(255, 255, 255, 0.75);
  --light-gray: #edeff1;
  --body: #1b212a;
  --light-body: #282f3c;
  --lightest-body: #6F6F6F;
  --line: rgba(0, 0, 0, 0.13);

  --uired: #eb3b5a;
  --uiorange: #fa8231;
  --uigold: #f7b731;
  --uigreen: #20bf6b;
  --uiturquoise: #0fb9b1;
  --uilightblue: #2d98da;
  --uidarkblue: #3867d6;
  --uipurple: #8854d0;
  --uigray: #4b6584;
}
/*  Bootstrap styles */
.cg-btn-light {
  color: #1B212A;
  background-color: #FFFFFF;
  border-color: #FFFFFF;
}

.cg-btn-light:hover,
.cg-btn-light:focus,
.cg-btn-light:active,
.cg-btn-light.active
.open .dropdown-toggle.cg-btn-light {
  color: #1B212A;
  background-color: #E8E8E8;
  border-color: #FFFFFF;
}

.cg-btn-light:active,
.cg-btn-light.active,
.open .dropdown-toggle.cg-btn-light {
  background-image: none;
}

.cg-btn-light.disabled,
.cg-btn-light[disabled],
fieldset[disabled] .cg-btn-light,
.cg-btn-light.disabled:hover,
.cg-btn-light[disabled]:hover,
fieldset[disabled] .cg-btn-light:hover,
.cg-btn-light.disabled:focus,
.cg-btn-light[disabled]:focus,
fieldset[disabled] .cg-btn-light:focus,
.cg-btn-light.disabled:active,
.cg-btn-light[disabled]:active,
fieldset[disabled] .cg-btn-light:active,
.cg-btn-light.disabled.active,
.cg-btn-light[disabled].active,
fieldset[disabled] .cg-btn-light.active {
  background-color: #FFFFFF;
  border-color: #FFFFFF;
}

.cg-btn-light .badge {
  color: #FFFFFF;
  background-color: #1B212A;
}
</style>
