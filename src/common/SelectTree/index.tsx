import React from 'react'
import { Select as AntdSelect } from 'antd'
import axios from 'axios'

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

	async componentDidMount () {
		let treeList: TreeList = await axios.get('/admin/getLvelTreeList')
		this.setState({
			treeList: this.props.isUpload ? treeList :[{
				id: undefined,
				level_name: '全部一级分类',
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
				<AntdSelect value={ this.props.oneLevelId } size="large" onChange={ this.handleSelectOne } placeholder="请选择一级分类">
					{
						this.state.treeList.map((v: any, index: number) => {
							return <AntdSelect.Option value={ v.id  } key={ index }> { v.level_name } </AntdSelect.Option>
						})
					}
				</AntdSelect>
				<AntdSelect value={ this.props.oneLevelId ? this.props.twoLevelId : '请先选择一级分类' } style={{margin: '0 15px'}} size="large" placeholder="请选择二级分类" onChange={ this.handleSelectTwo } disabled={ !this.state.treeListchildren.length }>
					{
						!this.props.isUpload && <AntdSelect.Option value={ 0 } key={ -1 }> 全部二级分类 </AntdSelect.Option>
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