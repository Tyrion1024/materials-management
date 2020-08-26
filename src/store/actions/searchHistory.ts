export const setSearchPageNumber = (dispatch: Function, pageNumber: number) => {
  dispatch({
    type: 'SET_SEARCH_PAGE_NUMBER',
    content: pageNumber
  })
  return Promise.resolve()
}


export const setSearchKeyword = (dispatch: Function, keyword: string) => {
  dispatch({
    type: 'SET_SEARCH_KEYWORD',
    content: keyword
  })
  return Promise.resolve()
}


export const setSearchLevelOne = (dispatch: Function, level: number | undefined) => {
  dispatch({
    type: 'SET_SEARCH_LEVEL_ONE',
    content: level
  })
  return Promise.resolve()
}

export const setSearchLevelTwo = (dispatch: Function, level: number | undefined) => {
  dispatch({
    type: 'SET_SEARCH_LEVEL_TWO',
    content: level
  })
  return Promise.resolve()
}