import axios from 'axios';

import {
    ALL_EVENTS_REQUEST,
    ALL_EVENTS_SUCCESS,
    ALL_EVENTS_FAIL,
    CLEAR_ERRORS

} from '../constants/eventConstants'

export const getEvents = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_EVENTS_REQUEST })

        const { data } = await axios.get(`/api/allevents`)

        dispatch({
            type: ALL_EVENTS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_EVENTS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}