<template>
    <div>
        <template v-if="!pin_provided">
            <input type="text" class="form-control" placeholder="Enter the Game PIN" 
                v-on:keyup.enter="submitPIN" v-model="pin"/>
            <small>The game PIN will be provided by the teacher</small>
        </template>
        <template v-if="pin_provided">
            <label for="username">Game {{pin}}</label>
            <input id="username" type="text" class="form-control" placeholder="Enter your name" 
                maxlength="12" v-model="username" v-on:keyup.enter="submitUsername"/>
        </template>
    </div>
</template>

<script>
import {realtime} from '../firebase.config.js'

export default {
    name: 'Login',
    data: function() {
        return {
            pin_provided: false,
            pin: null,
            username: ''
        }
    },
    methods: {
        submitPIN: async function() {
            let ref = realtime.ref('/games/' + this.pin)
            // check if the game exists
            let data = (await ref.once('value')).val()
            if (data) {
                // game exists
                this.pin_provided = true
            } else {
                alert('That game PIN doesn\'t exist!')
                this.pin = ''
            }
        },
        submitUsername: async function() {
            let playersRef = realtime.ref(`/games/${this.pin}/players`)
            // init user
            let newUserRef = playersRef.push()
            let logRefRoot = realtime.ref(`/games/${this.pin}/logs/${newUserRef.key}`)
            let logRef = logRefRoot.child('log')
            // Set the initial values. Wait for them all
            Promise.all([
                newUserRef.set({
                    name: this.username,
                    score: 0,
                    cur_question: 0
                }),
                logRefRoot.set({
                    name: this.username,
                    log: []
                })
            ]).then(
                this.$emit('data', {pin: this.pin, userRef: newUserRef, logRef: logRef})
            )
        }
    }
}
</script>
