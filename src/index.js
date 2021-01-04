import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.css';

const FallBack = () => {
  return (
    <div style={{margin: '12px', textAlign: 'center'}}>
      <h1>Recurso no encontrado</h1>
    </div>
  );
};

const PATH = '';

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
      />
      <Switch>
        <Route exact path={`${PATH}/`}>
          <Login />
        </Route>
        <Route exact path={`${PATH}/register`}>
          <Register />
        </Route>
        <Route exact path={`${PATH}/home`}>
          <Home />
        </Route>
        <Route path="*">
          <FallBack />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
