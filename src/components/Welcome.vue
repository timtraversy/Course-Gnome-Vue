<template>
  <div class = "welcome">
    <img class = "swoop" src = "../assets/swoop.svg" />
    <div class="header">
      <img class = "preview" src = "../assets/preview.gif" />
      <div class="tagline">
        <span>Schedule f<span>
          <img  v-if="$mq < 'sm'" class = "redhat" src="../assets/whiteHat.svg" />
          <img  v-else class = "redhat" src="../assets/redhat.svg" />
        </span>ster with<br />Course Gnome</span>
      </div>
    </div>
    <div class = "choose">Choose your school and try it out.</div>
    <div class = "schools">
      <div class = "school" v-on:click="chooseSchool('gwu')">
        <div v-if = "waitingOnGWU" class="loader loader-gwu"></div>
        <template v-else>
          <h2>George Washington University</h2>
          <p>Fall 2018 - 2826 courses</p>
        </template>
      </div>
      <div class = "school emerson" v-on:click="chooseSchool('emerson')">
        <div v-if = "waitingOnEmerson" class="loader loader-emerson"></div>
        <template v-else>
          <h2>Emerson College</h2>
          <p>Fall 2018 - 1184 courses</p>
        </template>
      </div>
    </div>
    <div class = "new">
      <div v-if = "waitingOnVote" class="loader loader-vote"></div>
      <template v-else>
        <h2>Where's My School?</h2>
        <p>{{ voteCaption }}</p>
        <form v-if = "!voted" novalidate v-on:submit.prevent="vote()">
          <div class="form-group">
            <input type="text" class="form-control" id="school"
            aria-describedby="Your school" placeholder="Enter School" required
            v-model="newSchool">
          </div>
          <button type="submit" class="btn btn-success">Submit</button>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
import { pullCourses, voteOnSchool } from '../networking/database.js'
export default {
  name: 'Welcome',
  data () {
    return {
      newSchool: '',
      waitingOnGWU: false,
      waitingOnEmerson: false,
      waitingOnVote: false,
      voteCaption: 'Enter it here and we will work on it!',
      voted: false
    }
  },
  methods: {
    chooseSchool: async function (school) {
      // skip request if already stored
      if (this.$store.state.school === school) {
        this.$router.push(school + '/schedule')
        return
      }
      if (school === 'gwu') {
        this.waitingOnGWU = true
      } else {
        this.waitingOnEmerson = true
      }
      const success = await pullCourses(school)
      console.log(success)
      if (school === 'gwu') {
        this.waitingOnGWU = false
      } else {
        this.waitingOnEmerson = false
      }
      if (success) {
        this.$store.commit('setSchool', school)
        this.$router.push(school + '/schedule')
      }
    },
    vote: async function () {
      this.waitingOnVote = true
      const votes = await voteOnSchool(this.newSchool)
      if (votes > 1) {
        this.voted = true
        this.voteCaption = 'Thanks! ' + votes + ' people have also voted for ' + this.newSchool + '!'
      } else if (votes === 1) {
        this.voted = true
        this.voteCaption = 'Thanks for voting for ' + this.newSchool + '!'
      }
      this.waitingOnVote = false
    }
  },
  computed: {
  }
}
</script>

<style scoped>

.welcome {
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.swoop {
  width: 105%;
  margin: -1px -1px 0px -1px;
  position: absolute;
  z-index: -1;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 20px;
  width: 100%;
  font-size: 27px;
  font-weight: bold;
  line-height: 25px;
}

.preview {
  width: 100%;
  margin-bottom: 20px;
}

.tagline {
  text-align: center;
  font-size: inherit;
}

.redhat {
  height: 22px;
  margin: 0px 1px 7px 1px;
}

.choose {
  margin-top: 14px;
  margin-bottom: 10px;
  font-size: 14px;
}

.schools {
  padding: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.school {
  padding: 10px 10px 10px 10px;
  border-top: 10px solid var(--uidarkblue);
  border-radius: 2px;
  box-shadow: 0px 1px 5px rgb(203, 203, 203);
  width: 100%;
  margin: 10px;
  height: 130px;
  cursor: pointer;
}

.loader {
  border: 8px solid lightgray; /* Light grey */
  border-top: 8px solid var(--red); /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: auto;
  margin-top: 25px;
}

.loader-gwu {
  border-top: 8px solid var(--uidarkblue)
}

.loader-emerson {
  border-top: 8px solid var(--uipurple)
}

.loader-vote {
  border-top: 8px solid var(--uigreen);
  margin-top: 0px
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.add {
  width: 100%;
}

p {
  color: var(--lightest-body)
}

.school:hover {
  background-color: rgba(20, 20, 20, 0.1)
}

.emerson {
  border-top: 10px solid var(--uipurple);
}

.add {
  margin-right: 20px;
}

.new {
  max-width: 400px;
  border-top: 10px solid var(--uigreen);
  padding: 10px 10px 10px 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 5px rgb(203, 203, 203);
  width: 85%;
  margin-bottom: 100px;
  cursor: pointer;
}

@media (min-width: 413px){
  .header {
    width: 80%;
    font-size: 30px;
  }
  .choose {
    font-size: 15px;
  }
}

@media (min-width: 500px){
  .school {
    width: calc(50% - 20px);
  }
}

@media (min-width: 850px) {
  .header {
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 25px;
    width: 100%;
    font-size: 37px;
    line-height: 30px;
  }
  .preview {
    margin-bottom: 0px;
    margin-right: 20px;
    max-width: none;
    width: 50%;
    margin-left: 5%;
  }
  .tagline {
    text-align: left;
    flex-grow: 1;
    color: white;
  }
  .redhat {
    height: 28px;
    margin-bottom: 7px;
    margin: 0px 2px 7px 2px;
  }
  .school {
    width: calc(33% - 20px);
  }
  .choose {
    font-size: 16px;
  }
}

@media (min-width: 1050px) {
  .redhat {
    height: 34px;
    margin-bottom: 7px;
    margin: 0px 3px 7px 3px;
  }
  .school {
    width: calc(25% - 20px)
  }
  .choose {
    font-size: 17px;
  }
  .header {
    font-size: 47px;
    line-height: 37px;
  }
}

</style>
