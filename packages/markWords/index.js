import markWords from './src/markWords.vue'
markWords.install = Vue => {
  Vue.components(markWords.name, markWords)
}
export default markWords
