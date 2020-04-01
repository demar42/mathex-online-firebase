<template>
    <quill-editor v-model="text" :options="quillOptions"/>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import {quillEditor} from 'vue-quill-editor'

export default {
    props: ['value'],
    name: 'TextEditor',
    components: {
        quillEditor
    },
    data() {
        return {
            text: '',
            quillOptions: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['image']
                    ]
                },
            }
        }
    },
    watch: {
        value: {
            handler: function() {
                this.text = this.value
            },
            immediate: true
        },
        text() {
            this.$emit('input', this.text)
        }
    }
}
</script>

<style>
.ql-container.ql-snow {
    font-family: inherit;
    font-size: 1rem;
}
</style>