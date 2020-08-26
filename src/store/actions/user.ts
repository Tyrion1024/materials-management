export const setUserInfo = (dispatch: Function, userInfo: any) => {
	dispatch({
		type: 'SET_USER_INFO',
		content: userInfo
	})
	return Promise.resolve()
}
