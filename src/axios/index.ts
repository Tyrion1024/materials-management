import axios from 'axios'
import { message } from 'antd'
import { store } from '../store'
import { getBaseUrl } from '../util'
// import db from '../db'
Object.assign(axios.defaults, {
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
})

interface CodeMsg {
    default: string,
    500: string,
    504: string,
    [key: number]: any,
    [key: string]: any
}
const codeMsg:CodeMsg  = {
  default: '未知网络错误，请稍后重试',
  500: '服务端出错，请稍后重试',
  504: '连接超时，请稍后重试'
}

axios.interceptors.response.use(
  res => {
    const resData = res.data
    if (resData.code === 1) {
      return resData.data
    } else {
      message.error(resData.msg)
      if (resData.code === 10100 || resData.code === 10400 || resData.code === 10010) {
        return res.data
      } else {
        return Promise.reject(new Error(resData.msg))
      }
    }
  },
  err => {
    const code = err.response.status
    if (code === 401) {
      store.dispatch({
        type: 'SET_USER_INFO',
        content: null
      })
      window.location.href = '/login'
      //   db.from_url = window.location.href
      return
    }
    message.error(codeMsg[code] || codeMsg.default)
    throw new Error(err)
  }
)