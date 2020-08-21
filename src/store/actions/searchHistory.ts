export const setSearchPageNumber = (dispatch: Function, pageNumber: number) => {
  return dispatch({
    type: 'SET_SEARCH_PAGE_NUMBER',
    content: pageNumber
  })
}


export const setSearchKeyword = (dispatch: Function, keyword: string) => {
  return dispatch({
    type: 'SET_SEARCH_KEYWORD',
    content: keyword
  })
}


export const setSearchLevelOne = (dispatch: Function, level: number | undefined) => {
  return dispatch({
    type: 'SET_SEARCH_LEVEL_ONE',
    content: level
  })
}

export const setSearchLevelTwo = (dispatch: Function, level: number | undefined) => {
  return dispatch({
    type: 'SET_SEARCH_LEVEL_TWO',
    content: level
  })
}