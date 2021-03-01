# Admin App for Rangefeed2
This app controls [open-rangefeed](https://github.com/IBM/open-rangefeed).

## Install deps
Make sure you have yarn installed (`$ npm install -g yarn`), then do:
```
$ yarn
```
## Add Default Content
Populate default tweet data in:
- [src/content/tweet-custom/data-default.js](src/content/tweet-custom/data-default.js)
- [src/content/tweet-list/tweets.json](src/content/tweet-list/tweets.json).

Default company logo:
- [src/contnet/base64imgs/company-logo.js](src/content/base64imgs/company-logo.js)

Note: the image format must be base64.

## Run the app
Replace XXX with the name of your DB in CouchDB.
```
$ REACT_APP_DBNAME=XXX yarn start
```

## Create production build
Replace XXX with the name of your DB in CouchDB.
```
$ REACT_APP_DBNAME=XXX yarn run build
```

## Database configuration
You can configure custom db connections in file [src/dbconfig.js](src/dbconfig.js).

## Adding new persistent states
Rangefeed2 uses [react-couchdb-store](https://github.com/IBM/react-couchdb-store.git) to automatically create states and make them persistent in our database so they can be shared between the main app and the Admin app.
