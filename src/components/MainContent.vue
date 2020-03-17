<template>
    <div>
        <Login v-if="!gameinfo" v-on:data="arg => gameinfo = arg"/>
        <template v-if="gameinfo"> 
            <div class="row justify-content-center">
                <div class="col-auto" v-if="finished">
                    <span class="text-success">
                        <span class="display-4">Congratulations!</span> <br>
                        You have completed all the questions!
                    </span>
                </div>
                <div class="col-auto" v-else-if="!started['.value']">
                    <h5>Please wait for the teacher to start the game</h5>
                </div>
                <div class="col-auto" v-else-if="started['.value']">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Question {{user.cur_question + 1}}</h5>
                            <div class="card-body" v-html="questions[user.cur_question].question"></div>
                            <input type="text" class="form-control" placeholder="Enter your answer..."
                                v-model="typedAnswer" @keyup.enter="checkAnswer" :disabled="submitting"
                                :class="{'is-valid': result && showResult, 'is-invalid': !result && showResult}">
                            <small v-if="submitting">Submitting...</small>
                            <small v-if="showResult" :class="{'text-success': result, 'text-danger': !result}">
                                {{result ? 'Correct!' : 'Incorrect.'}}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import Login from '@/components/Login'
import {realtime} from '../firebase.config.js'
import { setTimeout } from 'timers';

export default {
    name: 'MainContent',
    components: {
        Login
    },
    data: function() {
        return {
            gameinfo: null,
            started: null,
            questions: [],
            user: null,
            typedAnswer: '',
            submitting: false,
            showResult: false,
            result: false,
            finished: false
        }
    },
    methods: {
        checkAnswer: function() {
            // disable input
            this.submitting = true
            // delay 5 seconds
            setTimeout(() => {
                // check the results and return accordingly
                this.result = this.questions[this.user.cur_question].answers.includes(this.typedAnswer)
                this.showResult = true
                this.submitting = false
                setTimeout(() => {
                    this.showResult = false
                    this.typedAnswer = ''
                    if (this.result) {
                        // it was correct, so go to the next question
                        // check to make sure we haven't reached the end
                        if (this.user.cur_question + 1 === this.questions.length) {
                            this.finished = true
                        } else {
                            this.gameinfo.userRef.update({
                                score: this.user.score + 5,
                                cur_question: this.user.cur_question + 1,
                            })
                        }
                    }
                }, 1000)
            }, 5000)
        }
    },
    watch: {
        gameinfo: function() {
            // when gameinfo changes, then we need to bind to all the stuff
            this.$rtdbBind('started', realtime.ref(`/games/${this.gameinfo.pin}/started`))
            this.$rtdbBind('questions', realtime.ref(`/games/${this.gameinfo.pin}/questions`))
            this.$rtdbBind('user', this.gameinfo.userRef)
        }
    }
}
</script>
