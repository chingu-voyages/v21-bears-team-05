const jwtDecode = require("jwt-decode");
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const userPayload = action.payload.user;
      const token = action.payload.token;
      const method = jwtDecode(action.payload.token).method;
      let user = {};
      switch (userPayload.method) {
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
    case "REFRESH":
      const tokenFromStorage = JSON.parse(localStorage.getItem("token"));
      const userFromStorage = JSON.parse(localStorage.getItem("user"));
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
    default:
      return state;
  }
};
export default AuthReducer;
