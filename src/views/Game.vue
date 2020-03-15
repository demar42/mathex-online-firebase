<template>
  <div class="container h-100">
    <Title/>
    <div class="row justify-content-center">
      <div class="col col-md-10 p-5">
        <!-- CONTENT -->
        <div class="row justify-content-center">
            <div class="h3 text-muted align-self-end">GAME ID</div>
            <div class="display-2 ml-4">{{$route.params.gameID}}</div>
        </div>
        <div class="row mt-4">
            <div class="col">
                <div class="row">
                    <h3>LEADERBOARD</h3>
                </div>
                <div class="row" v-for="(player, k) in players" :key="k">
                    {{player.name}} - {{player.score}}
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
        playersRaw: []
    }
  },
  mounted() {
    this.$rtdbBind('playersRaw', realtime.ref(`/games/${this.$route.params.gameID}/players`).orderByChild('score'))
  },
  computed: {
    players: function() {
        return this.playersRaw.slice().reverse()
    }
  }
}
</script>

<style>
body, html {
  height: 100%;
}
</style>