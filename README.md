# mark-words

> 这是一个简单的vue词语标注组件

## Build Setup

```bash
# clone the project
git clone https://github.com/AMrainman/mark-words

# enter the project directory
cd mark-words

# install dependency
npm install

# develop
npm run serve
```

## use

main.js

```bash
import markWords from 'mark-words'

Vue.use(markWords)
```

component

```bash
<template>
  <mark-words :sentence="sentence" :result="result" :wordColors="wordColors" @elementClick="elementClick"></mark-words>
</template>
<script>
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
      wordColors
    }
  },
  methods: {
    elementClick({ type, word }) {
      // 这里可以做你想做的事情...
    }
  }
}
</script>
```

## props

- sentence：当前显示的句子

- result：要标注的单词，不同类型的单词对应不同颜色，格式：{ [proppName: string]: array }

- wordColors：颜色配置，必须和result中的key一一对应

- underlineType：特殊类型，用下划线表示（点击事件也是下划线）

- elementClick：单词点击回调，回调参数为{type, word}

## License

[MIT](https://github.com/AMrainman/mark-words/master/LICENSE) license.

Copyright (c) 2020-present mwgeng
