import './App.css';

import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';

import Event from './components/Event';

import Dashboard from './components/admin/Dashboard';

import ProtectedRoute from './components/route/protectedRoute';

import { loadUser } from './actions/userActions'
import store from './store'

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/events" component={Event} exact />
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />

          <Route path="/login" component={Login} />
          <Route path="/signup" component={Register} />
          <ProtectedRoute path="/profile" component={Profile} exact />
          <ProtectedRoute path="/profile/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/admin/dashboard" component={Dashboard} isAdmin={true} exact />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
