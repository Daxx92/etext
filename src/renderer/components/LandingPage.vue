<template>
    <div class="container-fluid p-5">
        <div class="row">
            <div class="col-12 col-md-4">
                <img src="~@/assets/logo.png" alt="electron-vue" class="img-fluid">
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h1 class="text-center">
                    Welcome to your new project!
                </h1>

                <system-information></system-information>

            </div>
            <div class="col">
                <h1 class="text-center">
                    Getting Started
                </h1>
                <p>
                    electron-vue comes packed with detailed documentation that covers everything from
                    internal configurations, using the project structure, building your application,
                    and so much more.
                </p>
                <b-button size="sm" variant="primary" @click="open(docUrls.boilerplate)">
                    Read the docs
                </b-button>

                <hr>

                <h2 class="text-center">
                    Other Documentation
                </h2>
                <b-button size="sm" variant="outline-primary" @click="open(docUrls.electron)">
                    Electron
                </b-button>
                <b-button size="sm" variant="outline-primary" @click="open(docUrls.vue)">
                    Vue.js
                </b-button>

            </div>
        </div>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation';

    export default {
      name: 'landing-page',
      components: { SystemInformation },
      data() {
        return {
          docUrls: {
            boilerplate: 'https://simulatedgreg.gitbooks.io/electron-vue/content/en/',
            electron: 'https://electron.atom.io/docs/',
            vue: 'https://vuejs.org/v2/guide/',
          },
        };
      },
      methods: {
        open(link) {
          this.$electron.shell.openExternal(link);
        },
      },
    };
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

</style>
