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
          <button class="btn btn-primary mt-2" @click="quizName = ''; renaming = false; showModal('#nameQuizModal')">Add another quiz</button>
        </template>

        <!-- List of Questions from selected Quiz -->
        <template v-if="selected">
          <button class="btn btn-primary mr-2" @click="selected = null">&lt; Back</button>
          <dropdown 
            :actions="[['Rename', () => {quizName = this.selected.name; renaming = true; showModal('#nameQuizModal')}], ['Delete', deleteQuiz]]" />
          <button class="btn btn-success float-right" @click="playQuiz(selected)">Play this Quiz</button>
          <h4 class="my-4">Edit <em>{{selected.name}}</em></h4>
          <div class="list-group">
            <a href="javascript:;" class="list-group-item list-group-item-action"
                v-for="(q,i) in selected.questions" :key="i" 
                @click="selectedQ = {q: q, i:i+1}; showModal('#editQuestionModal')">
              <h5>Question {{i+1}}</h5>
              <span class=" h6 text-muted">Question:</span><p v-html="q.question"></p>
              <span class="h6 text-muted mt-2">Answers:</span>
              <p v-if='q.answers'>{{q.answers.join(', ')}}</p>
            </a>
          </div>
          <button class="btn btn-primary mt-2" @click="selected.questions.push({question: '', answers: []})">Add another question</button>
        </template>

        <!-- Modal to edit Questions -->
        <div class="modal" tabindex="-1" role="dialog" id="editQuestionModal" v-if="selectedQ">
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
                <text-editor v-model="selectedQ.q.question"/>
                <h6 class="mt-3">Answers</h6>
                <input type="text" class="form-control my-2" v-for="(ans, i) in selectedQ.q.answers" 
                  :key="i" v-model="selectedQ.q.answers[i]">
                <button class="btn btn-primary" @click="selectedQ.q.answers.push('')">Add another answer</button>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss='modal' @click="selectedQ.q.answers = selectedQ.q.answers.filter(Boolean); commitQuiz()">Save changes</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="qEditCancel">Close</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal to name/rename quiz -->
        <div class="modal" id="nameQuizModal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Name Quiz</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <h6>Enter a name for the quiz</h6>
                <input type="text" class="form-control my-2" v-model="quizName">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss='modal' @click="renaming ? renameQuiz() : addQuiz()">{{renaming ? "Rename" : "Create"}}</button>
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
import Dropdown from '@/components/Dropdown'

import jquery from 'jquery'

import {db, realtime} from '../firebase.config.js'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'admin',
  components: {
    Title,
    TextEditor,
    Dropdown
  },
  data: function() {
    return {
      quizData: [],
      selected: null,
      selectedQ: null,
      selectedQOld: null,
      quizName: '',
      renaming: false
    }
  },
  methods: {
    addQuiz: function() {
      let newRef = db.collection('quizzes').doc()
      let newQuiz = {
        id: newRef.id,
        name: this.quizName,
        questions: []
      }
      // push to firebase
      newRef.set(newQuiz)
      // push to local array
      this.quizData.push(newQuiz)
    },
    renameQuiz: function() {
      this.selected.name = this.quizName
      this.commitQuiz()
    },
    deleteQuiz: function() {
      if(confirm('Are you sure you want to delete?')) {
        db.collection('quizzes').doc(this.selected.id).delete().then(getQuizDatas(this))
        this.selected = null
      }
    },
    showModal: function(id) {
      if (id === '#editQuestionModal') this.selectedQOld = cloneDeep(this.selectedQ)
      this.$nextTick(() => {jquery(id).modal('show')}); 
    },
    qEditCancel: function() {
      let index = this.selectedQ.i - 1
      Object.assign(this.selected.questions[index], this.selectedQOld.q)
    },
    commitQuiz: function() {
      // push the quiz to firebase
      db.collection('quizzes').doc(this.selected.id).set(this.selected)
    },
    playQuiz: function(quiz) {
      // commit the quiz
      this.commitQuiz(quiz.id)
      // transfer the quiz into the realtime db
      createGame(quiz, this)
    }
  },
  mounted() {
    getQuizDatas(this)
    clearOldQuizzes()
  }
}

function getQuizDatas(vue) {
  vue.quizData = []
  db.collection('quizzes').orderBy('name').get().then(querySnapshot => {
    querySnapshot.forEach(item => {
      let data = item.data()
      data.id = item.id
      vue.quizData.push(data)
    })
  })
}

function clearOldQuizzes() {
  // Delete any quizzes that have a timestamp that is older than 10 days ago
  realtime.ref('/games').once('value').then(snapshot => {
    let games = snapshot.val()
    let expiry = Math.floor((new Date()).getTime() / 1000) - 10 * 24 * 60 * 60
    for (const key of Object.keys(games)) {
      if (games[key].created < expiry) {
        // Delete it
        realtime.ref('/games/' + key).set(null)
      }
    }
  })
}

async function createGame(quiz, vue) {
  // create a new unique ID
  //   get all the current IDs
  let existingIDs = Object.keys((await realtime.ref('/games').once('value')).val())
  //   create an ID and keep trying until a new one is found (between 99999 and 999999)
  let newID = Math.floor((Math.random() * 900000) + 99999)
  while (existingIDs.includes(String(newID))) {
    newID = Math.floor((Math.random() * 900000) + 99999)
  }
  //   convert it to a string
  newID = String(newID)

  // push the quiz data to the realtime db
  await realtime.ref('/games/' + newID).set({
    questions: quiz.questions,
    users: [],
    created: Math.round((new Date).getTime() / 1000) // mark creation time
  })

  // open link
  vue.$router.push({path: `/admin/${newID}`})
}
</script>

<style>
body, html {
  height: 100%;
}
</style>