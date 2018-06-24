<template>
  <div id="app" class="h-100">
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
      name: 'e-text',
    };
</script>

<style>
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-vue/dist/bootstrap-vue.css';

  @import '~highlight.js/styles/ir-black.css';

  /* CSS */
  html, body{
    height: 100%;
  }

  pre {
    display: block;
    overflow-x: auto;
    color: rgb(248, 248, 248);
    padding: 0.5em;
    background: rgb(0, 0, 0);
  }
</style>
