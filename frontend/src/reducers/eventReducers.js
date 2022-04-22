import {
    ALL_EVENTS_REQUEST,
    ALL_EVENTS_SUCCESS,
    ALL_EVENTS_FAIL,
    CLEAR_ERRORS

} from '../constants/eventConstants'

export const eventsReducer = (state = { events: [] }, action) => {
    switch (action.type) {

        case ALL_EVENTS_REQUEST:
            return {
                loading: true,
                events: []
            }

        case ALL_EVENTS_SUCCESS:
            return {
                loading: false,
                events: action.payload.events,
                count: action.payload.count,
            }

        case ALL_EVENTS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}