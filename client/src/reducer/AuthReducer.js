const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const userPayload = action.payload.user;
      const token = action.payload.token;

      //  Data structure for OAUTH and local will be different
      let user = {};
      switch (userPayload.method) {
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
    default:
      return state;
  }
};
export default AuthReducer;
