import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Input as AntdInput, Table as AntdTable, Space as AntdSpace, Button as AntdButton } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import Loading from '../../common/Loading'
import './index.styl'
import { formatMoney } from '../../util'
interface IProps {
  userInfo: any
}

interface IState {
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

	handleDeliverMoney = (record: any, val: number) => {
		this.setState({
			loading: true
		})
		axios.get('/admin/updateWithdrawStatus', {
			params: {
				withdraw_action_id: record.withdraw_action_id,
				status: val
			}
		}).then(res => {
			this.fetchMaterailsList()
		})
	}

	viewDetails = (record: any) => {
		this.props.history.push({
			pathname: '/user-info',
			state: {
				from: '提现列表',
				user_id: record.user_id
			}
		})
	}

	render () {
		const columns = [
			{
				title: '用户ID',
				dataIndex: 'user_id',
				key: 'user_id'
			},
			{
				title: '用户昵称',
				dataIndex: 'user_name',
				key: 'user_name'
			},
			{
				title: '发起时间',
				dataIndex: 'create_date',
				key: 'create_date',
				render: (val: string) => val.replace(/-/g, '/')
			},
			{
				title: '真实姓名',
				dataIndex: 'real_user_name',
				key: 'real_user_name'
			},
			{
				title: '绑定手机号',
				dataIndex: 'phone',
				key: 'phone'
			},
			{
				title: '银行卡号',
				dataIndex: 'card_number',
				key: 'card_number'
			},
			{
				title: '身份证号',
				dataIndex: 'id_number',
				key: 'id_number'
			},
			{
				title: '提现金额',
				dataIndex: 'amount',
				key: 'amount',
				render: (val: number): string => formatMoney(val)
			},
			{
				title: '操作',
				key: 'status',
				dataIndex: 'status',
				render: (status: number, record: any) => {
					if (status) {
						switch (status) {
							case 0:
								return <span>待发放</span>
							case 1:
								return <span>发放成功</span>
							case 2:
								return <span>发放失败</span>
						}
					} else {
						return (
							<AntdSpace size="middle">
								<AntdButton type="primary" onClick={ () => this.handleDeliverMoney(record, 1) }> 发放成功 </AntdButton>
								<AntdButton type="dashed" onClick={ () => this.handleDeliverMoney(record, 2) }> 发放失败 </AntdButton>
								<AntdButton type="link" onClick={ () => this.viewDetails(record) }> 查看详情 </AntdButton>
							</AntdSpace>
						)
					}
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
								<span>提现列表</span>
							</div>
							<div className="brand-container_title-right">
								<AntdInput.Search
									placeholder="搜索用户ID、昵称、绑定手机号、真实姓名"
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
									(record: any) => record.user_id
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