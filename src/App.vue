<template>
  <div id="app">
    <Navbar></Navbar>
    <Content></Content>
  </div>
</template>

<script>
import Content from './components/Content'
import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar, Content
  },
  data () {
    return {
    }
  }
}

</script>

<style>
#app {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
html, body {
  height: 100%;
  overflow: hidden;
  font-family: 'Lato', sans-serif;
}
div {
  font-size: 14px;
}
h1 {
  font-weight: bold;
  font-size: 27px;
}
h2 {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 3px;
}
:root {
  --red: #cf000f;
  --dark-red: #960012;
  --unselected-link: rgba(255, 255, 255, 0.75);
  --light-gray: #edeff1;
  --body: #1b212a;
  --light-body: #282f3c;
  --lightest-body: #6F6F6F;
}
</style>
