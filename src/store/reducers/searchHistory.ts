const searchHistory = (state = {
  page_number: 1,
  keyword: '',
  level_one_id: undefined,
  level_two_id: undefined
}, action: any) => {
  switch (action.type) {
    case 'SET_SEARCH_PAGE_NUMBER':
      return Object.assign({
        page_number: action.content
      } ,state)
    case 'SET_SEARCH_KEYWORD':
      return Object.assign({
        keyword: action.content
      } ,state)
    case 'setSearchLevelOne':
      return Object.assign({
        level_one_id: action.content
      } ,state)
      case 'setSearchLevelTwo':
        return Object.assign({
          level_two_id: action.content
        } ,state)
    default:
      return state
  }
}


export default searchHistory