import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Input as AntdInput, Button as AntdButton, message as AntdMessage } from 'antd'
import { setUserInfo } from '../../store/actions/user'
import imgUrl from './assets/login_title.png'
import Loading from '../../common/Loading'
import { format4backend, validatePhone } from '../../util'
import './index.styl'

interface LoginState {
	account: string
	password: string
	loading: boolean
	isDisabled: boolean
  buttonName: string
  interval: any
}

interface IProps {
  userInfo: any
  setUserInfo: (userInfo: any) => void
}

type propsType = RouteComponentProps & IProps

class Login extends React.Component<propsType> {

	public state: LoginState

  constructor (props: propsType) {
    super(props)
    this.state = {
      account: '',
      password: '',
      loading: false,
			isDisabled: false,
      buttonName: 'getCode',
      interval: null
    }
	}

  componentWillUnmount () {
    if (this.state.interval) {
      clearInterval(this.state.interval)
    }
  }

	handleAccountChange = (e: any) => {
		this.setState({
			account: e.target.value
		})
	}

	handlePasswordChange =  (e: any) => {
		this.setState({
			password: e.target.value
		})
	}

	onKeydown = (e: any) => {
    if (e.keyCode !== 13) {
      e.stopPropagation()
    }
  }

	validateInfo = (): boolean => {
    if (this.state.loading) return false
    if (this.state.account === '' || this.state.password === '') {
      AntdMessage.error('请输入手机号')
      return false
    }
    if (this.state.password === '') {
      AntdMessage.error('请输入验证码')
      return false
    }
    return true
  }

  getCode = () => {
    if (!validatePhone(this.state.account)) {
      AntdMessage.error('Please enter correct phone number')
      return
		}
		this.setState({
			isDisabled: true
		})
    axios.get('/sendVerificationCode', {
      params: {
        mobile_phone: this.state.account
      }
    })
      .then((res: any) => {
        if(res && res.code === 10100) {
					this.setState({
						isDisabled: false
					})
          return
        }
        let time = 59
        let interval = setInterval(() => {
          this.setState({
						buttonName: '（' + time + 's) Resend'
					})
          time--
          if (time < 0) {
						this.setState({
							buttonName: 'Resend',
              isDisabled: false,
              interval: null
						})
            time = 59
            clearInterval(interval)
          }
        }, 1000)
        this.setState({
          interval: interval
        })
      })
  }

  login = () => {
    if (!this.validateInfo()) {
      return
    }
		this.setState({
			loading: true
		})
    axios
      .post(
        '/signinForPhone',
        format4backend({
          username: this.state.account,
          password: this.state.password,
          is_admin: 1,
          return_type: 'json'
        })
      )
      .then((data: any) => {
				this.setState({
					loading: false
				}, () => {
          if (data && data.is_authed) {
            data.user.redirect_url = data.redirect_url
            this.props.setUserInfo(data.user)
            AntdMessage.success('登陆成功')
            this.props.history.push('/')
          } else {
            AntdMessage.error('您没有登陆权限，请联系管理员。')
          }
        })
      })
      .catch((error: any) => {
				this.setState({
					loading: false
				})
        AntdMessage.error(error.message)
      })
  }

  render = () => {
		const GetCodeBtn = () => {
			return <AntdButton disabled={ this.state.isDisabled } type="link" onClick={ this.getCode }> { this.state.buttonName } </AntdButton>
		}
    return (
      <div className="login">
				{
					this.state.loading && <Loading />
				}
        <div className="login-container">
					<div className="login__card__bg"></div>
					<div className="login__content">
						<div className="login__logo">
							<img src={ imgUrl } alt="login__logo" />
						</div>
						<div className="login__form">
							<div className="login__account">
								<AntdInput onPressEnter={ this.onKeydown } value={ this.state.account } size="large" addonBefore="+86" placeholder="Enter Phone Number" onChange={ this.handleAccountChange }/>
							</div>
							<div className="login__password">
								<AntdInput onPressEnter={ this.onKeydown } value={ this.state.password } size="large" placeholder="Enter Verification Code" addonAfter={ <GetCodeBtn /> } onChange={ this.handlePasswordChange } />
							</div>
							<div className="login__button" onClick={ this.login }> Login </div>
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
  
const mapDispatchToProps = (dispatch: any , ownProps: any) => {
  return {
    setUserInfo: (userInfo: any) => setUserInfo(dispatch, userInfo)
  }
}



export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))