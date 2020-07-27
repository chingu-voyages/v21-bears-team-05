const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const userPayload = action.payload.user;
      const token = action.payload.token;

      //  Data structure for OAUTH and local will be different
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
    default:
      return state;
  }
};
export default AuthReducer;
