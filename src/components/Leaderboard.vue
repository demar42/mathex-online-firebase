<template>
    <div class="card h-100">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">Leaderboard 
                {{$route.params.gameID ? ` - Game ${$route.params.gameID}` : ''}}
            </h5>
            <div class="card-body d-flex flex-column">
                <div class="row">
                    <div class="col-3 px-1 t-header">Pos</div>
                    <div class="col-6 px-1 t-header">Name</div>
                    <div class="col-3 pl-1 t-header text-right">Score</div>
                </div>
                <div class="row flex-grow-1">
                    <div class="col h-100" style="position: relative; overflow: auto" id="l-scroll">
                        <!-- Create a row for every piece of data. Use rank() to determine rank -->
                        <div v-for="score in this.info" :key="score['.key']" :style="determineStyle(score)"
                            class="row t-row">
                            <div class="col-3">{{rank(score)}}</div>
                            <div class="col-6 px-1">{{score.name}}</div>
                            <div class="col-3 text-right">{{score.score}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Leaderboard',
    props: ['info', 'user'],
    data() {
        return {
            sortedItems: [],
            RemPerRow: 2.5,
        }
    },
    watch: {
        info: {
            handler: function(val) {
                this.sortedItems = val.slice().sort(function(a, b) {return b.score - a.score})
            },
            immediate: true
        },
        user: {
            handler: function() {
                this.$nextTick(function() {
                    // Set the scroll position to look at the user
                    // This will attempt to center scroll onto the user
                    // Since we set it from the top, it needs to be "top" of user minus height of view
                    let rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
                    let userTop = this.RemPerRow * (this.rank(this.user) - 1) // use the same formula as above
                    userTop *= rem // it was measured in rem above, so convert to px
                    let view = document.getElementById('l-scroll')
                    let viewHeight = view.offsetHeight
                    view.scrollTop = userTop - viewHeight / 2
                })
            },
            immediate: true
        }
    },
    methods: {
        rank(val) {
            for (let i = 0; i < this.sortedItems.length; i++) {
                // if the keys are the same, return index + 1, so its a human-readable position
                if (val['.key'] === this.sortedItems[i]['.key']) return i + 1
            }
        },
        determineStyle(val) {
            let style = ''
            let rank = this.rank(val)
            style += `top: ${this.RemPerRow * (rank - 1)}rem; z-index: ${rank};`
            // If this is the data of the user, highlight it green
            if (this.user['.key'] === val['.key']) {
                style += 'color: var(--green);'
                console.log()
            }
            // set gold, silver, bronze or white as background color
            switch (rank) {
                case 1:
                    style += 'background-color: #F4C127;'
                    break
                case 2:
                    style += 'background-color: #BDC1BE;'
                    break
                case 3:
                    style += 'background-color: #DB9B41;'
                    break
                default:
                    style += 'background-color: white;'
                    break
            }
            return style
        }
    }
}
</script>

<style scoped>
.t-header {
    font-weight: bold;
}

.t-row {
    position: absolute;
    left: 1.25rem;
    right: 1.25rem;
    transition: top 1s;
}

.t-header, .t-row {
    border-top: 1px solid #dee2e6;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
</style>