import React from 'react'
import { Select as AntdSelect } from 'antd'
import axios from 'axios'

type TreeList = Array<{
	id: number | undefined
	[key: string]: any
}>
interface IProps {
	levelOneId: number | undefined
	levelTwoId: number | undefined
	handleSelectOne: Function
	handleSelectTwo: Function
	isUpload: boolean
}

interface IState {
	treeList: TreeList
}

class SelectTree extends React.Component<IProps> {
	public state: IState
	constructor (props: IProps) {
		super(props)
		this.state = {
			treeList: []
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
		this.props.handleSelectOne(e)
	}

	treeListchildren = (): TreeList => {
		if (this.props.levelOneId) {
			const res = this.state.treeList.find((v: any) => v.id === this.props.levelOneId)
			return res && res.children ? res.children : []
		} else {
			return []
		}
	}

	handleSelectTwo = (e: any) => {
		this.props.handleSelectTwo(e)
	}
	

	render () {
		return (
			<React.Fragment>
				<AntdSelect value={ this.props.levelOneId } size="large" onChange={ this.handleSelectOne } placeholder="请选择一级分类">
					{
						this.state.treeList.map((v: any, index: number) => {
							return <AntdSelect.Option value={ v.id  } key={ index }> { v.level_name } </AntdSelect.Option>
						})
					}
				</AntdSelect>
				<AntdSelect value={ this.props.levelOneId ? this.props.levelTwoId : '请先选择一级分类' } style={{margin: '0 15px'}} size="large" placeholder="请选择二级分类" onChange={ this.handleSelectTwo } disabled={ !this.treeListchildren().length }>
					{
						!this.props.isUpload && <AntdSelect.Option value={ 0 } key={ -1 }> 全部二级分类 </AntdSelect.Option>
					}
					{
						this.treeListchildren().map((v: any, index: number) => {
							return <AntdSelect.Option value={ v.id  } key={ index }> { v.level_name } </AntdSelect.Option>
						})
					}
				</AntdSelect>
			</React.Fragment>
		)
	}

}


export default SelectTree