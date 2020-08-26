import Mock from 'mockjs'
import { formatDateTime } from './util'
// import { cloneDeep } from 'lodash'

const domain = 'http://mock.fugetech.com/mock/5bab2b64fda472679e1d397f'

let materailStorage = localStorage.getItem('materailList')
let materailList: Array<{}> = materailStorage ? JSON.parse(materailStorage) : []

const treeList = [
	{
		id: 1,
		level_name: '蛋白质',
		children: [
			{
				id: 11,
				level_name: '蛋白质生物生物1'
			},
			{
				id: 12,
				level_name: '蛋白质生物生物2'
			},
			{
				id: 13,
				level_name: '蛋白质生物生物3'
			},
			{
				id: 14,
				level_name: '蛋白质生物生物4'
			}
		]
	},
	{
		id: 2,
		level_name: '蛋黑质',
		children: [
			{
				id: 21,
				level_name: '蛋黑质生物生物1'
			},
			{
				id: 22,
				level_name: '蛋黑质生物生物2'
			},
			{
				id: 23,
				level_name: '蛋黑质生物生物3'
			},
			{
				id: 24,
				level_name: '蛋黑质生物生物4'
			}
		]
	}
]


interface Options {
  body: any
  url: string
  type: string
}

const GetParams = (url: string) => {
  interface Res {
    [key: string]: any
  }
  let result:Res = {}
  let name, value
  let str = url
  let num = str.indexOf('?')
  str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]

  let arr = str.split('&') // 各个参数放到数组里
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=')
    if (num > 0) {
      name = arr[i].substring(0, num)
      value = arr[i].substr(num + 1)
      result[name] = value
    }
  }
  return result
}

Mock.mock(RegExp(`${domain}/admin/getMaterailTable.*`), 'get', (options: Options) => {
  let obj = {
    params: GetParams(options.url),
    body: options.body ? JSON.parse(options.body).body : {}
	}
	obj.params.page_size = Number(obj.params.page_size)
	obj.params.page_number = Number(obj.params.page_number)
  return {
    'msg': '',
    'code': 1,
    'data': {
      table_data: materailList.slice(obj.params.page_size * (obj.params.page_number - 1), obj.params.page_size),
			total_page: Math.ceil(materailList.length / obj.params.page_size),
			total_row: materailList.length,
			page_number: obj.params.page_number,
			page_size: obj.params.page_size
    },
    'module': ''
  }
})

Mock.mock(RegExp(`${domain}/admin/getLvelTreeList.*`), 'get', (options: Options) => {
	return {
    'msg': '',
    'code': 1,
    'data': treeList,
    'module': ''
  }
})

Mock.mock(RegExp(`${domain}/admin/uploadFiles.*`), 'post', (options: Options) => {
  let obj = {
    params: GetParams(options.url),
    body: options.body
	}
  return {
    'msg': '',
    'code': 1,
    'data': {
			download_url: `${domain}/static/files/${obj.body.name}`,
			file_name: obj.body.name,
			uid: obj.body.uid
		},
    'module': ''
  }
})

Mock.mock(RegExp(`${domain}/admin/saveMaterails.*`), 'post', (options: Options) => {
  let obj = {
    params: GetParams(options.url),
    body: options.body ? JSON.parse(options.body) : {}
	}
	const result = obj.body.file_list.map((file: any) => {
		file.one_level_id = obj.body.one_level_id
		file.two_level_id = obj.body.two_level_id
		const v1 = treeList.find(l => l.id === file.one_level_id)
		if (v1) {
			file.level_one_name = v1.level_name
			const v2 = v1.children.find(l => l.id === file.two_level_id)
			if (v2) {
				file.level_two_name = v2.level_name
			}
		}
		file.create_date = formatDateTime(new Date())
		file.opearitor = 'a多多。'
		return file
	})
	materailList.unshift(...result)
	localStorage.setItem('materailList',JSON.stringify(materailList))
  return {
    'msg': '',
    'code': 1,
    'data': null,
    'module': ''
  }
})

Mock.mock(RegExp(`${domain}/admin/deleteMaterail.*`), 'post', (options: Options) => {
  let obj = {
    params: GetParams(options.url),
    body: options.body ? JSON.parse(options.body) : {}
	}
	materailList = materailList.filter((file: any) => file.uid !== obj.body.uid)
	localStorage.setItem('materailList',JSON.stringify(materailList))
	return {
    'msg': '',
    'code': 1,
    'data': null,
    'module': ''
  }
})

Mock.mock(RegExp(`${domain}/signin.*`), 'post', (options: Options) => {
  return {
    'msg': '',
    'code': 1,
    'data': {
			is_authed: true,
      user: {
        cid: "7abb6f82-b464-11ea-858e-0017fa00daf6",
        create_date: "2020-08-06 11:59:56",
        inviter_user_id: 3,
        inviter_user_name: "root",
        is_admin: 1,
        last_login_date: null,
        logo_path: "https://wx.qlogo.cn/mmopen/vi_32/b2Y8CvL2EIJoeYdH4T2DO0LRTticqehKadExAGrqiblk3ZKN3S0qzgG7ebniagh92LcucggBaQ1EIueq8S2OMxLGA/132",
        mail: null,
        mobile_phone: "15779316577",
        redirect_url: "/index",
        region: null,
        share_code: "EQDZaEoZ",
        signatures_status: 0,
        update_date: "2020-08-12 10:26:52",
        user_id: 156,
        user_name: "a多多。",
        version_type: 1,
        wechat_auth_status: 1,
        wechat_id: null,
        wechat_open_id: null
      }
    },
    'module': ''
  }
})

Mock.mock(RegExp(`${domain}/signout.*`), 'get', (options: Options) => {
  return {
    'msg': 'signout success',
    'code': 1,
    'data': null,
    'module': ''
  }
})