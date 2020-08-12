import React from 'react'
import './index.styl'
import { Spin as AntdSpin } from 'antd'

class Loading extends React.Component {
  render () {
		return (
			<div className="loading_container">
				<AntdSpin tip="loading..."/>
			</div>
		)
  }
}

export default Loading