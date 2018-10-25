import Vue from 'vue'

Vue.filter('money', function(value){
  if(value != null){
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  } else {
    return value;
  }
})
