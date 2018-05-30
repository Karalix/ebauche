<template>
  <div class="welcome-popup mdl-card mdl-shadow--2dp">
    <div class="mdl-card__supporting-text">
      <div class="a-to-action" @click="createNewCanvas">
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Create a new sketch</a>
        </div>
      <p>or choose from an existing one :</p>
      <div v-for="canva in canvasByAge" v-bind:key="canva._id">
        <p @click="openOldCanvas(canva.canvasId)">{{canva.canvasId}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'

export default {
  name: 'WelcomePopup',
  data: function () {
    return {
      canvas: [],
      dbListener: null
    }
  },
  computed: {
    canvasByAge: function () {
      return this.canvas.slice(0).sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      })
    }
  },
  methods: {
    createNewCanvas: function () {
      this.$emit('create-new-canvas')
    },
    openOldCanvas: function (canvasId) {
      this.$emit('open-old-canvas', canvasId)
    },
    refreshDocs: function () {
      store.db.find(
        {
          include_docs: true,
          descending: true,
          selector: {
            'type': 'canvas'
          }
        }, (err, doc) => {
          if (!err) {
            console.log(doc)
            this.canvas = doc.docs
          } else {
            console.error(err)
          }
        })
    }
  },
  created: function () {
    this.refreshDocs()
    this.dbListener = store.db.changes({
      since: 'now',
      live: true,
      selector: {
        'type': 'canvas'
      },
      include_docs: false
    }).on('change', (change) => {
      this.refreshDocs()
    })
  },
  beforeDestroy: function () {
    this.dbListener.cancel()
  }
}
</script>

<style scoped>
.welcome-popup{
    z-index: 5;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: left;
}
</style>
