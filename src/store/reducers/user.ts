const user = (state = { userInfo: null }, action: any) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        userInfo: action.content
      }
    default:
      return state
  }
}


export default user