<template>
  <div class="mini-gallery">
      <div v-for="canva in canvasByAge" v-bind:key="canva._id" :id="'mini-gallery-'+canva.canvasId" class="mini-gallery-canvas-button" @click="openOldCanvas(canva.canvasId)">
        <p>{{canva.canvasId}}</p>
      </div>
      <button class="a-to-action mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" @click="createNewCanvas">
        <i class="material-icons">add</i>
      </button>
  </div>
</template>

<script>
import store from '../store'

export default {
  name: 'MiniGallery',
  data: function () {
    return {
      canvas: [],
      dbListener: null,
      intervalId: 0
    }
  },
  computed: {
    canvasByAge: function () {
      return this.canvas.slice(0).sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at)
      })
    }
  },
  props: [
    'currentSketch'
  ],
  methods: {
    createNewCanvas: function () {
      this.$emit('create-new-canvas')
    },
    highlightItem: function () {
      let buttons = document.querySelectorAll('.mini-gallery-canvas-button')
      buttons.forEach(element => {
        element.classList.remove('selected')
      })
      let element = document.querySelector('#mini-gallery-' + this.currentSketch)
      if (element) {
        element.classList.add('selected')
      }
    },
    openOldCanvas: function (canvasId) {
      this.highlightItem()
      this.$emit('open-old-canvas', canvasId)
    },
    refreshDocs: function () {
      store.db.find({include_docs: true, descending: true, selector: {type: 'canvas'}}, (err, doc) => {
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
    clearInterval(this.intervalId)
    this.dbListener.cancel()
  },
  mounted: function () {
    this.intervalId = setInterval(() => {
      this.highlightItem()
    }, 500)
  }
}
</script>

<style scoped>
.a-to-action {
  margin-left: 30px;
  margin-bottom: 20px;
}

.welcome-popup{
    z-index: 5;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: left;
}

.mini-gallery {
  position: fixed;
  left: 20px;
  bottom: 0px;
  height: fit-content;
  max-height: 100vh;
  overflow: scroll;
  text-align: left;
}

.mini-gallery-canvas-button {
  width: 100px;
  height: 50px;
  text-align: left;
  padding: 2px;
  margin: 2px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  cursor: pointer;
}

.mini-gallery-canvas-button:hover {
  background-color: #ff4081;
  color: white;
}

.mini-gallery-canvas-button.selected {
  background-color: #ff4081;
  color: white;
}

::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
</style>
