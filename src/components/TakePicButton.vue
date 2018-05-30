<template>
  <div class="takepic-button">
    <form method="post" id="pic-form">
      <label for="takepic-button" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
        <i class="material-icons">camera</i>
      </label>
      <input class="input-pic" id="takepic-button" type="file" capture="camera" accept="image/*" name="cameraInput">
    </form>
  </div>
</template>

<script>
export default {
  mounted: function () {
    document.querySelector('#takepic-button').addEventListener('change', (e) => {
      console.log(e.target.value)
      console.log(this.sketchUrl)

      let formData = new FormData(document.querySelector('#pic-form'))
      let xhr = new XMLHttpRequest()

      // xhr.open('POST', window.webstrateUrl + this.sketchUrl)
      xhr.onload = function () {
        console.log(this.responseText)
      }
      xhr.open('POST', 'https://demo.webstrates.net/sketch-goose-59/')
      xhr.setRequestHeader('enctype', 'multipart/form-data')
      xhr.send(formData)

      // document.querySelector('#pic-form').setAttribute('action', window.webstrateUrl + this.sketchUrl)
      // document.querySelector('#pic-form').submit()
    })
  },
  props: ['currentSketchUrl'],
  data: function () {
    return {
      sketchUrl: this.currentSketchUrl
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

.input-pic {
  display: none;
}
</style>
