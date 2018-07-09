<template>
    <div id="loader-overlay" v-show="active">
        <div id="loader-wrapper">
            <div id="loader"></div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'Loading',
      props:
          {
            active: {
              required: true,
              type: Boolean,
            },
          }
      ,
    };
</script>

<style scoped>

    #loader-overlay {
        background-color: rgba(0, 0, 0, .5);
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1000;
    }

    #loader-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;

        width: 100px;
        height: 100px;
        /* bring your own prefixes */
        transform: translate(-65%, -50%);
    }

    #loader {
        width: 100%;
        height: 100%;

        margin: 0 auto;
        border-radius: 50%;
        border: 10px solid blue;
        border-right-color: green;
        border-bottom-color: red;
        border-left-color: yellow;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>