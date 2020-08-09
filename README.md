# v21-bears-team-05

## Development

### Setup

1. `$ npm install`
1. `$ npm run client-install`
1. Get API keys and add to .env files
   - Register an account on https://api.imgur.com/
   - Then register an app https://api.imgur.com/oauth2/addclient
     ![Registration on imgur](https://imgur.com/I7YKC8i)
   - One you'r app is registered, you'll receive a client ID key and a Client secret key
     ![Registered on imgur](https://imgur.com/4uZ6iiC)
   - Make a new file client/.env and add REACT_APP_IMGUR_CLIENT_ID_DEV = "client_ID"
   - Restart the app

### Run

1. `$ npm run dev`
