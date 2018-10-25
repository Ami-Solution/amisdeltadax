<template lang="pug">
.depth
  .chart-container#depth-chart-container(ref="depth_chart_container")

</template>

<script>
import * as d3 from 'd3'
import moment from 'moment'
export default {
  name: 'Depth',
  props: {
    buys: {
      type: Array,
      default: () => []
    },
    sells: {
      type: Array,
      default: () => []
    },
    agg: {
      type: Number,
      default: 50
    }
  },
  watch: {
    buys: {
      handler: function(newData, oldData){
        if(this.buys.length && this.svg){
          setTimeout(()=> {
            this.draw(this.formattedBuys, this.formattedSells)
          }, 100)
        }
      },
      immediate: true,
      deep: true
    },
    sells: {
      handler: function(newData, oldData){
        if(this.sells.length && this.svg){
          setTimeout(()=> {
            this.draw(this.formattedBuys, this.formattedSells)
          }, 100)

        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    initChart(){
      this.margin = {top: 0, right: -1, bottom: -1, left: -1}
      this.width = this.$refs.depth_chart_container.clientWidth - this.margin.left - this.margin.right
      this.height = this.$refs.depth_chart_container.clientHeight - this.margin.top - this.margin.bottom

      this.svg = d3.select('#depth-chart-container')
        .append("svg:svg")
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)

      this.g = this.svg.append("svg:g")
	      .attr("id","depth-chart-group")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    },
    draw(buy_data, sell_data){
      // log(buy_data)
      let all_data = buy_data.concat(sell_data)

      d3.select("#depth-chart-group").selectAll("*").remove()

      // START
      // let x = d3.scaleLinear()
      //     .rangeRound([0, this.width])
      let x = d3.scalePow().exponent(2)
          .rangeRound([0, this.width])

      // let y = d3.scaleLinear()
      //     .rangeRound([this.height, 0])
      let y = d3.scalePow().exponent(2)
          .rangeRound([this.height, 0])

      var buy_area = d3.area()
          .curve(d3.curveStep)
          .x(d => { return x(d.price) })
          .y1(d => { return y(d.cum_volume) })

      var sell_area = d3.area()
          .curve(d3.curveStep)
          .x(d => { return x(d.price) })
          .y1(d => { return y(d.cum_volume) })

      x.domain(d3.extent(all_data, d => { return d.price }))
      y.domain([0, d3.max(all_data, d => { return d.cum_volume })])

      buy_area.y0(y(0))
      sell_area.y0(y(0))

      // Grids
      this.g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x)
              .ticks(30)
              .tickSize(-this.height)
              .tickFormat(""))

      this.g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
              .ticks(20)
              .tickSize(-this.width)
              .tickFormat(""))

      // Buy Gradient
      this.g.append("linearGradient")
        .attr("id", "buy-area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", y(all_data.length / 4))
        .attr("y2", 0)
        .selectAll("stop")
        .data([

          {offset: "0%", color: "rgba(0, 0, 0, .6)"},
          {offset: "50%", color: "rgba(132, 247, 102, .6)"},
          {offset: "100%", color: "rgba(132, 247, 102, .6)"},
        ])
        .enter().append("stop")
        .attr("offset", d => { return d.offset })
        .attr("stop-color", d => { return d.color })

      // Sell Gradient
      this.g.append("linearGradient")
        .attr("id", "sell-area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", this.width)
        .attr("y2", 0)
        .selectAll("stop")
        .data([
          {offset: "0%", color: "rgba(255,0,0,0.6)"},
          {offset: "50%", color: "rgba(255,0,0,0.6)"},
          {offset: "100%", color: "rgba(30, 43, 52, .7)"},
        ])
        .enter().append("stop")
        .attr("offset", d => { return d.offset })
        .attr("stop-color", d => { return d.color })


      // Buy Area
      this.g.append("path")
        .datum(buy_data)
        .attr("class", "buy-area")
        .attr("d", buy_area);

      // Sell Area
      this.g.append("path")
        .datum(sell_data)
        .attr("class", "sell-area")
        .attr("d", sell_area);

      this.g.append("g")
      // .attr("transform", "translate(0," + this.height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x)
              .ticks(5)
             )

      this.g.append("g")
        .attr("transform", "translate(" + this.width + ", 0)")
        .attr("class", "axis")
        .call(d3.axisRight(y)
              .ticks(15)
             )
    },
  },
  computed: {
    sortedBuys(){
      return this.buys.sort((a, b) => {
        if(a.price > b.price){
          return -1
        }
        if(a.price < b.price){
          return 1
        }
        return 0
      })
    },
    filteredBuys(){
      return this.sortedBuys.slice(0, this.maxAggBuyIndex)
    },
    formattedBuys(){
      let cum_worth = 0
      let cum_volume = 0
      return this.filteredBuys.map(order => {
        cum_worth += order.volume * order.price
        cum_volume += order.volume
        return {
          type:       "buy",
          volume:     order.volume,
          price:      order.price,
          total:      order.volume * order.price,
          cum_worth:  cum_worth,
          cum_volume: cum_volume
        }
      })
    },
    sortedSells(){
      return this.sells.sort((a, b) => {
        if(a.price > b.price){
          return 1
        }
        if(a.price < b.price){
          return -1
        }
        return 0
      })
    },
    filteredSells(){
      return this.sortedSells.slice(0, this.maxAggSellIndex)
    },
    formattedSells(){
      let cum_worth = 0
      let cum_volume = 0
      return this.filteredSells.map(order => {
        cum_worth += order.volume * order.price
        cum_volume += order.volume
        return {
          type:       "sell",
          volume:     order.volume,
          price:      order.price,
          total:      order.volume * order.price,
          cum_worth:  cum_worth,
          cum_volume: cum_volume
        }
      })
    },
    averageBuyPrice(){
      let sum = this.buys.reduce((total, current) => {
        return total + current.price
      }, 0)
      return sum / this.buys.length
    },
    minBuyPrice(){
      return this.buys.reduce((min, current) => {
        if(current.price < min){
          min = current.price
        }
        return min
      }, Infinity)
    },
    maxBuyPrice(){
      return this.buys.reduce((max, current) => {
        if(current.price > max){
          max = current.price
        }
        return max
      }, 0)
    },
    maxAggBuyIndex(){
      return parseInt(this.buys.length * (this.agg / 100))
    },
    minAggBuyPrice(){
      let index = parseInt(this.buys.length * (this.agg / 100))
      return this.buys[index].price
    },
    maxAggSellIndex(){
      return parseInt(this.sells.length * (this.agg / 100))
    },
    minSellPrice(){
      return this.sells.reduce((min, current) => {
        if(current.price < min){
          min = current.price
        }
        return min
      }, Infinity)
    },
    maxSellPrice(){
      return this.sells.reduce((max, current) => {
        if(current.price > max){
          max = current.price
        }
        return max
      }, 0)
    },
    averageSellPrice(){
      let sum = this.sells.reduce((total, current) => {
        return total + current.price
      }, 0)
      return sum / this.sells.length
    }
  },
  mounted(){
    this.initChart()
  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"

.depth
  flex-basis 100%
  height 100%
  position relative
  overflow hidden

  h3
    color black

  .chart-container
    height 100%
    width 100%

    svg
      shape-rendering crispedges
      height 100%
      width 100%

      text
        opacity 0
        dy 10px
        fill transparentify($color-text, 45%)

   .buy-area
     // fill transparentify($color-green, 25%)
     fill url(#buy-area-gradient)
     stroke url(#buy-area-gradient)
     stroke-width 3px
     // stroke-dasharray 1500

   .sell-area
     fill url(#sell-area-gradient)
     // fill transparentify($color-red, 25%)
     stroke url(#sell-area-gradient)
     stroke-width 3px
     // stroke-dasharray 500

   .domain
     stroke none
   .tick
     line
       stroke none
   .axis
     stroke black
     stroke-opacity 0.2

  .grid line
    stroke rgba(0, 0, 0, .1)
    stroke-width 1px
    shape-rendering crispEdges


  .grid path
    stroke-width: 0;


</style>
