// 文本标注的颜色
export const wordColors = Object.freeze({
  object: '#c7d6fb',
  attr: '#adf3cd',
  relation: '#f7ceb8',
  operate: '#ebee7c',
  attrValue: '#71dbec',
  active: 'red',
  spo: '#cdaaf0',
  spoList: '#cdaaf0',
  temp: '#ffffff',
  bad: '#bdbdbd',
  wait: '#fdbba0',
  reference: 'none',
  adjunct: '#e7e6e6'
})

export const issueLevelOptions = Object.freeze([{
  value: '0',
  label: '强条问题'
}, {
  value: '1',
  label: '1级问题'
}, {
  value: '2',
  label: '2级问题'
}, {
  value: '3',
  label: '3级问题'
}])

export const createMark = () => {
  return {
    object: [],
    attr: [],
    attrValue: [],
    relation: [],
    adjunct: []
  }
}
