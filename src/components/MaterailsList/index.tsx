import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Input as AntdInput, Table as AntdTable, Space as AntdSpace, message, Modal, Button as AntdButton } from 'antd'
import { connect } from 'react-redux'
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'
import Loading from '../../common/Loading'
import SelectTree from '../../common/SelectTree'
import './index.styl'
import UploadFilesDialog from '../../common/UploadFilesDialog'
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
	oneLevelId: number | undefined
	twoLevelId: number | undefined
	showUploadDialog: boolean
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
			showUploadDialog: false
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
				materailsList: res.table_data,
				totalRow: res.total_row
			})
		})
		.catch(err => {
			this.setState({
				loading: false
			})
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
			oneLevelId: e ? e : undefined,
			twoLevelId: undefined,
			currentPage: 0
		}, () => this.fetchMaterailsList())
	}

	handleSelectTwo = (e: any) => {
		this.setState({
			twoLevelId: e ? e : undefined,
			currentPage: 0
		}, () => this.fetchMaterailsList())
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
				{
					this.state.showUploadDialog && <UploadFilesDialog handleOk={ () => this.setState({ showUploadDialog: false }) } handleCancel={ () => this.setState({ showUploadDialog: false }) } />
				}
				<div className="bracn-board__list">
					<div className="brand-container__header">
						<div className="brand-container__title-row">
							<div className="brand-container_title-left">
								<span>材料列表</span>
								<AntdButton style={{ marginLeft: 15 }} onClick={ () => this.setState({ showUploadDialog: true }) }>上传</AntdButton>
							</div>
							<div className="brand-container_title-right">
								<SelectTree isUpload={ false } oneLevelId={ this.state.oneLevelId } twoLevelId={ this.state.twoLevelId } handleSelectOne={ this.handleSelectOne } handleSelectTwo={ this.handleSelectTwo } />
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