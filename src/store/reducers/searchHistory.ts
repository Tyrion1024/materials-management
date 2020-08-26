const searchHistory = (state = {
  page_number: 1,
  keyword: '',
  level_one_id: undefined,
  level_two_id: undefined
}, action: any) => {
  switch (action.type) {
    case 'SET_SEARCH_PAGE_NUMBER':
      return Object.assign({}, state, {
        page_number: action.content
      })
    case 'SET_SEARCH_KEYWORD':
      return Object.assign({}, state, {
        keyword: action.content
      })
    case 'SET_SEARCH_LEVEL_ONE':
      return Object.assign({}, state, {
        level_one_id: action.content
      })
    case 'SET_SEARCH_LEVEL_TWO':
      return Object.assign({}, state, {
        level_two_id: action.content
      })
    default:
      return state
  }
}


export default searchHistory