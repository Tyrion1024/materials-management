import React from 'react'
import SelectTree from '../SelectTree'
import { Modal, Upload, Button, message } from 'antd'
import './index.styl'
interface IProps {
	handleOk: Function
	handleCancel: Function
}

interface IState {
	fileList: Array<{}>
	oneLevelId: number | undefined
	twoLevelId: number | undefined
}

class UploadFileDialog extends React.Component<IProps> {

	public state: IState

	constructor (props: IProps) {
		super(props)
		this.state = {
			fileList: [],
			oneLevelId: undefined,
			twoLevelId: undefined
		}
	}

	handleOk = () => {
		console.log(this.state)
		this.props.handleOk()
	}

	handleCancel = () => {
		this.props.handleCancel()
	}

	handleSelectOne = (e: any) => {
		this.setState({
			oneLevelId: e ? e : undefined,
			twoLevelId: undefined
		})
	}

	handleSelectTwo = (e: any) => {
		this.setState({
			twoLevelId: e ? e : undefined
		})
	}


	upload = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
	}

	render () {
		return (
			<Modal
				title="上传材料"
				visible={ true }
				onOk={ this.handleOk }
				onCancel={ this.handleCancel }
			>
				<SelectTree isUpload={ true } oneLevelId={ this.state.oneLevelId } twoLevelId={ this.state.twoLevelId } handleSelectOne={ this.handleSelectOne } handleSelectTwo={ this.handleSelectTwo } />
				<div className="upload_container">
					<Upload
						name='file'
						action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
						headers={ {authorization: 'authorization-text'} }
						onChange={ this.upload }
					>
						<Button>上传文件</Button>
					</Upload>
				</div>
			</Modal>
		)
	}
}

export default UploadFileDialog