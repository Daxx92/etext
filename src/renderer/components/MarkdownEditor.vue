<template>

    <div class="container-fluid p-2 h-100">
        <div class="h-100 d-flex bd-highlight align-content-stretch flex-column">
            <div class="d-flex flex-fill flex-row">
                <div class=" pr-2" :class="widthClass(viewerVisible)" v-if="editorVisible">
                    <textarea name="editor" id="editor" class="h-100 form-control" v-model="input"></textarea>
                </div>
                <div class="" :class="widthClass(editorVisible)" v-if="viewerVisible">
                    <div id="html" class="h-100 p-2" v-html="compiledMarkdown"></div>
                </div>
            </div>
            <div class="pt-3 pb-1 flex-fill flex-grow-0 text-right">

                <b-button size="sm" variant="primary" @click="toggleEditor">
                    Toggle Editor
                </b-button>
                <b-button size="sm" variant="primary" @click="toggleViewer">
                    Toggle Viewer
                </b-button>

            </div>
        </div>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce';
    import showdown from 'showdown';

    const converter = new showdown.Converter();

    export default {
      name: 'MarkdownEditor',
      data() {
        return {
          input: '# Hello, this is me!',
          editorVisible: true,
          viewerVisible: true,
        };
      },
      computed: {
        compiledMarkdown() {
          if (!this.viewerVisible) {
            return '';
          }
          return converter.makeHtml(this.input);
        },
      },
      methods: {
        update: debounce((e) => {
          this.input = e.target.value;
        }, 300),
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
    };
</script>

<style scoped>
    #html {
        box-shadow: 10px 5px 25px 1px rgba(0, 0, 0, 1);
        overflow-y: auto;
    }
</style>