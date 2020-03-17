<template>
  <div class="container h-100">
    <Title/>
    <div class="row justify-content-center">
      <div class="col col-md-10 p-2">
        <!-- CONTENT -->
        <div class="row justify-content-center">
            <div class="h3 text-muted align-self-end">GAME ID</div>
            <div class="display-2 ml-4">{{$route.params.gameID}}</div>
        </div>
        <div class="row mt-4">
            <div class="col">
              <div class="row justify-content-center">
                <div v-if='!gameStarted' class="btn btn-success" @click="toggleGame">Start Game</div>
                <div v-if='gameStarted' class="btn btn-danger" @click="toggleGame">Stop Game</div>
              </div>
                <div class="row mt-4">
                    <h3>LEADERBOARD</h3>
                </div>
                <div class="row row-cols-5">
                    <div class="col mb-2" v-for="(player, k) in players" :key="k">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">{{player.name}}</h5>
                                <p class="display-4">{{player.score}}</p>
                            </div>
                        </div>
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
import {realtime} from '../firebase.config.js'

export default {
  name: 'game',
  components: {
    Title
  },
  data() {
    return {
        playersRaw: [],
        gameStarted: false
    }
  },
  mounted() {
    this.$rtdbBind('playersRaw', realtime.ref(`/games/${this.$route.params.gameID}/players`).orderByChild('score'))
  },
  computed: {
    players: function() {
        return this.playersRaw.slice().reverse()
    }
  },
  methods: {
    toggleGame: function() {
      // start/stop the game
      this.gameStarted = !this.gameStarted
      // write this info to firebase
      realtime.ref('/games/'+ this.$route.params.gameID).update({started: this.gameStarted})
    }
  }
}
</script>

<style>
</style>