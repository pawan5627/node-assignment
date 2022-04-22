import React, { Fragment, useEffect } from 'react'
import MetaData from './layout/MetaData'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert';
import { Route, Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { getEvents } from '../actions/eventActions'

const Home = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, events, error, count } = useSelector(state => state.events)

    useEffect(() => {
        if (error) {
            return alert.error(error)
        }
        //alert.success('Success')
        dispatch(getEvents());
    }, [dispatch, alert, error])

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'All Events'} />
                    <h1 id="heading">All Events</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {events && events.map(event => (
                                <div id="wrapper">
                                    <div class="twoColumn">
                                        <img src={event.event_image_thumb} class="thumb"></img>
                                    </div>
                                    <div class="twoColumn">
                                        <span className="dtl"> {event.event_title}</span>
                                        <span className="dtl"> {event.event_subtext}</span>
                                        <span className="dtl"> Fee : {event.event_fee}</span>
                                        <a  className="ebutton ml-5" href= {`${event.event_apply_new_url}`}>
                                            Apply here
                                        </a>
                                        <Link to= {`/event/${event.event_title}`} id="details" className="ebutton ml-3" > View Details </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home