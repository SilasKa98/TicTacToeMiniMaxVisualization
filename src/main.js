import Vue from 'vue'
import App from './App.vue'
import tttVisualization from './tttVisualization';
import playCell from './playCell';


Vue.component('ttt-visualization', tttVisualization);
Vue.component('play-cell', playCell);

new Vue({
  el: '#app',
  render: h => h(App)
});
