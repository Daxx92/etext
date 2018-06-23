<template>

    <div class="container-fluid p-2 h-100">
        <div class="h-100 d-flex bd-highlight align-content-stretch flex-column">

            <div class="d-block flex-fill flex-grow-0 jumbotron p-1 m-0 mb-2">

                <div class="row">
                    <div class="col text-left">
                        <b-button class="m-0" size="sm" variant="success" @click="openFile"> Open File </b-button>
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

    // eslint-disable-next-line import/no-extraneous-dependencies
    const { ipcRenderer } = require('electron');
    const bus = new Vue();

    ipcRenderer.on('fileData', (event, data) => {
      bus.$emit('fileData', data);
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
      data() {
        return {
          editorVisible: true,
          viewerVisible: true,
          codeMirror: null,
        };
      },
      computed: {
        mode() {
          return this.$store.state.mode;
        },
      },
      methods: {
        openFile() {
          ipcRenderer.send('openFile', () => {
            console.log('Event sent.');
          });
        },
        saveFile() {
          ipcRenderer.send('saveFile', this.codeMirror.getValue(), () => {
            console.log('Event sent.');
          });
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
          html.innerHTML = marked(editor.getValue());
        });

        bus.$on('fileData', (fileContents) => {
          self.codeMirror.setValue(fileContents);
          html.innerHTML = marked(fileContents);
        });
      },
    };
</script>

<style>
    .CodeMirror {
        border-radius: 0.25rem !important;
        height: 100%;
    }

    #html {
        overflow-y: auto;
    }
</style>