<template>
    <div id="summernote"></div>
</template>

<script>
import jquery from 'jquery'
import 'summernote/dist/summernote-bs4.js'
import 'summernote/dist/summernote-bs4.css'

export default {
    name: 'TextEditor',
    mounted() {
        jquery('#summernote').summernote({
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'table']]
            ],
            callbacks: {
                onChange: function(contents, $editable) {
                    console.log(contents, $editable)
                }
            }
        })
    }
}
</script>
