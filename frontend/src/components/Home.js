import React, { Fragment, useEffect } from 'react'
import MetaData from './layout/MetaData'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux'

const Home = ({ match }) => {

  const alert = useAlert();
  const dispatch = useDispatch();

  return (
    <Fragment>
        <Fragment>
          <MetaData title={'Home Page'} />
        </Fragment>
    </Fragment>
  )
}

export default Home