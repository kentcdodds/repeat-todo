export {arrayMoveToEnd, arrayRemoveElement}

function arrayMoveToEnd(arr, fromIndex) {
  const element = arr[fromIndex]
  const newArray = [
    ...arrayRemoveElement(arr, fromIndex),
    element,
  ]
  return newArray
}

function arrayRemoveElement(arr, index) {
  return [
    ...arr.slice(0, index),
    ...arr.slice(index + 1, arr.length),
  ]
}

