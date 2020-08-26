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
import {
	setSearchPageNumber,
	setSearchKeyword,
	setSearchLevelOne,
	setSearchLevelTwo,
} from '../../store/actions/searchHistory'
interface IProps {
	userInfo: any,
	levelOneId: number | undefined
	levelTwoId: number | undefined
	currentKeyword: string
	currentPage: number
	setSearchKeyword: Function
	setSearchPageNumber: Function
	setSearchLevelOne: Function
	setSearchLevelTwo: Function
}

interface IState {
	showModal: boolean
	loading: boolean
	totalRow: number
	materailsList: Array<{}>
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
      totalRow: 0,
			materailsList: [],
			showUploadDialog: false
		}
	}

	componentDidMount () {
		this.fetchMaterailsList()
	}

	handleKeywordChange = (e: any) => {
		this.props.setSearchKeyword(e.target.value)
	}

	searchMaterailsList = async () => {
		await this.props.setSearchPageNumber(1)
		this.setState({
			loading: true,
		}, () => this.fetchMaterailsList())
	}

	fetchMaterailsList = () => {
		let params = {
			page_number: this.props.currentPage,
			page_size: 10,
			keyword: this.props.currentKeyword,
			level_one_id: this.props.levelOneId,
			level_two_id: this.props.levelTwoId
		}
		console.log('params', params)
		axios.get('/admin/getMaterailTable', {
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

	handlePageNumberChange = async (val: number) => {
		await this.props.setSearchPageNumber(val)
		this.fetchMaterailsList()
	}

	deleteFile = (uid: number) => {
		Modal.confirm({
			title: '提示：',
			content: '确定要删除吗？',
			onOk: () => {
				this.setState({
					loading: true
				})
				axios.post('/admin/deleteMaterail', {
					uid: uid
				}).then(() => {
					this.setState({
						loading: false
					}, () => this.fetchMaterailsList())
					message.success('文件已删除')
				})
			}
		})
	}

	handleSelectOne = async (e: any) => {
		await this.props.setSearchLevelOne(e ? e : undefined)
		await this.props.setSearchLevelTwo(undefined)
		await this.props.setSearchPageNumber(1)
		this.fetchMaterailsList()
	}

	handleSelectTwo = async (e: any) => {
		await this.props.setSearchLevelTwo(e ? e : undefined)
		await this.props.setSearchPageNumber(1)
		this.fetchMaterailsList()
	}

	saveMaterails = (state: any) => {
		axios.post('/admin/saveMaterails', {
			level_one_id: state.levelOneId,
			level_two_id: state.levelTwoId,
			file_list: state.fileList
		}).then((res: any) => {
			message.success('添加成功')
			this.setState({ showUploadDialog: false }, () => this.fetchMaterailsList())
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
							<a href={record.download_url} rel="noopener noreferrer" target="_blank">
								<DownloadOutlined />
							</a>
							<span style={{ cursor: 'pointer' }} onClick={ () => this.deleteFile(record.uid) }>
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
					this.state.showUploadDialog && <UploadFilesDialog handleOk={ this.saveMaterails } handleCancel={ () => this.setState({ showUploadDialog: false }) } />
				}
				<div className="bracn-board__list">
					<div className="brand-container__header">
						<div className="brand-container__title-row">
							<div className="brand-container_title-left">
								<span>材料列表</span>
								<AntdButton style={{ marginLeft: 15 }} onClick={ () => this.setState({ showUploadDialog: true }) }>上传</AntdButton>
							</div>
							<div className="brand-container_title-right">
								<SelectTree isUpload={ false } levelOneId={ this.props.levelOneId } levelTwoId={ this.props.levelTwoId } handleSelectOne={ this.handleSelectOne } handleSelectTwo={ this.handleSelectTwo } />
								<AntdInput.Search
									placeholder="请输入关键词"
									value={ this.props.currentKeyword }
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
									current: this.props.currentPage,
									total: this.state.totalRow,
									onChange: this.handlePageNumberChange
								}}
								rowKey={(record: any) => record.uid}
							></AntdTable>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

const mapStateToProps = (state: any , ownProps: any) => {
	console.log('state.searchHistory', state.searchHistory)
	return {
		userInfo: state.user.userInfo,
		levelOneId: state.searchHistory.level_one_id,
		levelTwoId: state.searchHistory.level_two_id,
		currentPage: state.searchHistory.page_number,
		currentKeyword: state.searchHistory.keyword
	}
}

const mapDispatchToProps = (dispatch: Function) => {
	return {
		setSearchPageNumber: (pageNumber: number) => setSearchPageNumber(dispatch, pageNumber),
		setSearchKeyword: (keyword: string) => setSearchKeyword(dispatch, keyword),
		setSearchLevelOne: (level: number | undefined) => setSearchLevelOne(dispatch, level),
		setSearchLevelTwo: (level: number | undefined) => setSearchLevelTwo(dispatch, level)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MaterailsList))