import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { authReducer, userReducer } from './reducers/userReducers'
import { eventsReducer } from './reducers/eventReducers';

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    events: eventsReducer
})

let initialState = {}

const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store; 