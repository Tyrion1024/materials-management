import React from 'react'
import SelectTree from '../SelectTree'
import axios from 'axios'
import { Modal, Upload, Button, message } from 'antd'
import './index.styl'
interface IProps {
	handleOk: Function
	handleCancel: Function
}

interface IState {
	fileList: Array<{}>
	levelOneId: number | undefined
	levelTwoId: number | undefined
}

class UploadFileDialog extends React.Component<IProps> {

	public state: IState

	constructor (props: IProps) {
		super(props)
		this.state = {
			fileList: [],
			levelOneId: undefined,
			levelTwoId: undefined
		}
	}

	handleOk = () => {
		if (!this.state.fileList.length) {
			message.error('请上传文件')
			return
		}
 		if (!this.state.levelOneId || !this.state.levelTwoId) {
			message.error('请选择一级分类和二级分类')
			return
		}
		this.props.handleOk(this.state)
	}

	handleCancel = () => {
		this.props.handleCancel()
	}

	handleSelectOne = (e: any) => {
		this.setState({
			levelOneId: e ? e : undefined,
			levelTwoId: undefined
		})
	}

	handleSelectTwo = (e: any) => {
		this.setState({
			levelTwoId: e ? e : undefined
		})
	}


	upload = (info: any) => {
		axios.post('/admin/uploadFiles', info.file).then((res: any) => {
			let fileList = this.state.fileList
			fileList.push(res)
			this.setState({
				fileList: fileList
			})
			message.success(`${info.file.name} file uploaded successfully`)
		}).catch(err => {
			message.error(`${info.file.name} file upload failed.`)
		})
	}


	delFile = (num: number) => {
		this.setState({
			fileList: this.state.fileList.splice(num, 0)
		})
	}

	render () {
		return (
			<Modal
				title="上传材料"
				maskClosable={ false }
				visible={ true }
				onOk={ this.handleOk }
				onCancel={ this.handleCancel }
			>
				<SelectTree isUpload={ true } levelOneId={ this.state.levelOneId } levelTwoId={ this.state.levelTwoId } handleSelectOne={ this.handleSelectOne } handleSelectTwo={ this.handleSelectTwo } />
				<div className="upload_container">
					<Upload
						customRequest={ this.upload }
						showUploadList={ false }
					>
						<Button>上传文件</Button>
					</Upload>
				</div>
				{
					Boolean(this.state.fileList.length) &&
					<div className="file_list">
						{
							this.state.fileList.map((file: any, index: number) => {
								return <div className="file" key={ index } style={{marginBottom: 5}}>
									<a href={ file.download_url }> { file.file_name } </a>
									<Button type="dashed" style={{ marginLeft: 5 }} onClick={ () => this.delFile(index) }> 删除 </Button>
								</div>
							})
						}
					</div>
				}
			</Modal>
		)
	}
}

export default UploadFileDialog