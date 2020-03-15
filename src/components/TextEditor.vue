<template>
    <div id="summernote">{{value}}</div>
</template>

<script>
import jquery from 'jquery'
import 'summernote/dist/summernote-bs4.js'
import 'summernote/dist/summernote-bs4.css'

export default {
    props: ['value'],
    name: 'TextEditor',
    mounted() {
        var vue = this
        jquery('#summernote').summernote({
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'table']]
            ],
            callbacks: {
                onChange: function(contents) {
                    vue.$emit('input', contents)
                }
            }
        })
    }
}
</script>
