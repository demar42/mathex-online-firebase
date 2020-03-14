<template>
  <div class="container h-100">
    <Title link='/' link-text='Go to Play'/>
    <div class="row justify-content-center">
      <div class="col col-md-8 p-5">
        <!-- Table to select a quiz to edit -->
        <template v-if='!selected'>
          <h4>Select a Quiz</h4>
          <div class="list-group">
            <a class="list-group-item list-group-item-action" href="javascript:;" 
              v-on:click="selected = quiz"
              v-for="quiz in quizData" :key="quiz.name">{{quiz.name}}</a>
          </div>
        </template>
        <!-- List of Questions from selected Quiz -->
        <template v-if="selected">
          <button class="btn btn-primary" @click="selected = null">Back</button>
          <h4 class="my-4">Edit <em>{{selected.name}}</em></h4>
          <div class="list-group">
            <a href="javascript:;" class="list-group-item list-group-item-action"
                v-for="(q,i) in selected.questions" :key="i" 
                @click="selectedQ = {q: q, i:i+1}; showModal()">
              <h5>Question {{i+1}}</h5>
              <span class=" h6 text-muted">Question:</span><p>{{q.question}}</p>
              <span class="h6 text-muted mt-2">Answers:</span>
              <p v-if='q.answers'>{{q.answers.join(', ')}}</p>
            </a>
          </div>
          <button class="btn btn-primary mt-2" @click="selected.questions.push('')">Add another question</button>
        </template>
        <!-- Modal to edit Questions -->
        <div class="modal" tabindex="-1" role="dialog" id="editQuestionModal" v-if="selectedQ1">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Question {{selectedQ.i}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <h6>Question</h6>
                <text-editor></text-editor>
                <h6 class="mt-3">Answers</h6>
                <input type="text" class="form-control my-2" v-for="(ans, i) in selectedQ1.q.answers" 
                  :key="i" v-model="selectedQ1.q.answers[i]">
                <button class="btn btn-primary" @click="selectedQ1.q.answers.push('')">Add another answer</button>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary">Save changes</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TextEditor from '@/components/TextEditor'
import jquery from 'jquery'
import {db} from '../firebase.config.js'

export default {
  name: 'admin',
  components: {
    Title,
    TextEditor
  },
  data: function() {
    return {
      quizData: [],
      selected: null,
      selectedQ: null
    }
  },
  methods: {
    showModal: function() {
      this.$nextTick(() => {jquery('#editQuestionModal').modal('show')}); 
    }
  },
  mounted() {
    getQuizDatas(this)
  }
}

function getQuizDatas(vue) {
  db.collection('quizzes').get().then(querySnapshot => {
    querySnapshot.forEach(item => {
      vue.quizData.push(item.data())
    })
  })
}
</script>

<style>
body, html {
  height: 100%;
}
</style>