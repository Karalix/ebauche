<template>
  <div id="app">
    <router-view @create-new-canvas="createNewCanvas"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    createNewCanvas: function (canvasId) {
      window.console.log(canvasId)
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  height: 100%;
}
body{
  margin: 0;
  height: 100vh;
}

</style>
