<template>
    <svg id="leaderboard-d3"></svg>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: 'Leaderboard',
    props: ['info'],
    data() {
        return {
            chart: null
        }
    },
    watch: {
        info: {
            handler: function(val) {this.dataChanged(val)},
            deep: true
        }
    },
    mounted() {
        // Fire the data changed thing
        this.newChart(this.info)
        window.addEventListener('resize', () => this.newChart(this.info))
    },
    methods: {
        newChart(val) {
            let svg = d3.select('#leaderboard-d3')

            const padding = 20
            const height = svg.node().getBoundingClientRect().height - padding
            const width = svg.node().getBoundingClientRect().width - padding

            if (this.chart) this.chart.remove()

            this.chart = svg.append('g')
                .attr('height', height)
                .attr('width', width)
                .attr('transform', `translate(${padding}, ${padding})`)

            this.dataChanged(val)
        },
        dataChanged(val) {
            let svg = d3.select('#leaderboard-d3')

            val = val.slice().reverse()

            const padding = 20
            const height = svg.node().getBoundingClientRect().height - padding
            const width = svg.node().getBoundingClientRect().width - padding

            const barTotalHeight = height / val.length
            const barPadding = 5
            const barHeight = barTotalHeight - barPadding

            let xFunction = d3.scaleLinear()
                .range([0, width - 2 * padding])
                // data is min of 15, otherwise 5 more than highest score
                .domain([0, d3.max([15, d3.max(val, val => {return val.score}) + 5])])

            // bars
            let selection = this.chart.selectAll('g')
                .data(val)

            let newBar = selection.enter()
                .remove('g')
                .append('g')
                .attr('transform', function(d, i){
                    return `translate(0, ${barTotalHeight * i + barPadding})`;
                })

            newBar.append('rect')
                .attr('width', d => {return xFunction(d.score)})
                .attr('height', barHeight)
                .style('fill', 'var(--blue)')

            newBar.append('text')
                .attr('y', barHeight / 2)
                .style('fill', 'black')
                .attr('dy', '.35em')
                .text(function(d){
                    return d.name;
                })
                .attr('x', function(d){
                    return xFunction(d.score) + 10;
                })

            selection.select('g')
                .attr('transform', function(d, i){
                    return `translate(0, ${barTotalHeight * i + barPadding})`;
                })

            selection.select('g text')
                .attr('x', function(d){
                    return xFunction(d.score) + 10;
                })

            // axis
            let xAxis = d3.axisTop(xFunction)
                .ticks(d3.max([15, d3.max(val, val => {return val.score}) + 5]) / 5)
                .tickSizeOuter(0)
                .tickSizeInner(-height)
            
            let axis = this.chart.append('g')
                .call(xAxis)
                
            axis.selectAll('.tick:not(:first-of-type) line').remove()
        }
    }
}
</script>

<style>
svg {
    width: 100%;
    height: 100%;
}
</style>