<template>
  <div class="search" :class="isSplitscreen">
    <div class = "header">
      <h1 class = "headerTitle">Search</h1>
      <input class="form-control" aria-describedby="searchTerm" placeholder="What are you looking for?">
      <span class="badge badge-pill badge-light">Computer Science<i class="material-icons">clear</i></span>
      <span class="badge badge-pill badge-light">Open<i class="material-icons">clear</i></span>
      <!-- <div v-if="classes.length>0">
      {{ classes[0].courseName }}
    </div> -->
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
      classes: []
    }
  },
  methods: {
    reverseMessage: function () {
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
      // classes: db.collection('coursesSpring2018').where('subjectNumberInteger', '==', 3001)
    }
  }
}

</script>

<style scoped>

.search {
  /* padding: 15px; */
  flex-grow: 1;
  flex-basis: 0;
  /* height: 100%; */
}

.splitscreen {
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

</style>
