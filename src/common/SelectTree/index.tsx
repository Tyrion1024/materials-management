import React from 'react'
import { Select as AntdSelect } from 'antd'

type TreeList = Array<{
	id: number | undefined
	[key: string]: any
}>
interface IProps {
	oneLevelId: number | undefined
	twoLevelId: number | undefined
	handleSelectOne: Function
	handleSelectTwo: Function
	isUpload: boolean
}

interface IState {
	treeList: TreeList
	treeListchildren: TreeList
}

class SelectTree extends React.Component<IProps> {
	public state: IState
	constructor (props: IProps) {
		super(props)
		this.state = {
			treeList: [],
			treeListchildren: []
		}
	}

	componentDidMount () {
		let treeList = [
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
		this.setState({
			treeList: this.props.isUpload ? treeList :[{
				id: undefined,
				level_name: '全部一级领域',
			}, ...treeList]
		})
	}

	handleSelectOne = (e: any) => {
		const res = this.state.treeList.find((v: any) => v.id === e)
		this.setState({
			treeListchildren: res && res.children ? res.children : []
		})
		this.props.handleSelectOne(e)
	}

	handleSelectTwo = (e: any) => {
		this.props.handleSelectTwo(e)
	}
	

	render () {
		return (
			<React.Fragment>
				<AntdSelect value={ this.props.oneLevelId } size="large" onChange={ this.handleSelectOne } placeholder="请选择一级领域">
					{
						this.state.treeList.map((v: any, index: number) => {
							return <AntdSelect.Option value={ v.id  } key={ index }> { v.level_name } </AntdSelect.Option>
						})
					}
				</AntdSelect>
				<AntdSelect value={ this.props.oneLevelId ? this.props.twoLevelId : '请先输入一级领域' } style={{margin: '0 15px'}} size="large" placeholder="请选择二级领域" onChange={ this.handleSelectTwo } disabled={ !this.state.treeListchildren.length }>
					{
						!this.props.isUpload && <AntdSelect.Option value={ 0 } key={ -1 }> 全部二级领域 </AntdSelect.Option>
					}
					{
						this.state.treeListchildren.map((v: any, index: number) => {
							return <AntdSelect.Option value={ v.id  } key={ index }> { v.level_name } </AntdSelect.Option>
						})
					}
				</AntdSelect>
			</React.Fragment>
		)
	}

}


export default SelectTree