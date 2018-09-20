<template>
  <div class="drawing-board">
    <welcome-popup @create-new-canvas="createNewCanvas" @open-old-canvas="openOldCanvas" v-if="showWelcomePopup"></welcome-popup>
    <div class="drawing-tools" v-else>
      <mini-gallery @create-new-canvas="createNewCanvas" @open-old-canvas="openOldCanvas"></mini-gallery>
      <push-screen-button @send-sketch-to-story="sendSketchToStory"></push-screen-button>
      <take-pic-button @new-photograph="registerNewPhotograph"></take-pic-button>
    </div>
    <iframe id="drawing-canvas" src="" allowtransparency="true"></iframe>
    <video id="photo-video"></video>
    <canvas id="photo-canvas"></canvas>
  </div>
</template>

<script>
import WelcomePopup from './WelcomePopup'
import MiniGallery from './MiniGallery'
import PushScreenButton from './PushScreenButton'
import TakePicButton from './TakePicButton'
import store from '../store'
import log from '../logging'

let animalList = [
  'aardvark',
  'albatross',
  'alligator',
  'alpaca',
  'ant',
  'anteater',
  'antelope',
  'ape',
  'armadillo',
  'donkey',
  'baboon',
  'badger',
  'barracuda',
  'bat',
  'bear',
  'beaver',
  'bee',
  'bison',
  'boar',
  'buffalo',
  'butterfly',
  'camel',
  'capybara',
  'caribou',
  'cassowary',
  'cat',
  'caterpillar',
  'cattle',
  'chamois',
  'cheetah',
  'chicken',
  'chimpanzee',
  'chinchilla',
  'chough',
  'clam',
  'cobra',
  'cockroach',
  'cod',
  'cormorant',
  'coyote',
  'crab',
  'crane',
  'crocodile',
  'crow',
  'curlew',
  'deer',
  'dinosaur',
  'dog',
  'dogfish',
  'dolphin',
  'donkey',
  'dotterel',
  'dove',
  'dragonfly',
  'duck',
  'dugong',
  'dunlin',
  'eagle',
  'echidna',
  'eel',
  'eland',
  'elephant',
  'elephant-seal',
  'elk',
  'emu',
  'falcon',
  'ferret',
  'finch',
  'fish',
  'flamingo',
  'fly',
  'fox',
  'frog',
  'gaur',
  'gazelle',
  'gerbil',
  'giant-panda',
  'giraffe',
  'gnat',
  'gnu',
  'goat',
  'goose',
  'goldfinch',
  'goldfish',
  'gorilla',
  'goshawk',
  'grasshopper',
  'grouse',
  'guanaco',
  'guinea-fowl',
  'guinea-pig',
  'gull',
  'hamster',
  'hare',
  'hawk',
  'hedgehog',
  'heron',
  'herring',
  'hippopotamus',
  'hornet',
  'horse',
  'human',
  'hummingbird',
  'hyena',
  'ibex',
  'ibis',
  'jackal',
  'jaguar',
  'jay',
  'jellyfish',
  'kangaroo',
  'kingfisher',
  'koala',
  'komodo-dragon',
  'kookabura',
  'kouprey',
  'kudu',
  'lapwing',
  'lark',
  'lemur',
  'leopard',
  'lion',
  'llama',
  'lobster',
  'locust',
  'loris',
  'louse',
  'lyrebird',
  'magpie',
  'mallard',
  'manatee',
  'mandrill',
  'mantis',
  'marten',
  'meerkat',
  'mink',
  'mole',
  'mongoose',
  'monkey',
  'moose',
  'mouse',
  'mosquito',
  'mule',
  'narwhal',
  'newt',
  'nightingale',
  'octopus',
  'okapi',
  'opossum',
  'oryx',
  'ostrich',
  'otter',
  'owl',
  'ox',
  'oyster',
  'panther',
  'parrot',
  'partridge',
  'peafowl',
  'pelican',
  'penguin',
  'pheasant',
  'pig',
  'pigeon',
  'polar-bear',
  'pony',
  'porcupine',
  'porpoise',
  'prairie-dog',
  'quail',
  'quelea',
  'quetzal',
  'rabbit',
  'raccoon',
  'rail',
  'ram',
  'rat',
  'raven',
  'red-deer',
  'red-panda',
  'reindeer',
  'rhinoceros',
  'rook',
  'salamander',
  'salmon',
  'sand-dollar',
  'sandpiper',
  'sardine',
  'scorpion',
  'sea-lion',
  'sea-urchin',
  'seahorse',
  'seal',
  'shark',
  'sheep',
  'shrew',
  'skunk',
  'snail',
  'snake',
  'sparrow',
  'spider',
  'spoonbill',
  'squid',
  'squirrel',
  'starling',
  'stingray',
  'stinkbug',
  'stork',
  'swallow',
  'swan',
  'tapir',
  'tarsier',
  'termite',
  'tiger',
  'toad',
  'trout',
  'turkey',
  'turtle',
  'vicuña',
  'viper',
  'vulture',
  'wallaby',
  'walrus',
  'wasp',
  'water-buffalo',
  'weasel',
  'whale',
  'wolf',
  'wolverine',
  'wombat',
  'woodcock',
  'woodpecker',
  'worm',
  'wren',
  'yak',
  'zebra'
]

export default {
  name: 'DrawingBoard',
  data: function () {
    return {
      drawingCanvasURL: '/ebauche-canvas',
      showWelcomePopup: true,
      currentSketchURL: '',
      userId: ''
    }
  },
  created: function () {
    this.userId = localStorage.getItem('userId')
    if(!this.userId) {
      this.userId = Math.floor(Math.random() * Math.floor(10000))
      localStorage.setItem('userId', this.userId)
    }

    window.addEventListener('message', (event) => {
      if(event.data === 'user-id') {
        document.querySelector('#drawing-canvas').contentWindow.postMessage(`user-id-${this.userId}`,'*')
      }
    })
  },
  methods: {
    switchCanvas: function (canvasURL) {
      if (!canvasURL) {
        let newId = `sketch-${this.createId()}`
        document.querySelector('#drawing-canvas').setAttribute('src', `${window.webstrateUrl}/${this.drawingCanvasURL}/?copy=${newId}`)
        this.currentSketchURL = newId
        return newId
      } else {
        document.querySelector('#drawing-canvas').setAttribute('src', `${window.webstrateUrl}/${canvasURL}`)
        this.currentSketchURL = canvasURL
        store.db.find({include_docs: true, selector: {type: 'canvas', canvasId: this.currentSketchURL}})
          .then((docs) => {
            if (docs.docs.length > 0) {
              if (docs.docs[0].photograph) {
                let image = new Image()

                let canvas = document.querySelector('#photo-canvas')

                // Context object for working with the canvas.
                let context = canvas.getContext('2d')

                // Draw a copy of the current frame from the video on the canvas.
                image.onload = () => {
                  context.drawImage(image, 0, 0)
                }
                image.src = docs.docs[0].photograph
              }
            }
          })
      }
    },
    createNewCanvas: function () {
      this.showWelcomePopup = false
      let newSketchID = this.switchCanvas()
      log.logCanvasOperation(newSketchID, 'create-canvas', `${this.userId}`)
      store.db.post({
        canvasId: newSketchID,
        created_at: new Date(),
        type: 'canvas'
      }, (err, result) => {
        if (!err) {
          console.log('Successfully posted a canvas !')
        }
      })
    },
    openOldCanvas: function (canvasId) {
      this.showWelcomePopup = false
      this.switchCanvas(canvasId)
      log.logCanvasOperation(canvasId, 'open-canvas', `${this.userId}`)
    },
    createId: function () {
      let rdAnimal = animalList[Math.floor(Math.random() * (animalList.length))]
      let rdNumber = Math.floor(Math.random() * 1000)

      return `${rdAnimal}-${rdNumber}`
    },
    sendSketchToStory: function (storyId) {
      store.db.get(storyId).then((doc) => {
        let ind = doc.sketches.indexOf(this.currentSketchURL)
        if (ind < 0) {
          doc.sketches.push(this.currentSketchURL)
          doc.current = doc.sketches.length - 1
        } else {
          doc.current = ind
        }
        store.db.put(doc)
        log.logCanvasOperation(this.currentSketchURL, `push-canvas-${storyId}`, `${this.userId}`)
      }).catch((err) => {
        if (err.message === 'missing') {
          store.db.put({
            _id: storyId,
            sketches: [this.currentSketchURL],
            current: 0,
            type: 'story'
          })
          log.logCanvasOperation(this.currentSketchURL, `push-canvas-${storyId}`, `${this.userId}`)
        } else {
          console.log(err)
        }
      })
    },
    registerNewPhotograph: function (imageData) {
      store.db.find({include_docs: true, selector: {type: 'canvas', canvasId: this.currentSketchURL}})
        .then((docs) => {
          if (docs.docs.length > 0) {
            let doc = docs.docs[0]
            doc.photograph = imageData
            store.db.put(doc)
          log.logCanvasOperation(this.currentSketchURL, 'add-photos', `${this.userId}`)
          }
        }).catch((err) => {
          console.error(err)
        })
    }
  },
  components: {
    WelcomePopup,
    MiniGallery,
    PushScreenButton,
    TakePicButton
  }
}
</script>

<style scoped>
.drawing-board{
  height: 100%;
}

#drawing-canvas{
  width: 100%;
  height: 100%;
  border-style: none;
}

#drawing-tools{
  position: absolute;
  width: 100%;
  height: 100%;
}

#photo-video {
  width: 100vw;
  height: 100vh;
  z-index: -4;
  position: fixed;
  top: 0;
  left: 0;
}

#photo-canvas {
  width: 100vw;
  height: 100vh;
  z-index: -5;
  position: fixed;
  top: 0;
  left: 0;
}

</style>
