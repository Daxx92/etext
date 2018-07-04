<template>

    <div class="container-fluid p-2 h-100">

        <div class="alert-container" v-show="alert.visible">
            <b-alert dismissible
                     :variant="alert.variant"
                     :show="alert.visible"
                     @dismissed="alert.visible=false"
            >
                {{ alert.text }}
            </b-alert>
        </div>

        <loading :active.sync="isLoading"
                 :can-cancel="false"
                 :is-full-page="true"></loading>

        <div class="h-100 d-flex bd-highlight align-content-stretch flex-column">

            <div class="d-block flex-fill flex-grow-0 jumbotron p-1 m-0 mb-2">

                <div class="row">
                    <div class="col text-left">
                        <b-button class="m-0" size="sm" variant="success" @click="open"> Open File</b-button>
                        <b-button class="m-0" size="sm" variant="success" @click="saveFile"> Save File</b-button>
                        <b-button class="m-0" size="sm" variant="success" @click="rsaModal = !rsaModal">
                            Encryption Settings
                        </b-button>
                        <b-button class="m-0" size="sm" variant="success" @click="createRsaKeys">
                            Create RSA Keys
                        </b-button>
                    </div>
                    <div class="col text-right">
                        <toggle-button class="m-0"
                                       @change="toggleEditor"
                                       :value="editorVisible"
                                       :labels="{checked: 'Editor: Visible', unchecked: 'Editor: Hidden'}"
                                       :width="100"
                                       :sync="true"
                                       :disabled="!viewerVisible"

                        />

                        <toggle-button class="m-0"
                                       @change="toggleViewer"
                                       :value="viewerVisible"
                                       :labels="{checked: 'HTML: Visible', unchecked: 'HTML: Hidden'}"
                                       :width="100"
                                       :sync="true"
                        />
                    </div>
                </div>

            </div>

            <div class="d-flex flex-fill flex-row">
                <div class="pr-2" :class="widthClass(viewerVisible)" v-show="editorVisible">
                    <div class="h-100 rounded" ref="editor"></div>
                </div>
                <div class="pt-1 px-2" :class="widthClass(editorVisible)" v-show="viewerVisible">
                    <div id="html" class="h-100" ref="html"></div>
                </div>
            </div>
        </div>

        <b-modal
                centered
                header-bg-variant="dark"
                header-text-variant="light"
                v-model="rsaModal"
                title="RSA Keys"
                :ok-only="true"
                @ok="validateForm"
        >

            <form @submit.stop.prevent="">
                <b-form-group id="rsa-private-input"
                              label="RSA Public key"
                              label-for="rsa-private"
                              description="Set your RSA public key.">
                    <b-form-textarea id="rsa-private"
                                     v-model.trim="publicRsaKey"
                                     placeholder="RSA public key (.pub file)"
                                     :rows="3"
                                     :max-rows="6">
                    </b-form-textarea>
                </b-form-group>

                <b-form-group id="textarea1-input"
                              label="RSA Private key"
                              label-for="textarea1"
                              description="Set your RSA private key.">
                    <b-form-textarea id="textarea1"
                                     v-model.trim="privateRsaKey"
                                     placeholder="RSA private file (.pem file)"
                                     :rows="3"
                                     :max-rows="6">
                    </b-form-textarea>
                </b-form-group>

            </form>

        </b-modal>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron'; // eslint-disable-line
    import Loading from 'vue-loading-overlay';

    import Vue from 'vue';

    import marked from 'marked';
    import highlight from 'highlight.js';

    import {
      SHOW_OPEN_DIALOG,
      SHOW_SAVE_DIALOG,
      FILE_READ,
      FILE_WRITTEN,
      FILE_ERROR,
      RSA_KEYS_CREATED,
      CREATE_RSA_KEYS,
    } from '../../utils/Constants';

    const ace = require('brace');
    require('brace/mode/markdown');
    require('brace/theme/monokai');

    const bus = new Vue();

    ipcRenderer.on(FILE_READ, (event, data) => {
      bus.$emit(FILE_READ, data);
    });
    ipcRenderer.on(FILE_WRITTEN, (event, data) => {
      bus.$emit(FILE_WRITTEN, data);
    });

    ipcRenderer.on(FILE_ERROR, (event, data) => {
      bus.$emit(FILE_ERROR, data);
    });

    ipcRenderer.on(RSA_KEYS_CREATED, (event, data) => {
      bus.$emit(RSA_KEYS_CREATED, data);
    });

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      breaks: true,
      highlight(code) {
        return highlight.highlightAuto(code).value;
      },
    });

    export default {
      name: 'MarkdownEditor',
      components: { Loading },
      data() {
        return {
          editorVisible: true,
          viewerVisible: true,
          aceEditor: null,
          isLoading: false,
          alert: {
            variant: 'success',
            text: 'Tha friggin text!',
            visible: false,
          },
          rsaModal: false,
          publicRsaKey: '',
          privateRsaKey: '',
        };
      },
      methods: {
        open() {
          if (this.isInputValid()) {
            this.isLoading = true;
            const payload = {
              privateRsaKey: this.privateRsaKey,
            };

            ipcRenderer.send(SHOW_OPEN_DIALOG, payload);
          }
        },
        saveFile() {
          if (this.isInputValid()) {
            this.isLoading = true;
            const payload = {
              content: this.aceEditor.getValue(),
              publicRsaKey: this.publicRsaKey,
            };

            ipcRenderer.send(SHOW_SAVE_DIALOG, payload);
          }
        },
        createRsaKeys() {
          this.isLoading = true;
          ipcRenderer.send(CREATE_RSA_KEYS);
        },
        widthClass(visible) {
          return visible ? 'w-50' : 'w-100';
        },
        toggleEditor() {
          this.editorVisible = !this.editorVisible;
          this.forceEditorVisibleIfEmptyScreen();
        },
        toggleViewer() {
          this.viewerVisible = !this.viewerVisible;
          this.forceEditorVisibleIfEmptyScreen();
        },
        forceEditorVisibleIfEmptyScreen() {
          if (!this.editorVisible && !this.viewerVisible) {
            this.editorVisible = true;
          }
        },
        validateForm(event) {
          event.preventDefault();

          const valid = this.isInputValid();

          if (valid) {
            this.alert.visible = true;
            this.alert.variant = 'success';
            this.alert.text = 'Data saved, you can now open & save files.';
            this.rsaModal = false;
          }

          return valid;
        },
        isInputValid() {
          if (!this.isRSAPrivateValid) {
            this.alert.visible = true;
            this.alert.variant = 'danger';
            this.alert.text = 'Invalid Private RSA key';
            return false;
          } else if (!this.isRSAPublicValid) {
            this.alert.visible = true;
            this.alert.variant = 'danger';
            this.alert.text = 'Invalid Public RSA key';
            return false;
          }
          return true;
        },
      },
      computed: {
        mode() {
          return this.$store.state.mode;
        },
        isRSAPublicValid() {
          return this.publicRsaKey.length >= 5; // Aprox lenght of a key?
        },
        isRSAPrivateValid() {
          return this.privateRsaKey.length >= 5; // Aprox lenght of a key?
        },
      },
      mounted() {
        const editor = this.$refs.editor;
        const html = this.$refs.html;

        this.aceEditor = ace.edit(editor);
        this.aceEditor.getSession().setMode('ace/mode/markdown');
        this.aceEditor.setTheme('ace/theme/monokai');
        this.aceEditor.getSession().setUseWrapMode(true);
        this.aceEditor.getSession().setWrapLimitRange(80, 100);
        this.aceEditor.$blockScrolling = Infinity;

        this.aceEditor.on('change', () => {
          if (this.viewerVisible) {
            // console.log('Parsing & rendering');
            html.innerHTML = marked(this.aceEditor.getValue());
          } else {
            // console.log('NOT Parsing & rendering');
          }
        });

        bus.$on(FILE_READ, (fileContents) => {
          // Only load contents if a file is selected and read
          if (fileContents !== false) {
            this.aceEditor.setValue(fileContents, -1);

            this.alert.visible = true;
            this.alert.variant = 'success';
            this.alert.text = 'File loaded!';

            this.isLoading = false;

            /* ****************************************************
                            * @TODO: Large Files!
                            * Large files have a huge overhead, but somehow ~ 10mb is ok?
                            * Maybe some kind of separator or something that tells us where to split?
                            ***************************************************** */
            /* console.log(fileContents.length);
                            const l = fileContents.length;
                            const ml = 10000000;
                            const t = l > ml ? fileContents.substring(0, ml) : fileContents;
                            this.aceEditor.setValue(t);
                            this.isLoading = false; */
          } else {
            this.alert.variant = 'warning';
            this.alert.text = 'Select a file to open it in the editor.';
            this.alert.visible = true;
            this.isLoading = false;
          }
        });

        bus.$on(FILE_WRITTEN, (fileWritten) => {
          if (fileWritten) {
            this.alert.variant = 'success';
            this.alert.text = 'File saved!';
            this.alert.visible = true;
          } else {
            this.alert.variant = 'warning';
            this.alert.text = 'Select a file to save editor contents.';
            this.alert.visible = true;
          }
          this.isLoading = false;
        });

        bus.$on(RSA_KEYS_CREATED, (keys) => {
          this.privateRsaKey = keys.privateRsaKey;
          this.publicRsaKey = keys.publicRsaKey;

          this.alert.variant = 'success';
          this.alert.text = 'Keys created, you can view them in the "Encryption Settings" window. Please save them somewhere in your pc.';
          this.alert.visible = true;
          this.isLoading = false;
        });

        bus.$on(FILE_ERROR, (error) => {
          this.alert.variant = 'danger';
          this.alert.text = error;
          this.alert.visible = true;
          this.isLoading = false;
        });
      },
    };
</script>

<style>

    @import "~vue-loading-overlay/dist/vue-loading.min.css";

    .alert-container {
        position: absolute;
        z-index: 999999;
        width: 80%;
        left: 10%;
        top: 10%;
    }

    #html {
        overflow-y: auto;
    }
</style>