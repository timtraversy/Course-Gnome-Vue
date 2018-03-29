<template>
  <div id="app">
    <div v-if = "this.$store.state.mobileNavOpen" v-on:click = "closeMobile()" class = "background">
    </div>
    <Navbar></Navbar>
    <Content></Content>
  </div>
</template>

<script>
import Content from './components/Content'
import Navbar from './components/Navbar'

import { db } from './private/firestore'

export default {
  name: 'App',
  components: {
    Navbar, Content
  },
  data () {
    return {
    }
  },
  methods: {
    closeMobile: function () {
      this.$store.commit('closeMobile')
    }
  },
  mounted () {
    db.collection('schools').doc('gwu').get()
      .then(function (doc) {
        var serverVerion = String(doc.data().version)
        var userVersion = String(localStorage.getItem('version'))
        // serverVerion !== userVersion
        if (serverVerion !== userVersion) {
          console.log('Need to update')
          var offeringsRef = db.collection('/schools/gwu/seasons/fall2018/offerings')
            .orderBy('departmentNumber')
            .orderBy('departmentAcronym')
            .orderBy('sectionNumber')
          offeringsRef.get()
            .then(function (querySnapshot) {
              var coursesList = []
              querySnapshot.forEach(function (offering) {
                var newDoc = {}
                newDoc.id = offering.id
                newDoc.data = offering.data()
                console.log(offering.data().name + offering.data().sectionNumber)
                coursesList.push(newDoc)
              })
              localStorage.setItem('offerings', JSON.stringify(coursesList))
              localStorage.setItem('version', doc.data().version)
            })
            .catch(function (error) {
              console.log('Error getting documents: ', error)
            })
        } else {
          console.log('Already up to date')
        }
      }).catch(function (error) {
        console.log('Error getting document:', error)
      })
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

.background {
  z-index: 30;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.40);
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
</style>
