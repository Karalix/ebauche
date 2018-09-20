<template>
  <div class="push-screen-button">
    <ul class="material-menu invisible" id="push-screen-menu">
      <li class="material-menu-item" v-for="storyId in storyIds" v-bind:key="storyId._id" @click="sendSketchToStory(storyId.storyId)">{{storyId.storyId}}</li>
    </ul>
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="push-screen-button" @click="toggleMenu()">
      <i class="material-icons">screen_share</i>
    </button>
    <div aria-live="assertive" aria-atomic="true" aria-relevant="text" class="mdl-snackbar mdl-js-snackbar">
      <div class="mdl-snackbar__text"></div>
      <button type="button" class="mdl-snackbar__action"></button>
    </div>
  </div>
</template>

<script>
import store from '../store'

export default {
  data: function () {
    return {
      storyIds: null,
      selector: {
        type: 'display'
      }
    }
  },
  methods: {
    refreshDocs: function () {
      store.db.find({include_docs: true, descending: true, selector: this.selector}, (err, doc) => {
        if (!err) {
          console.log(doc)
          this.storyIds = doc.docs
        } else {
          console.error(err)
        }
      })
    },
    toggleMenu () {
      window.document.querySelector('#push-screen-menu').classList.toggle('invisible')
    },
    sendSketchToStory: function (storyId) {
      var notification = document.querySelector('.mdl-js-snackbar')
      notification.MaterialSnackbar.showSnackbar(
        {
          message: `🚀 ${storyId} 👍`
        }
      )
      this.$emit('send-sketch-to-story', `${storyId}`)
    }
  },
  created: function () {
    this.refreshDocs()
    this.dbListener = store.db.changes({
      since: 'now',
      live: true,
      selector: this.selector,
      include_docs: true
    }).on('change', (change) => {
      this.refreshDocs()
    })
  },
  mounted: function () {
    // let snack = document.querySelector('.mdl-js-snackbar')
    // eslint-disable-next-line
    componentHandler.upgradeDom()
  },
  beforeDestroy: function () {
    this.dbListener.cancel()
  }
}
</script>

<style>

.push-screen-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  text-align: right;
}

.material-menu {
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  list-style: none;
  padding: 8px 0;
  background-color: white;
}

.material-menu.invisible {
  display: none;
}

.material-menu-item {
  text-decoration: none;
  list-style-type: none;
  padding: 0 16px;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  height: 48px;
  line-height: 48px;
}

</style>
