export function debounce(fn, delay, immediate = false, resultCallback) {
  // 1.定义一个定时器，保存上次的定时器
  let timer = null
  let isInvoke = false
  
  // 真正执行的函数
  const _debounce = function(...args) {
    return new Promise((resolve, reject) => {
      // 取消上次定时器
      if(timer) clearTimeout(timer)
      // 判断是否需要立即执行
      if(immediate && !isInvoke) {
        const result = fn.apply(this, args)
        if(resultCallback) resultCallback(result)
        resolve(result)
        isInvoke = true
      } else {
        // 延迟执行
        timer = setTimeout(() => {
          const result = fn.apply(this, args)
          console.log('this对象是===>', this) // 这里的this是undefined
          if(resultCallback) resultCallback(result)
          resolve(result)
          isInvoke = false
          timer = null
        }, delay)
      }
    })
  }
  // 定时器取消功能
  _debounce.cancel = function() {
    if(timer) clearTimeout(timer)
    timer = null
    isInvoke = false
  }
  return _debounce
}