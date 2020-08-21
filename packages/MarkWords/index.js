import MarkWords from './src/MarkWords.vue'

MarkWords.install = Vue => {
  Vue.components(MarkWords.name, MarkWords)
}

export default MarkWords
