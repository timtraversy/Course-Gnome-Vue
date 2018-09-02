<template>
  <div class = "container" v-click-outside="unfocus">
    <input @focus = "visible = true" @keyup.down="scrollDown" @keyup.up="scrollUp" @keyup.enter="selectWithKey"
    v-model="input" class="form-control" aria-describedby="Department" v-bind:placeholder="this.options.placeholder">
    <div class = "autocompleteResults" v-if="visible">
      <div v-bind:class = "isKeyOn(index)" v-on:click = "select(item)" v-for="(item,index) in matchingOptions.slice(0,10)" :key = "item.name" class = "autocompleteResult">
      <span v-if = "item.type">{{ item.type }}: </span>{{ item.name }} ({{item.count}})
      </div>
    </div>
    <div v-if = "input" class = "clearButton" v-on:click="unselect">
      <i class = "material-icons">clear</i>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'Autocomplete',
  props: ['options'],
  directives: {
    ClickOutside
  },
  data () {
    return {
      visible: false,
      input: '',
      highlighted: 0
    }
  },
  methods: {
    selectWithKey: function () {
      let matches = this.findMatches()
      this.select(matches[this.highlighted])
    },
    isKeyOn: function (index) {
      if (index === this.highlighted) {
        return 'autocompleteResultSelected'
      }
    },
    scrollDown: function () {
      if (this.options.list.length - 1 > this.highlighted) {
        this.highlighted++
      }
    },
    scrollUp: function () {
      if (this.highlighted > 0) {
        this.highlighted--
      }
    },
    select: function (selection) {
      if (this.options.type === 'global') {
        var obj = {}
        if (selection.type === 'Department') {
          obj['departmentName'] = selection.name
        } else if (selection.type === 'Instructor') {
          obj['instructor'] = selection.name
        }
        this.$store.commit('updateSearchObject', obj)
        this.input = ''
      } else {
        var obj2 = {}
        obj2[this.options.type] = selection.name
        this.$store.commit('updateSearchObject', obj2)
      }
      this.visible = false
      this.highlighted = 0
    },
    unfocus: function () {
      if (!this.visible) return
      this.visible = false
      if (this.input && this.input !== this.$store.state.searchObject[this.options.type]) {
        this.unselect()
      }
    },
    unselect: function () {
      this.visible = false
      this.highlighted = 0
      var obj = {}
      obj[this.options.type] = null
      this.$store.commit('updateSearchObject', obj)
    },
    findMatches: function () {
      let arr = []
      for (var i = 0; i < this.options.list.length; ++i) {
        if (this.options.list[i].name.toLowerCase().includes(this.input.toLowerCase())) {
          arr.push(this.options.list[i])
        }
      }
      return arr
    }
  },
  mounted () {
    const value = this.$store.state.searchObject[this.options.type]
    if (value) {
      this.input = value
    }
  },
  computed: {
    matchingOptions: function () {
      if (this.input === '') {
        return this.options.list
      }
      return this.findMatches()
    },
    actualInput: function () {
      return this.$store.state.searchObject[this.options.type]
    }
  },
  watch: {
    actualInput (input) {
      if (input) {
        this.input = input
      } else {
        this.input = ''
      }
    }
  }
}
</script>

<style scoped>

.container {
  position: relative;
  padding: 0px;
  display: flex;
  flex-direction: column;
  margin:0px;
  /* max-width: 400px; */
}

.form-control {
  border: none;
  border-radius: 3px;
  z-index: 25;
}

.clearButton {
  position: absolute;
  right:8px;
  top: 6px;
  cursor: pointer;
  z-index: 100;
}

.autocompleteResults {
  z-index: 30;
  max-height: 150px;
  overflow: auto;
  margin-top: 2px;
  width: 100%;
  background-color: white;
  /* position: absolute; */
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

.autocompleteResult {
  padding: 3px 10px 3px 10px;
  border-bottom: 1px solid var(--light-gray)
}

.autocompleteResultSelected {
  background-color: var(--line)
}

.autocompleteResult:hover {
  background-color: var(--line)
}
</style>
