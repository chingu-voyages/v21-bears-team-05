import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthContext from '../hooks/AuthContext';

const axios = require('axios');

const PrivateRoute = ({ children, auth, ...rest }) => {
  const { state: authState } = React.useContext(AuthContext);
  const { dispatch } = React.useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(location) => {
        //if user state is unauthenticated maybe the user refreshed the page
        if (!authState.isAuthenticated) {
          const token = JSON.parse(localStorage.getItem('token'));
          const user = localStorage.getItem('user');

          // We check if a token and a user is set in local storage
          // If not we redirect user to login
          if (token && user) {
            //  Call API to get a new fresh signed token
            /*  We've got to use this config when protected routes are requested*/
            const config = {
              headers: { Authorization: `Bearer ${token}` },
            };
            axios
              .get('http://127.0.0.1:5000/auth/refresh', config)
              .then((res) => {
                /*
                If res is successfull,
                we can use our LOGIN reducer, it does the same job
                */
                dispatch({
                  type: 'LOGIN',
                  payload: res.data,
                });
                return children;
              })
              .catch((error) => {
                console.log('error', error);
              });
          } else {
            // User has no token stored
            // He need to login
            return <Redirect to='/' />;
          }
        } else {
          return children;
        }
      }}
    />
  );
};

export default PrivateRoute;
