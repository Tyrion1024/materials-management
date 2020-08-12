import React from 'react'
import {  Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import MaterailsList from '../MaterailsList'
import Loading from '../../common/Loading'
import logo from '../../assets/logo.png'
import userLogo from '../../assets/user-logo.png'
import './index.styl'
import { Tabs, Menu, Dropdown } from 'antd'
import { setUserInfo } from '../../store/actions/user'

const { TabPane } = Tabs

interface IProps {
  userInfo: any
  setUserInfo: Function
}

type propsType = RouteComponentProps & IProps

class Layout extends React.Component<propsType> {

  public state: any

  componentDidMount () {
    if (!this.props.userInfo) {
      this.props.history.push('/login')
    }
  }

  tabChange = (routeName: string) => {
    if (routeName === '/user-info') {
      routeName = '/user-list'
    }
    this.props.history.push(routeName)
  }

  signOut = () => {
    axios.get('/signout').then(res => {
      this.props.setUserInfo(null)
      this.props.history.replace('/login')
    })
  }

  render () {
    return (
      <div className="layout">
        {
          this.props.userInfo ?
          <div className="main">
            <div className="main__header">
              <div className="main__header-left">
                <img src={ logo } alt="logo.png"/>
                <div className="main__divid"></div>
                <Tabs defaultActiveKey="/materails-list" activeKey="/materails-list" className="el-tabs">
                  <TabPane tab={
                    <span>
                      材料管理
                    </span>
                  } key="/materails-list" className="el-tabs__item" />
                </Tabs>
              </div>
              <div className="main__header-right">
                <div className="main__divid"></div>
                <div className="main__account">
                  <Dropdown overlay={
                    <Menu>
                      <Menu.Item onClick={ this.signOut }>
                        退出
                      </Menu.Item>
                    </Menu>
                  }>
                    <div className="el-dropdown-link">
                      <div className="main__avatar">
                        <div className="main__logo__img">
                          {
                            this.props.userInfo.logo_url ?
                            <img src={ this.props.userInfo.logo_url } alt="logo_url" /> :
                            <img src={ userLogo } alt="logo_url" />
                          }
                        </div>
                      </div>
                      <span className="main__account_username">
                        { this.props.userInfo.user_name }
                      </span>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="main__layout">
              <Switch>
                <Redirect exact from="/" to="/materails-list"></Redirect>
                <Route path="/materails-list" component={ MaterailsList }></Route>
              </Switch>
            </div>
          </div> :
          <Loading />
        }
      </div>
    )
  }
}


const mapStateToProps = (state: any, ownProps: any) => {
  return {
    userInfo: state.user.userInfo
  }
}

const mapDispatchToProps = (dispatch: Function, ownProps: any) => {
  return {
    setUserInfo: (obj: any) => setUserInfo(dispatch, obj)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout) as any)