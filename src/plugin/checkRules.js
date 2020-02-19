import parseStrToWeekObj from './weekUtils'
export function checkIsNum (rule, value, callback) {
  if (!Number.isInteger(value)) {
    callback(new Error('请输入数字值'))
  } else {
    callback()
  }
}

export function checkIsLine (rule, value, callback) {
  let weekObj = parseStrToWeekObj(value)
  let msg = ''
  if (!weekObj) {
    msg = '格式不正确'
  } else {
    var weeks = 52
    if (weeks < weekObj.endWeek) {
      msg = '不应该超过周期范围'
    } else if (weekObj.startWeek > weekObj.endWeek) {
      msg = '开始周期不应该小于结束周期'
    }
  }
  if (msg) {
    callback(new Error(msg))
  } else {
    callback()
  }
}
