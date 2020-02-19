const PATTER = /^((20\d\d) (([1-5]\d)|(\d))-(([1-5]\d)|(\d)))$|^((20\d\d) (([1-5]\d)|(\d)))$|^((([1-5]\d)|(\d))-(([1-5]\d)|(\d)))$|^(([1-5]\d)|(\d))$/

export default function (value) {
  let groups = PATTER.exec(value)
  if (groups) {
    if (groups[1]) {
      return {
        year: parseInt(groups[2]),
        startWeek: parseInt(groups[3]),
        endWeek: parseInt(groups[6])
      }
    } else if (groups[9]) {
      return {
        year: parseInt(groups[10]),
        startWeek: parseInt(groups[11]),
        endWeek: parseInt(groups[11])
      }
    } else if (groups[14]) {
      return {
        year: new Date().getFullYear(),
        startWeek: parseInt(groups[15]),
        endWeek: parseInt(groups[18])
      }
    } else if (groups[21]) {
      return {
        year: new Date().getFullYear(),
        startWeek: parseInt(groups[21]),
        endWeek: parseInt(groups[21])
      }
    }
  }
  return null
}
