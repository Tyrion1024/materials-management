import { combineReducers } from 'redux'
import user from './user'
import searchHistory from './searchHistory'
export default combineReducers({user, searchHistory})