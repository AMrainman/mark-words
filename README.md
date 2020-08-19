# 这是一个简单的vue词语标注组件

## props介绍

### sentence是当前显示的句子

### result是要标注的单词，不同类型的单词对应不同颜色

### wordColors是颜色配置，必须和result中的key一一对应

### underlineType是特殊类型，用下划线表示

### elementClick是单词点击回调，回调参数为{type, word}