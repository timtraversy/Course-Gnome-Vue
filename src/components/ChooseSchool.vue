<template>
  <div class="chooseSchool">
    <div class = "header">
      <h1 class = "headerTitle">Choose School</h1>
    </div>
    <div class="container">
      <div class="column">
        <router-link to="/gwu/schools">
          <div class="school">
            <div class = "current" v-if = "this.$route.params.school === 'gwu'">
              <i class="material-icons">check_circle</i>
            </div>
            <img class = "schoolLogo" src = "../assets/school-logos/gwu.png" />
          </div>
        </router-link>
      </div>
      <div class="column">
        <router-link to="/emerson/schools">
        <div class="school">
          <div class = "current" v-if = "this.$route.params.school === 'emerson'">
            <i class="material-icons">check_circle</i>
          </div>
          <img class = "schoolLogo" src = "../assets/school-logos/emerson.png" />
        </div>
        </router-link>
      </div>
      <div class="column final">
        <div class="school enter">
          <div v-if = "waiting" class="loader"></div>
          <form novalidate v-if = "!voted && !waiting" v-on:submit.prevent="vote()">
            <div class="form-group">
              <label for="school">What school do you want to see here?</label>
              <input type="text" class="form-control" id="school"
              aria-describedby="your-school" placeholder="Enter School" required
              v-model="school">
            </div>
            <button type="submit" class="btn btn-success">Submit</button>
          </form>
          <div v-if = "voted">
            Success! Thanks for letting us know.
            <div v-if="votes>1">
              <b>{{ votes }}</b> people have also voted for {{ school }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { voteOnSchool } from '../networking/database.js'

export default {
  name: 'ChooseSchool',
  data () {
    return {
      school: '',
      votes: -1,
      voted: false,
      waiting: false
    }
  },
  methods: {
    vote: async function () {
      this.waiting = true
      const votes = await voteOnSchool(this.school)
      this.waiting = false
      if (votes) {
        this.votes = votes
        this.voted = true
      } else {
        console.log('Fail')
      }
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

.header {
  background-color: var(--red);
  padding: 8px 15px 0px 15px;
  align-items: center;
  display: flex;
  height: 60px;
}

.headerTitle {
  color: white;
  padding-right: 20px;
}

.container {
  padding: 20px;
}

.column {
  float: left;
  width: 50%;
  text-align: center;
  padding: 20px;
  height: 200px;
}

.final {
  width: 70%;
  margin-left: 15%;
  margin-right: 15%;
}

.final:hover {
  background-color: none;
}

@media only screen and (max-width: 600px) {
  .column {
    width: 100%;
    margin: 0;
  }
}

.current {
  position: absolute;
  left: 10px;
  top: 10px;
}

.school {
  background-color: white;
  box-shadow: 0px 4px 5px rgb(203, 203, 203);
  border-radius: 3px;
  text-align: center;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--red);
  position: relative;
}

div {
  font-size: 16px;
}

.school:hover {
  background-color: var(--uigreen)
}

.enter {
  cursor: default;
}

.enter:hover {
  background-color: white
}

.schoolLogo {
  max-width:80%;
  max-height:80%;
  object-fit: contain;
}

.loader {
  border: 8px solid lightgray; /* Light grey */
  border-top: 8px solid var(--red); /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 50px auto 0px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
