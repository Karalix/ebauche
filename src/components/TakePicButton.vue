<template>
  <div class="takepic-button">
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="pic-button" @click="buttonPushed">
      <i class="material-icons">camera</i>
    </button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      videoOn: false,
      stream: null
    }
  },
  methods: {
    buttonPushed: function () {
      if (this.videoOn) {
        this.takePic()
        this.videoOn = false
      } else {
        this.startVideo()
      }
    },
    takePic: function () {
      let canvas = document.querySelector('#photo-canvas')
      let video = document.querySelector('#photo-video')

      // Get the exact size of the video element.
      let width = video.videoWidth
      let height = video.videoHeight

      // Context object for working with the canvas.
      let context = canvas.getContext('2d')

      // Set the canvas to the same dimensions as the video.
      canvas.width = width
      canvas.height = height

      // Draw a copy of the current frame from the video on the canvas.
      context.drawImage(video, 0, 0, width, height)

      // Store the canvas as attachment of the sketch
      let imageData = canvas.toDataURL('image/jpeg')
      this.$emit('new-photograph', imageData)

      video.style.visibility = 'hidden'
      if (this.stream) {
        this.stream.getVideoTracks()[0].stop()
      }
    },
    startVideo: function () {
      let self = this

      let iframe = document.querySelector('#drawing-canvas')
      iframe.contentWindow.postMessage('transparent', '*')

      let video = document.querySelector('#photo-video')
      video.style.visibility = 'visible'

      navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false}).then((stream) => {
        let video = document.querySelector('#photo-video')
        this.stream = stream
        video.srcObject = stream
        video.onloadedmetadata = function (e) {
          video.play()
          self.videoOn = true
        }
      }).catch(
        function (err) {
          console.error(err)
        }
      )
    }
  }
}
</script>

<style>
.takepic-button {
  position: fixed;
  left: 120px;
  bottom: 20px;
  text-align: left;
}
</style>
