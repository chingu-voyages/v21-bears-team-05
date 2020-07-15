import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../hooks/AuthContext';
const PrivateRoute = ({ children, auth, ...rest }) => {
  const { state: authState } = React.useContext(AuthContext);
  const { dispatch } = React.useContext(AuthContext);

  console.log('pass: ', authState);

  return (
    <Route
      {...rest}
      render={(location) => {
        //if user state is unauthenticated maybe the user refreshed the page
        if (!authState.isAuthenticated) {
          const token = localStorage.getItem('token');
          const user = localStorage.getItem('user');

          // We check if a token and a user is set in local storage
          // If not we redirect user to login
          //TODO: verify that the token is valid
          if (token && user) {
            dispatch({ type: 'REFRESH' });

            return children;
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
