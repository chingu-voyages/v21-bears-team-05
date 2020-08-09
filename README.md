# Feedme
## A homecooking recipe PWA for users who need a quick bite
### [Chingu](https://chingu.io/) || Voyage 21 || Bears Team 05

## At a glance:
- Landing page
    - Login: email+password/Sign In with Google/Sign In with Facebook
    - Use app as a guest (can read from database but unable to add to/edit data)
- Main view
    - Filter through recipes using a user defined ingredients list (cupboard)
    - Search recipes
    - Recipe listview
    - Recipe full view
        - View and upload (& delete) photos to gallery
        - Recipe title, description, instruction steps, ingredients list
- User cupboard
    - Users can browse and search for ingredients and add them to their list
    - Only ingredient used in recipes get added to database
- User profile
    - Profile avatar upload
    - Editable user name
    - Editable Bio
    - Publish Recipes
        - Create own recipes
        - Add/edit title, description, image
        - Add/remove ingredients and quantities and values
        - Add/remove/edit instruction steps
- App maintains own local DB (indexedDB) so can be used with persistence offline
- App also functional in appState only provided it receives data on startup
- Backend with authorisation and mongoDB gives this app capacity to become a social platform and means users can login from any device

## Development

### Setup
1. `$ npm install`
1. `$ npm run client-install`
1. Get API keys and add to .env files
- Get an [api key from imgur](https://api.imgur.com/oauth2/addclient) (Authorization type: Anonymous)
- Make a new file client/.env and add REACT_APP_IMGUR_CLIENT_ID_DEV=api_key_from_imgur

### Run
1. `$ npm run dev`