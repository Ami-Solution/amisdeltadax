<template lang="pug">
#navbar
  .left
    router-link.brand(:to="{name: 'home'}" tag="span")
      span.delta Delta
      //- span.hyph -
      span.dax DAX
    .break(v-if="$route.name != 'home'")
    .token-select(v-if="$route.name != 'home'")
      // img(src="https://files.coinmarketcap.com/static/img/coins/32x32/bitcoin.png")
      input(:value="token_filter" @focus="tokenSelectActive = true" @blur="tokenSelectActive = false" @input="onFilterChange")
      i.material-icons arrow_drop_down
      .type-ahead(v-if="tokenSelectActive")
        .token(v-for="token in tokens" @mousedown="onTokenSelect(token)")
          span {{token.name}}
    .break(v-if="$route.name != 'home'")
    .price-container(v-if="trades && trades.length && $route.name != 'home'")
      span.price {{trades[0].price}}
  .center(v-if="$route.name != 'home'")
    .current-address
      span.address {{address}}

  .right
    .version
      span v0.1.1b
      .donate.button(@click="openDonateModal()") Donate
    //- .current-address
    //-   span.address {{address}}
    //- router-link(:to="{name: 'portfolio', params: {address: address}}")
    //-   i.material-icons pie_chart
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import APIs from '../store/apis'

export default {
  name: 'Navbar',
  data(){
    return {
      token: "",
      tokenSelectActive: false
    }
  },
  methods: {
    ...mapMutations({
      updateTokenFilter: "tokens/UPDATE_TOKEN_FILTER",
      updateCurrentToken: "tokens/UPDATE_CURRENT_TOKEN",
      openModal: "components/OPEN_MODAL",
      closeModal: "components/CLOSE_MODAL",
      showAllLoading: "components/SHOW_ALL_LOADING",
    }),
    ...mapActions({
      initCurrentMarket: 'markets/init_current_market',
    }),
    openDonateModal(){
      this.openModal("DonateModal")
    },
    onFilterChange(e){
      this.updateTokenFilter(e.target.value)
    },
    onTokenSelect(token){
      this.showAllLoading()
      this.updateCurrentToken(token)
      this.initMarket()
    },
    initMarket(trys=0){
      // log("trys: ", trys)
      this.initCurrentMarket().then(market => {
        this.closeModal()
        // this.watchMarket()
      }, error => {
        // back off, ED rate limit is 12 req/min
        if(trys > 6){
          trys = 0
        } else {
          trys++
        }
        setTimeout(()=>{
          this.initMarket(trys)
        }, trys * 1000)
      })
    },
  },
  computed: {
    ...mapGetters({
      navbar: 'components/navbar',
      tokens: 'tokens/filtered_tokens',
      current_token: 'tokens/current_token',
      token_filter: 'tokens/token_filter',
      trades: 'trades/current_token_trades',
      address: 'users/address',
    }),
  },


  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

#navbar
  height 100%
  display flex
  flex-basis 100%
  align-items center
  box-shadow 0px 1px 1px 1px rgba(0, 0, 0, .1)
  background-color white

  .left
    flex-basis 25%
    margin-left 1em
    display flex
    align-items center

    .brand
      font-size 36px
      font-weight bold
      margin-right 20px
      display flex
      align-items center
      cursor pointer

      .delta
        color #0067CD
        font-size 30px
        font-family 'Open Sans', sans-serif
        font-weight 600
      .hyph
        color $color-text-invert
        margin-right 4px
        margin-left 4px
      .dax
        color rgba(30, 43, 52, 0.83)
        font-size 30px
        font-family 'Russo One', sans-serif
        height 29px
    .break
      border-radius 3px
      width 1px
      height 35px
      background rgba(44,53,57, .8)
      margin-right 20px


    .token-select
      position relative
      img
        position absolute
        left -20px

      input
        font-size 22px
        width 100px
        text-transform uppercase
        border none
        cursor pointer
        color $color-text-invert
        font-size 24px
        background white
        font-weight 400
        // border 1px solid rgba(0, 0, 0, .1)

      i
        color rgba(0, 0, 0, .6)
        font-size 24px
        position absolute
        top 5px
        right 20px

      .type-ahead
        background white
        position absolute
        width 100px
        top 40px
        left 0px
        max-height 300px
        overflow scroll
        border solid 1px rgba(0, 0, 0, .1)
        border-top none
        box-shadow 3px 4px 2px 0px rgba(0, 0, 0, .4);
        display flex
        z-index 3
        display block
        .token
          cursor pointer
          flex-basis 100%
          padding 3px 0px

          &:hover
            background rgba(0,0,0, .1)

          span
            margin-left 10px
            font-size 20px
            color rgba(0,0,0, .8)

    .price-container
      .price
        color $color-text-invert
        font-weight 400

  .center
    flex-grow 1
    .current-address
      margin-right 1em
      text-align center
      span
        color $color-text-invert
        font-weight 400

  .right
    flex-basis 25%
    margin-left auto
    margin-right 1em
    display flex
    align-items right

    .version
      display flex
      margin-left auto
      span
        color $color-text-invert
        margin-left auto
        margin-right 1em

    .donate

      font-family 'Open Sans', sans-serif
      font-size 20px
      font-weight 400
      color $color-text-invert
      border 1px solid $color-background
      padding 0px 10px

      &:hover
        background lighten($color-background, 80%)

    i
      color $color-text-invert
      font-size 28px
      cursor pointer

</style>
