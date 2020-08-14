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
	MaterailsList: Array<{}>
	treeList: Array<{
		id: number
		[key: string]: any
	}>
	oneLevelIndex: number
	twoLevelIndex: number
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
			MaterailsList: [],
			oneLevelIndex: 0,
			twoLevelIndex: 0,
			treeList:[
				{
					id: 0,
					level_name: '全部一级领域'
				},
				{
					id: 1,
					level_name: '蛋白质',
					children: [
						{
							id: 0,
							level_name: '全部蛋白质'
						},
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
							id: 0,
							level_name: '全部蛋黑质'
						},
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
		}
	}

	componentDidMount () {
		this.fetchMaterailsList()
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
				MaterailsList: res.table_data,
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
		this.setState({
			oneLevelIndex: e,
			twoLevelIndex: 0,
			currentPage: 0
		}, () => this.fetchMaterailsList)
	}

	handleSelectTwo = (e: any) => {
		this.setState({
			twoLevelIndex: e,
			currentPage: 0
		}, () => this.fetchMaterailsList)
	}


	render () {
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
							<span onClick={ () => this.deleteFile(record.file_id) }>
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
								<AntdSelect value={ this.state.oneLevelIndex } size="large" onChange={ this.handleSelectOne } placeholder="请选择一级领域">
									{
										this.state.treeList.map((v: any, index: number) => {
											return <AntdSelect.Option value={ index } key={ v.id }> { v.level_name } </AntdSelect.Option>
										})
									}
								</AntdSelect>
								<AntdSelect value={ this.state.oneLevelIndex ? this.state.twoLevelIndex : '请先输入一级领域' } style={{margin: '0 15px'}} size="large" placeholder="请选择二级领域" onChange={ this.handleSelectTwo } disabled={ !this.state.oneLevelIndex }>
									{
										this.state.oneLevelIndex && this.state.treeList[this.state.oneLevelIndex].children.map((v: any, index: number) => {
											return <AntdSelect.Option value={ index } key={ v.id }> { v.level_name } </AntdSelect.Option>
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
								dataSource={ this.state.MaterailsList }
								columns={ columns }
								pagination={{
									total: this.state.totalRow,
									onChange: this.handlePageNumberChange
								}}
								rowKey={
									(record: any) => record.file_id
								}
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