const jwtDecode = require("jwt-decode");
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const userPayload = action.payload.user;
      const token = action.payload.token;
      const user = {
        uuid: userPayload.id,
      };
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