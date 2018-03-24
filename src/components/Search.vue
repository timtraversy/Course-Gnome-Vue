<template>
  <div class="search" :class="isSplitscreen">
    <div class = "header">
      <h1 v-if = "$mq != 'sm'" class = "headerTitle">Search</h1>
      <input class="form-control" aria-describedby="searchTerm" placeholder="What are you looking for?">
      <span class="badge badge-pill badge-light">Computer Science<i class="material-icons">clear</i></span>
      <span class="badge badge-pill badge-light">Open<i class="material-icons">clear</i></span>
    </div>
    <div class = "results">
      <!-- <div class="loader"></div> -->
      <div v-for="course in courses" :key="course.id" class = "card">
        {{ course.subjectNumberString }}
        <h2>{{ course.courseName }}</h2>
        <span class = "gray">A mathematical treatment of fair representation, voting systems, power...</span>
      </div>
    </div>
  </div>
</template>

<script>

// import { db } from '../main'
export default {
  name: 'Search',
  data () {
    return {
      searchTerm: '',
      obj: {
        color: 'red',
        fontSize: '50px'
      },
      courses: []
    }
  },
  methods: {
    reverseMessage: function () {
      this.$router.push('search')
    }
  },
  computed: {
    isSplitscreen: function () {
      return {
        'splitscreen': this.$route.name === 'Splitscreen'
      }
    }
  },
  firestore () {
    return {
      // courses: db.collection('coursesSpring2018')
    }
  }
}

</script>

<style scoped>

.search {
  /* padding: 15px; */
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 5px 0 6px -2px rgb(203, 203, 203);
}

.material-icons {
  font-size: 10px;
  cursor: pointer;
  margin-left: 6px;
}

.badge-pill {
  margin-right: 7px;
  margin-bottom: 3px;
}

.header {
  background-color: var(--light-body);
  padding: 8px 15px 5px 15px;
}

.headerTitle {
  color: white
}

.form-control {
  max-width: 500px;
  border: none;
  border-radius: 3px;
  margin-bottom: 5px;
}

.form-control:focus {
  border: none;
  box-shadow: inset 0 -10px 0px -8px var(--red);
}

.results {
  flex: 1;
  overflow: auto;
  padding: 15px;
}

.loader {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid var(--red); /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    margin: 20% auto 0px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.card {
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 0;
  margin: 12px auto 0px auto;
  flex-shrink: 0;
  max-width: 500px;
  border-radius: 1px;
  border: none;
  box-shadow: 0px 4px 5px rgb(203, 203, 203);;
  border-left: 7px solid var(--red);
  color: var(--red);
  font-weight: 300;
}

.gray {
  color: var(--lightest-body);
}

.course {

}

.offering {
  color: red;
}

</style>
