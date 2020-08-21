<template>
  <div v-if="isRendering" class="mark-box" data-mark="true" @click="proxyHandle">
    <slot></slot>
    <span
      v-for="(text, index) in wordList"
      :key="index"
      :data-word="getWordDataByIndex(index)"
      :class="getWordClass(index)"
      :style="{ backgroundColor: getWordColor(index) }"
      :title="dataWordCache[index] && dataWordCache[index].name"
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
    }
  },
  data() {
    return {
      dataWordCache: [],
      isRendering: true
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
      handler(val) {
        this.isRendering = false
        this.$nextTick(() => {
          this.isRendering = true
        })
      },
      deep: true
    }
  },
  methods: {
    // 遍历所有要素，检查指定索引是否存在匹配的要素
    isHighLight(index, type) {
      return this.result[type].some(item => {
        return this.checkByIndex(index, item)
      })
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
    // 根据位置获取class
    getWordClass(index) {
      const className = []
      const underline = this.result[this.underlineType] && this.result[this.underlineType].some(item => {
        return this.checkByIndex(index, item)
      })
      if (underline) {
        className.push('underline')
      }
      const type = this.getTypeByIndex(index)
      if (type) {
        className.push('pointer')
      }
      return className.join(' ')
    },
    // 查找当前index所属的要素类型
    getTypeByIndex(index) {
      const [type = null] =
        Object.entries(this.result).find(([type, value]) => {
          if (type === this.underlineType) return
          return value.some(item => {
            return this.checkByIndex(index, item)
          })
        }) || []
      return type
    },
    // 根据索引获取要素的背景颜色
    getWordColor(index) {
      const type = this.getTypeByIndex(index)
      if (!type) return ''
      return this.wordColors[type]
    },
    // 根据索引获取其dataword信息
    getWordDataByIndex(index) {
      let obj = null
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
        } else {
          // 其他要素
          newObj = { type, name }
        }
        obj = { ...obj, ...newObj }
        return true
      })
      if (!obj) return
      const oldData = this.dataWordCache[index]
      if (oldData) {
        // 存在老数据就合并
        obj = { ...oldData, ...obj }
      }
      this.dataWordCache[index] = obj
      return JSON.stringify(obj)
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
      const word = this.dataWordCache[index]
      if (!word) return

      // 计算因设置行高而导致的偏移量
      const markBoxDom = getComputedStyle(span.parentNode)
      const fontSize = parseInt(markBoxDom['fontSize'])

      if (e.offsetY > span.offsetTop + fontSize || (!word.type && !word.name)) {
        // 点击的是下划线
        this.$emit('elementClick', {
          type: word.underlineType,
          word: word.underlineName
        })
      } else {
        // 点击的是要素
        this.$emit('elementClick', { type: word.type, word: word.name })
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
      background: #00a4fd;
      cursor: pointer;
    }
  }
}
</style>
