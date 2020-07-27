const jwtDecode = require("jwt-decode");
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const userPayload = action.payload.user;
      const token = action.payload.token;
      const method = jwtDecode(action.payload.token).method;
      let user = {};
      /*  We switch over the last auth method used in the token*/
      /*  So we can grab the right informations */
      switch (method) {
        case "facebook":
          user = {
            //  We use the database _id not the OAUTH _id
            id: userPayload.id,
          };
          break;
        case "google":
          user = {
            //  We use the database _id not the OAUTH _id
            id: userPayload.id,
          };
          break;
        case "local":
          user = {
            id: userPayload.id,
          };
          break;
        default:
          break;
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(token));
      return {
        ...state,
        isAuthenticated: true,
        user: user,
        token: token,
      };
    case "LOGOUT":
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
