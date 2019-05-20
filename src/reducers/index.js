import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import people from './people'

const app = combineReducers({
    people
})

export default function configureStore() {
  let store = createStore(app, applyMiddleware(thunk))
  return store
}
