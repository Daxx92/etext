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
                        <b-button class="m-0" size="sm" variant="success" @click="open"> Open File </b-button>
                        <b-button class="m-0" size="sm" variant="success" @click="saveFile"> Save File </b-button>
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
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'; // eslint-disable-line
    import Loading from 'vue-loading-overlay';

    import Vue from 'vue';

    import CodeMirror from 'codemirror';
    import marked from 'marked';
    import highlight from 'highlight.js';

    import Currying from '@/assets/js/currying';
    import xml from '@/assets/js/xml';
    import markdown from '@/assets/js/markdown';
    import overlay from '@/assets/js/overlay';
    import gfm from '@/assets/js/gfm';
    import javascript from '@/assets/js/javascript';

    import { SHOW_OPEN_DIALOG, SHOW_SAVE_DIALOG, FILE_READ, FILE_WRITTEN } from '../../utils/Constants';

    const bus = new Vue();

    ipcRenderer.on(FILE_READ, (event, data) => {
      bus.$emit(FILE_READ, data);
    });
    ipcRenderer.on(FILE_WRITTEN, (event, data) => {
      bus.$emit(FILE_WRITTEN, data);
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
          codeMirror: null,
          isLoading: false,
          alert: {
            variant: 'success',
            text: 'Tha friggin text!',
            visible: false,
          },
        };
      },
      computed: {
        mode() {
          return this.$store.state.mode;
        },
      },
      methods: {
        open() {
          this.isLoading = true;
          ipcRenderer.send(SHOW_OPEN_DIALOG);
        },
        saveFile() {
          this.isLoading = true;
          ipcRenderer.send(SHOW_SAVE_DIALOG, this.codeMirror.getValue());
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
      },
      mounted() {
        const self = this;
        const editor = self.$refs.editor;
        const html = self.$refs.html;

        Currying(CodeMirror)(xml)(markdown)(overlay)(gfm)(javascript);

        this.codeMirror = CodeMirror(editor, {
          mode: {
            name: 'gfm',
          },
          autoCloseBrackets: true,
          lineWrapping: true,
          scrollbarStyle: null,
          showCursorWhenSelecting: true,
          theme: 'base16-light',
        });

        this.codeMirror.on('change', (editor) => {
          if (self.viewerVisible) {
            console.log('Parsing & rendering');
            html.innerHTML = marked(editor.getValue());
          } else {
            console.log('NOT Parsing & rendering');
          }
        });

        bus.$on(FILE_READ, (fileContents) => {
          console.log('FILE READ FROM FS');

          // Only load contents if a file is selected and read
          if (fileContents !== false) {
            console.log('CONTENTS EXISTS');
            self.alert.visible = true;
            self.alert.variant = 'info';
            self.alert.text = 'Loading file to editor...';

            setTimeout(() => {
              console.log('SET VALUE!');
              // Only write to editor, the on change event parser the markdown!
              self.codeMirror.setValue(fileContents);
              self.alert.variant = 'success';
              self.alert.text = 'File loaded!';
              this.isLoading = false;
            }, 10);
          } else {
            self.alert.variant = 'warning';
            self.alert.text = 'Select a file to open it in the editor.';
            self.alert.visible = true;
            this.isLoading = false;
          }
        });

        bus.$on(FILE_WRITTEN, (fileWritten) => {
          if (fileWritten) {
            self.alert.variant = 'success';
            self.alert.text = 'File saved!';
            self.alert.visible = true;
          } else {
            self.alert.variant = 'warning';
            self.alert.text = 'Select a file to save editor contents.';
            self.alert.visible = true;
          }

          // eslint-disable-next-line no-console
          console.log('File written? ', fileWritten);
    
          this.isLoading = false;
        });
      },
    };
</script>

<style>

    @import "~vue-loading-overlay/dist/vue-loading.min.css";

    .CodeMirror {
        border-radius: 0.25rem !important;
        height: 100%;
    }

    .alert-container{
        position: absolute;
        z-index: 999999;
        width: 80%;
        /* opacity: .8;*/
        left: 10%;
        top: 10%;
    }

    #html {
        overflow-y: auto;
    }
</style>