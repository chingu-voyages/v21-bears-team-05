const jwtDecode = require('jwt-decode');
const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const userPayload = action.payload.user;
      const token = action.payload.token;
      const method = jwtDecode(action.payload.token).method;
      let user = {};
      /*  We switch over the last auth method used in the token*/
      /*  So we can grab the right informations */
      switch (method) {
        case 'facebook':
          user = {
            //  We use the database _id not the OAUTH _id
            _id: userPayload._id,
            email: userPayload.facebook.email,
            name: userPayload.facebook.name,
            surname: userPayload.facebook.surname,
          };
          break;
        case 'google':
          user = {
            //  We use the database _id not the OAUTH _id
            _id: userPayload._id,
            email: userPayload.google.email,
            name: userPayload.google.name,
            surname: userPayload.google.surname,
          };
          break;
        case 'local':
          user = {
            _id: userPayload._id,
            email: userPayload.local.email,
            name: userPayload.local.name,
            surname: userPayload.local.surname,
          };
          break;
        default:
          break;
      }
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
      return {
        ...state,
        isAuthenticated: true,
        user: user,
        token: token,
      };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'REFRESH':
      const tokenFromStorage = JSON.parse(localStorage.getItem('token'));
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage && tokenFromStorage) {
        return {
          ...state,
          isAuthenticated: true,
          user: userFromStorage,
          token: tokenFromStorage,
        };
      } else {
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          token: null,
        };
      }
      break;
    default:
      return state;
  }
};
export default AuthReducer;
