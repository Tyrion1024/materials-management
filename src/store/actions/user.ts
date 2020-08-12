export const setUserInfo = (dispatch: Function, userInfo: any) => {
  return dispatch({
    type: 'SET_USER_INFO',
    content: userInfo
  })
}
