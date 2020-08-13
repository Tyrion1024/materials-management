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
      MaterailsList: []
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
				title: '发起时间',
				dataIndex: 'create_date',
				key: 'create_date',
				render: (val: string) => val.replace(/-/g, '/')
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
								<AntdSelect>
									
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