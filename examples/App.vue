<template>
  <div id="app">
    <mark-words
      underscoreType="adjunct"
      :sentence="sentence"
      :result="result"
      :wordColors="wordColors"
      @elementClick="elementClick"
    ></mark-words>
    <textarea type="text" readonly v-model="value" />
    <ul>
      <li>
        <p><b>sentence</b>是当前显示的句子</p>
      </li>
      <li>
        <p><b>result</b>是要标注的单词，不同类型的单词对应不同颜色</p>
      </li>
      <li>
        <p><b>wordColors</b>是颜色配置，必须和result中的key一一对应</p>
      </li>
      <li>
        <p><b>underscoreType</b>是特殊类型，用下划线表示</p>
      </li>
      <li>
        <p><b>elementClick</b>是单词点击回调，回调参数为{type, word}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { wordColors } from './constant'
export default {
  data() {
    return {
      sentence: '每套住宅应设卧室、起居室（厅）、厨房和卫生间等基本功能空间',
      result: {
        object: ['住宅', '卧室', '起居室（厅）', '厨房', '卫生间'],
        attr: ['基本功能'],
        attrValue: [],
        relation: ['应设'],
        adjunct: ['卧室、起居室（厅）、厨房和卫生间等']
      },
      wordColors,
      value: ''
    }
  },
  methods: {
    elementClick({ type, word }) {
      // 这里可以做你想做的事情...
      this.value = `类型为 ${type} 的要素 ${word} 被点击了`
    }
  }
}
</script>
<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

textarea {
  width: 300px;
  height: 50px;
  border: none;
  margin-top: 10px;
  font-family: fantasy;
  resize: none;
  &:focus {
    outline: none;
  }
}
</style>
