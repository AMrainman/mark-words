<template>
  <div
    class="mark-box"
    data-mark="true"
    ref="markWords"
    @click="proxyHandle"
  >
    <slot></slot>
    <span
      v-for="(text, index) in wordList"
      :key="index"
      :class="dataWordCache[index].class"
      :style="{ backgroundColor: dataWordCache[index].bgColor }"
      :title="dataWordCache[index].title"
    >{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'MarkWords',
  props: {
    sentence: {
      type: String,
      required: true
    },
    result: {
      type: Object,
      required: true
    },
    wordColors: {
      type: Object,
      required: true
    },
    underlineType: {
      type: String,
      default: ''
    },
    aliasType: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dataWordCache: Array(this.sentence.length).fill({}),
      html: ''
    }
  },
  computed: {
    wordList() {
      return this.sentence.split('') || []
    }
  },
  watch: {
    // 深度监听result，变化后更新组件
    result: {
      handler: 'render',
      deep: true,
      immediate: true
    },
    sentence: 'render'
  },
  mounted() {
    // 设置下划线颜色
    if (this.underlineType && this.wordColors[this.underlineType]) {
      this.$refs.markWords.style.setProperty('--underlineColor', this.wordColors[this.underlineType])
    }
  },
  methods: {
    // 重新渲染组件
    render() {
      this.wordList.forEach((word, index) => {
        let obj = {}
        const classNameSet = new Set()

        Object.entries(this.result).forEach(([type, values]) => {
          const name = values.find(item => {
            return this.checkByIndex(index, item)
          })
          if (!name) return
          let newObj
          if (type === this.underlineType) {
            // 定语
            newObj = {
              underlineType: type,
              underlineName: name
            }
            classNameSet.add('underline')
          } else {
            // 其他要素
            newObj = { type, name }
            classNameSet.add('pointer')
          }
          obj = { ...obj, ...newObj }
        })

        if (classNameSet.size) {
          obj.class = [...classNameSet].join(' ')
        }
        if (obj.type) {
          obj.bgColor = this.wordColors[obj.type]
        }
        obj.title = this.getTitle(obj, index)

        this.dataWordCache.splice(index, 1, obj)
      })
      window.getSelection().removeAllRanges()
    },
    // 遍历该索引是否在指定要素item之中  fromIndex为从文本指定位置查找
    checkByIndex(index, item, fromIndex = 0) {
      const currentSentence = this.sentence
      const startIndex = currentSentence.indexOf(item, fromIndex)
      const endIndex = startIndex + item.length - 1
      if (!~startIndex || index < startIndex) return false // 该要素未出现在文本中 || 指定索引小于指定要素  => 都是不存在
      if (index >= startIndex && index <= endIndex) {
        return true
      }
      return this.checkByIndex(index, item, endIndex + 1)
    },
    // 根据index获取title
    getTitle(obj, index) {
      const type = obj.type || obj.underlineType
      const name = obj.name || obj.underlineName
      if (type) {
        if (this.aliasType[type]) {
          return `${this.aliasType[type]}：${name}`
        } else {
          return name
        }
      } else {
        return ''
      }
    },
    // 代理每一个span的点击事件
    proxyHandle(e) {
      const span = e.target
      if (span === e.currentTarget) return // 点到了标注盒子
      let index = Array.prototype.indexOf.call(span.parentNode.children, span) // span在父级中的索引
      if (this.$slots.default) {
        // 存在slot的，计算索引要减去slot的数量
        index -= this.$slots.default.length
      }
      const wordData = this.dataWordCache[index]
      if (!wordData) return

      // 计算因设置行高而导致的偏移量
      const markBoxDom = getComputedStyle(span.parentNode)
      const fontSize = parseInt(markBoxDom['fontSize'])

      if (e.offsetY > span.offsetTop + fontSize) {
        // 点击的是下划线
        this.$emit('elementClick', {
          type: wordData.underlineType,
          word: wordData.underlineName
        })
      } else if (wordData.type && wordData.name) {
        // 点击的是要素
        this.$emit('elementClick', { type: wordData.type, word: wordData.name })
      }
    },
    // 获取选中的文本
    getSelection() {
      const selection = window.getSelection()
      if (!selection || !selection.anchorNode || !selection.anchorNode.parentNode || !selection.anchorNode.parentNode.parentNode) {
        return ''
      }
      const txt = selection.toString()
      const start = selection.anchorNode.parentNode.parentNode.getAttribute('data-mark')
      const end = selection.focusNode.parentNode.parentNode.getAttribute('data-mark')
      if (txt && start && end) {
        // 选取指定文本区域的文字
        return txt
      } else {
        // 选取指定文本区域外的文字
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-box {
  position: relative;
  padding-top: 0 !important; /* mark-box不能设置padding，否则要重新计算高度偏移量 */
  line-height: 40px;
  span {
    white-space: pre;
  }
  .pointer {
    cursor: pointer;
  }
  .underline {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -10px;
      width: 100%;
      height: 5px;
      background: var(--underlineColor, #00a4fd);
      cursor: pointer;
    }
  }
}
</style>
