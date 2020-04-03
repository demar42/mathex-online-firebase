<template>
    <div class="container">
        <div class="d-flex flex-column min-vh-100">
            <div class="row">
                <Title/>
            </div>
            <div class="row justify-content-left py-4 flex-grow-1" v-if="dataReady">
                <!-- Questions column -->
                <div class="col col-lg-8 px-5">
                    <div class="row justify-content-center">
                        <div class="col-" v-if="finished">
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
                                    </small> <br>
                                    <div class="btn btn-danger" :disabled="submitting || showResult" 
                                        @click="passQuestion">Pass Question</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <!-- Leaderboard column -->
                <div class="col d-none d-lg-block">
                    <leaderboard :info="scores" :user="user"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Title from '@/components/Title'
import Leaderboard from '@/components/Leaderboard'
import {realtime} from '../firebase.config.js'
import { setTimeout } from 'timers'

export default {
    name: 'Play',
    components: {
        Title,
        Leaderboard
    },
    data: function() {
        return {
            gameinfo: null,
            dataReady: false,
            started: {'.value': false},
            questions: [],
            user: null,
            scores: [],
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
                        }
                        realtime.refFromURL(this.gameinfo.userRef).update({
                            score: this.user.score + 5,
                            cur_question: this.user.cur_question + 1,
                        })
                    }
                }, 1000)
            }, 5000)
        },
        passQuestion: function() {
            // check to make sure
            if (confirm('Are you sure you want to pass this question? \nYou cannot come back later.')) {
                this.submitting = true
                // delay a few seconds
                setTimeout(() => {
                    // check to make sure we haven't reached the end
                    if (this.user.cur_question + 1 === this.questions.length) {
                        this.finished = true
                    }
                    realtime.refFromURL(this.gameinfo.userRef).update({
                        cur_question: this.user.cur_question + 1,
                    })
                    this.submitting = false;
                }, 2500)
            }
        }
    },
    watch: {
        gameinfo: function() {
            // when gameinfo changes, then we need to bind to all the stuff
            let vue = this
            Promise.all([
                this.$rtdbBind('started', realtime.ref(`/games/${this.gameinfo.pin}/started`)),
                this.$rtdbBind('questions', realtime.ref(`/games/${this.gameinfo.pin}/questions`)),
                this.$rtdbBind('user', realtime.refFromURL(this.gameinfo.userRef)),
                this.$rtdbBind('scores', realtime.ref(`/games/${this.gameinfo.pin}/players`))
            ]).then(function dataReady() {
                vue.finished = vue.user.cur_question >= vue.questions.length
                vue.dataReady = true
            })
        }
    },
    mounted() {
        // get game info from cookies otherwise redirect back to home
        this.gameinfo = JSON.parse(this.$cookie.get('gameinfo')) || this.$router.push('/')
    }
}
</script>
