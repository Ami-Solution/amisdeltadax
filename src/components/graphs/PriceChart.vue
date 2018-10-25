<template lang="pug">
.price-chart.component
  .header
    span PRICE CHART

    .left
      .option-container
        span(@click="reset()") RESET

  .body
    .chart-container#price-chart-container(ref="price_chart_container")

  overlay(:visible="priceChart.loading")
</template>

<script>
import * as d3 from 'd3'
import moment from 'moment'
import Overlay from '@/components/Overlay'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PriceChart',
  components: {
    Overlay
  },
  data(){
    return {

    }
  },
  props: {
    trades: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    trades: {
      handler: function(newData, oldData){
        if(this.trades.length && this.svg){
          this.draw(this.formatData(this.trades))
        }
      },
      immediate: true,
      deep: true
    },
  },

  methods: {
    initChart(){
      this.margin = {top: 10, right: 20, bottom: 70, left: 50}
      this.width = this.$refs.price_chart_container.clientWidth - this.margin.left - this.margin.right
      this.height = this.$refs.price_chart_container.clientHeight - this.margin.top - this.margin.bottom

      this.svg = d3.select('#price-chart-container')
        .append("svg:svg")
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)

      this.g = this.svg.append("svg:g")
	      .attr("id","price-chart-group")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    },

    draw(trade_data){
      // log("trade_data: ", trade_data)
      d3.select("#price-chart-group").selectAll("*").remove()

      // START
      // set the ranges
      this.zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
        .on("zoom", this.zoomed);

      this.x = d3.scaleTime().range([0, this.width]);
      this.y = d3.scaleLinear().range([this.height, 0]);

      // define the line
      this.priceLine = d3.line()
        .curve(d3.curveStep)
        .x(trade => { return this.x(trade.date) })
        .y(trade => { return this.y(trade.price) })

      this.x.domain(d3.extent(trade_data, trade => { return trade.date }))
      this.y.domain([0, d3.max(trade_data, trade => { return trade.price })])

      this.xAxis = d3.axisBottom(this.x)
      this.yAxis = d3.axisLeft(this.y)

      this.gridXAxis = d3.axisBottom(this.x)
      this.gridYAxis = d3.axisLeft(this.y)


      // Add the valueline path.
      this.priceLinePath = this.g.append("path")
        .data([trade_data])
        .attr("class", "line")
        .attr("d", this.priceLine);

      // Add the X Axis
      this.gX = this.g.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)

      // Add the Y Axis
      this.gY = this.g.append("g")
        .call(this.yAxis)

      // Add the grid
      this.gridX = this.g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.gridXAxis
              .ticks(5)
              .tickSize(-this.height)
              .tickFormat("")
             )

      this.gridY = this.g.append("g")
        .attr("class", "grid")
        .call(this.gridYAxis
              .ticks(15)
              .tickSize(-this.width)
              .tickFormat("")
             )

      this.view = this.g.append("rect")
        .attr("class", "view")
        .attr("x", 0.5)
        .attr("y", 0.5)
        .attr("width", this.width - 1)
        .attr("height", this.height - 1)

      this.g.call(this.zoom)
    },

    zoomed() {
      this.view.attr("transform", d3.event.transform);
      this.gX.call(this.xAxis.scale(d3.event.transform.rescaleX(this.x)))
      this.gY.call(this.yAxis.scale(d3.event.transform.rescaleY(this.y)))

      this.gridX.call(this.gridXAxis.scale(d3.event.transform.rescaleX(this.x)))
      this.gridY.call(this.gridYAxis.scale(d3.event.transform.rescaleY(this.y)))

      let t = d3.event.transform
      let xt = t.rescaleX(this.x)
      let yt = t.rescaleY(this.y)
      this.g.select(".line").attr("d", this.priceLine.x(trade => { return xt(trade.date) }))
      this.g.select(".line").attr("d", this.priceLine.y(trade => { return yt(trade.price) }))

    },
    reset(){
      this.g.transition()
        .duration(750)
        .call(this.zoom.transform, d3.zoomIdentity)
    },
    formatData(trades){
      let lastTrade = trades[trades.length - 1]
      return trades.filter(trade => {
        if((trade.price * 10) < lastTrade.price || (trade.price / 10) > lastTrade.price){
          return false
        } else {
          return true
        }
      }).map(trade => {
        return {
          volume: trade.amount,
          price: trade.price,
          date:  trade.date,
          total: trade.amount * trade.price
        }
      })
    },
  },

  computed: {
    ...mapGetters({
      priceChart: "components/price_chart",
    }),
  },
  mounted(){
    this.initChart()
  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"

.price-chart
  flex-basis 100%
  height 100%
  position relative

  .left
    display flex
    margin-left auto

    .option-container
      display flex
      align-items center
      margin-left 20px
      span
        font-size 11px
        font-weight 700
        color $color-text
        margin-right 10px
        border 1px solid $color-component-background
        padding 5px 10px
        cursor pointer

        &:hover
          background $color-component-background

  .body
    height 100%
    overflow hidden

    .chart-container
      height 100%
      width 100%

      svg
        shape-rendering crispedges
        height 100%
        width 100%

        text
          dy 10px
          fill transparentify($color-text, 45%)


     .domain
       stroke none
     .tick
       line
         stroke none
     // .axis
     //   stroke $color-text

  .grid line {
    stroke $color-text
    stroke-opacity 0.1
    shape-rendering crispEdges
  }

  path {
    stroke: steelblue
    stroke-width: 2;
    fill: none;
  }

  .grid path {
    stroke-width: 0;
  }

  .view {
    fill: url(#gradient);
    stroke: rgba(0, 0, 0, 0)
  }

  .axis path {
    display: none;
  }

</style>
