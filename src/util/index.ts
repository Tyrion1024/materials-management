import { compact } from 'lodash'

export const getBaseUrl = () => {
  interface URL {
    development: string,
    default: string,
    [key: string]: any
  }
  const url: URL = {
    development: 'http://mock.fugetech.com/mock/5bab2b64fda472679e1d397f',
    // development: 'http://byepest-mini-admin.ui.sandbox.fugetech.com/api',
    default: '/api'
  }
  return url[process.env.NODE_ENV] || url.default
}


export const numberWithCommas = (number: any, digit = 0, isDigit = true) => {
  if (number == null) return '—'
  const n = Number(number)
  if (Number.isNaN(n)) {
    return '—'
  }
  return isDigit ? n.toFixed(digit).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : String(n).includes('.') ? String(n).split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + String(n).split('.')[1]
      : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const numberWithPercent = (number: any, digit = 0) => {
  const n = Number(number)
  if (Number.isNaN(n) || number == null) return '—'
  return (n * 100).toFixed(digit).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%'
}

export const formatMoney = (v: any, b = 0) => {
  if (v == null) return '—'
  if (isNaN(Number(v))) return '—'
  const num = Math.abs(Number(v)).toFixed(b).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (v < 0) return '-' + num + '元'
  return num + '元'
}

export const formatDateTime =  (inputTime: Date) => {
  var date = new Date(inputTime)
  var y = date.getFullYear()
  var m: string | number = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d: string | number = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h: string | number = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute: string | number = date.getMinutes()
  var second: string | number = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second
}

export const format4backend = (obj: any) => {
  const pairs: any[] = []

  const handleStringAndNumber = (key: string) => {
    pairs.push(`${key}=${encodeURIComponent(String(obj[key]))}`)
  }

  const handleArray = (key: string) => {
    if (Array.isArray(obj[key][0])) {
      obj[key].forEach((x: any, i: number) => {
        x = compact(x)
        x.forEach((y: any, j: number) => {
          for (const subKey of Object.keys(y)) {
            pairs.push(
              `${key}[${i}][${j}].${subKey}=${encodeURIComponent(y[subKey])}`
            )
          }
        })
      })
      return
    }
    obj[key].forEach((o: any, index: number) => {
      if (o == null) return
      for (const name of Object.keys(o)) {
        pairs.push(`${key}[${index}].${name}=${encodeURIComponent(o[name])}`)
      }
    })
  }

  const handleObj = (key: string) => {
    if (key == null) return
    for (const subKey of Object.keys(obj[key])) {
      if (obj[key][subKey] != null && obj[key][subKey] !== '') pairs.push(`${key}.${subKey}=${encodeURIComponent(obj[key][subKey])}`)
    }
  }

  const handleBoolean = (key: string) => {
    pairs.push(`${key}=${encodeURIComponent((obj[key]))}`)
  }

  for (const key of Object.keys(obj)) {
    switch (true) {
      case typeof obj[key] === 'string' || typeof obj[key] === 'number':
        handleStringAndNumber(key)
        break
      case Array.isArray(obj[key]):
        handleArray(key)
        break
      case typeof obj[key] === 'object':
        handleObj(key)
        break
      case typeof obj[key] === 'boolean':
        handleBoolean(key)
        break
      case typeof obj[key] === 'undefined':
        break
      default:
        throw new Error("utils:obj2Params can't handle key type: " + key)
    }
  }
  return pairs.join('&')
}


export const validateEmail = (email: any) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}



export const validatePhone = (phoneNumber: any) => {
  const re = /^1[3456789]\d{9}$/
  return re.test(String(phoneNumber).toLowerCase())
}