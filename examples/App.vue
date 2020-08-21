<template>
  <div id="app">
    <mark-words
      ref="markWords"
      underlineType="adjunct"
      :sentence="sentence"
      :result="result"
      :wordColors="wordColors"
      @elementClick="elementClick"
    ></mark-words>

    <textarea type="text" readonly v-model="value" />
    <div>
      <button @click="getMarkWordsSelection">获取组件当前选中的文本</button>
      <button @click="setMark">设置组件当前选中的文本为新的对象</button>
    </div>

    <table>
      <tr>
        <th>props</th>
        <th>介绍</th>
      </tr>
      <tr>
        <td>sentence</td>
        <td>当前显示的句子</td>
      </tr>
      <tr>
        <td>result</td>
        <td>要标注的单词，不同类型的单词对应不同颜色</td>
      </tr>
      <tr>
        <td>wordColors</td>
        <td>颜色配置，必须和result中的key一一对应</td>
      </tr>
      <tr>
        <td>underlineType</td>
        <td>可选的特殊类型，用下划线表示</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>事件</th>
        <th>介绍</th>
      </tr>
      <tr>
        <td>elementClick</td>
        <td>组件中标注的点击回调，回调参数为 { type, word }</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>方法</th>
        <th>介绍</th>
      </tr>
      <tr>
        <td>getSelection</td>
        <td>该方法能获取组件当前选中的文本，没有则为空字符串</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { wordColors } from './constant'
import { MarkWords } from '../packages'

export default {
  components: {
    MarkWords
  },
  data() {
    return {
      sentence: '每套住宅应设卧室、起居室（厅）、厨房和卫生间等基本功能空间',
      result: {
        object: ['住宅', '卧室'],
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
    },
    getMarkWordsSelection(type) {
      const txt = this.$refs.markWords.getSelection()
      this.value = txt
    },
    setMark() {
      const txt = this.$refs.markWords.getSelection()
      const object = this.result.object
      if (txt && !object.includes(txt)) {
        object.push(txt)
      }
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

  > * {
    display: block;
    margin: 20px auto;
  }
}

textarea {
  width: 300px;
  height: 50px;
  border: none;
  margin-top: 10px;
  background: cyan;
  font-family: fantasy;
  resize: none;
  &:focus {
    outline: none;
  }
}

table {
  width: max-content;
  margin: 20px auto;
  border-collapse: collapse;
  text-align: left;

  th {
    background: #f5f7fa;
  }
  th, td {
    padding: 4px 15px;
    border: 1px solid #ebeef5;
  }
}
</style>
