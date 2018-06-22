<template>

    <div class="container-fluid p-2 h-100">
        <div class="h-100 d-flex bd-highlight align-content-stretch flex-column">

            <div class="flex-fill flex-grow-0 text-right jumbotron p-0 m-0 mb-2">

                <div class="d-block pt-2">

                    <toggle-button @change="toggleEditor"
                                   :value="editorVisible"
                                   :labels="{checked: 'Editor: Visible', unchecked: 'Editor: Hidden'}"
                                   :width="100"
                                   :sync="true"
                                   :disabled="!viewerVisible"

                    />

                    <toggle-button @change="toggleViewer"
                                   :value="viewerVisible"
                                   :labels="{checked: 'HTML: Visible', unchecked: 'HTML: Hidden'}"
                                   :width="100"
                                   :sync="true"
                    />
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
    import CodeMirror from 'codemirror';
    import marked from 'marked';
    import highlight from 'highlight.js';

    import Currying from '@/assets/js/currying';
    import xml from '@/assets/js/xml';
    import markdown from '@/assets/js/markdown';
    import overlay from '@/assets/js/overlay';
    import gfm from '@/assets/js/gfm';
    import javascript from '@/assets/js/javascript';

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
          input: '# Hello, this is me!',
          editorVisible: true,
          viewerVisible: true,
          darkTheme: true,
          codeMirror: null,
        };
      },
      computed: {
        mode() {
          return this.$store.state.mode;
        },
      },
      methods: {
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
        const editor = this.$refs.editor;
        const html = this.$refs.html;
    
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