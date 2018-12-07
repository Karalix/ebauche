<template>
  <div class="duplicate-button">
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="pic-button" @click="buttonPushed">
      <i class="material-icons">file_copy</i>
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    buttonPushed: function () {
      this.$emit('duplicate-canvas')
    }
  }
}
</script>

<style>
.duplicate-button {
  position: fixed;
  left: 120px;
  bottom: 20px;
  text-align: left;
}
</style>
