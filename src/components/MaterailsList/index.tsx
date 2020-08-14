import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Input as AntdInput, Table as AntdTable, Space as AntdSpace,Select as AntdSelect, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'
import Loading from '../../common/Loading'
import './index.styl'
interface IProps {
  userInfo: any
}

interface IState {
	showModal: boolean
	loading: boolean
	currentKeyword: string
	currentPage: number
	totalRow: number
	materailsList: Array<{}>
	treeList: Array<{
		id: number | undefined
		[key: string]: any
	}>
	treeListchildren: Array<{}>
	oneLevelId: number | undefined
	twoLevelId: number | undefined
}
type propsType = RouteComponentProps & IProps

class MaterailsList extends React.Component<propsType> {

	public state: IState

	constructor (props: propsType) {
		super(props)
		this.state = {
			showModal: false,
			loading: false,
      currentKeyword: '',
      currentPage: 1,
      totalRow: 0,
			materailsList: [],
			oneLevelId: undefined,
			twoLevelId: undefined,
			treeList:[
				{
					id: undefined,
					level_name: '全部一级领域',
				},
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
			],
			treeListchildren: []
		}
	}

	componentDidMount () {
		// this.fetchMaterailsList()
	}

	handleKeywordChange = (e: any) => {
		this.setState({
			currentKeyword: e.target.value
		})
	}

	searchMaterailsList = () => {
		this.setState({
			loading: true,
			currentPage: 1
		}, () => this.fetchMaterailsList())
	}

	fetchMaterailsList = () => {
		let params = {
			page_number: this.state.currentPage,
			page_size: 10,
			keyword: this.state.currentKeyword
		}
		axios.get('/admin/getWithdrawTable', {
			params
		}).then((res: any) => {
			this.setState({
				loading: false,
				materailsList: res.table_data,
				totalRow: res.total_row
			})
		})
		.catch(err => {
			this.setState({
				loading: false
			})
			throw new Error(err)
		})
	}

	handlePageNumberChange = (val: number) => {
		this.setState({
			currentPage: val
		}, () => this.fetchMaterailsList())
	}

	deleteFile = (id: number) => {
		Modal.confirm({
			title: '提示：',
			content: '确定要删除吗？',
			onOk: () => {
				message.error('文件已删除')
			}
		})
	}

	handleSelectOne = (e: any) => {
		console.log('handleSelectOne', e)
		this.setState({
			oneLevelId: e ? e : undefined,
			twoLevelId: undefined,
			currentPage: 0,
			treeListchildren: e ? this.state.treeList[e].children : []
		}, () => this.fetchMaterailsList)
	}

	handleSelectTwo = (e: any) => {
		console.log('handleSelectTwo', e)
		this.setState({
			twoLevelId: e ? e : undefined,
			currentPage: 0
		}, () => this.fetchMaterailsList)
	}


	render () {
		// console.log(this.state.materailsList)
		const columns = [
			{
				title: '一级分类',
				dataIndex: 'level_one_name',
				key: 'level_one_name'
			},
			{
				title: '二级分类',
				dataIndex: 'level_two_name',
				key: 'level_two_name'
			},
			{
				title: '文件名',
				dataIndex: 'file_name',
				key: 'file_name'
			},
			{
				title: '操作人',
				dataIndex: 'opearitor',
				key: 'opearitor'
			},
			{
				title: '上传时间',
				dataIndex: 'create_date',
				key: 'create_date'
			},
			{
				title: '操作',
				key: 'status',
				dataIndex: 'status',
				render: (status: number, record: any) => {
					return (
						<AntdSpace size="middle">
							<a href={record.file_download_path} rel="noopener noreferrer" target="_blank">
								<DownloadOutlined />
							</a>
							<span style={{ cursor: 'pointer' }} onClick={ () => this.deleteFile(record.file_id) }>
								<DeleteOutlined />
							</span>
						</AntdSpace>
					)
				}
			}
		]
		return (
			<div className="brand-board">
				{
					this.state.loading && <Loading />
				}
				<div className="bracn-board__list">
					<div className="brand-container__header">
						<div className="brand-container__title-row">
							<div className="brand-container_title-left">
								<span>材料列表</span>
							</div>
							<div className="brand-container_title-right">
								<AntdSelect value={ this.state.oneLevelId } size="large" onChange={ this.handleSelectOne } placeholder="请选择一级领域">
									{
										this.state.treeList.map((v: any) => {
											return <AntdSelect.Option value={ v.id  } key={ v.id }> { v.level_name } </AntdSelect.Option>
										})
									}
								</AntdSelect>
								<AntdSelect value={ this.state.oneLevelId ? this.state.twoLevelId : '请先输入一级领域' } style={{margin: '0 15px'}} size="large" placeholder="请选择二级领域" onChange={ this.handleSelectTwo } disabled={ !this.state.treeListchildren.length }>
									<AntdSelect.Option value={ 0 }> 全部二级领域 </AntdSelect.Option>
									{
										this.state.treeListchildren.map((v: any) => {
											return <AntdSelect.Option value={ v.id  } key={ v.id }> { v.level_name } </AntdSelect.Option>
										})
									}
								</AntdSelect>
								<AntdInput.Search
									placeholder="请输入关键词"
									value={ this.state.currentKeyword }
									size="large"
									onChange={ this.handleKeywordChange }
									onSearch={ this.searchMaterailsList }
									allowClear
								/>
							</div>
						</div>
					</div>
					<div className="MaterailsList-content">
						<div id="MaterailsList-content__row">
							<AntdTable
								dataSource={ this.state.materailsList }
								columns={ columns }
								pagination={{
									total: this.state.totalRow,
									onChange: this.handlePageNumberChange
								}}
								rowKey={(record: any) => record.user_id}
							></AntdTable>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

const mapStateToProps = (state: any , ownProps: any) => {
	return {
		userInfo: state.user.userInfo
	}
}
export default withRouter(connect(mapStateToProps)(MaterailsList))