import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login/login';
import Content from './content/content';
import 'sanitize.css';
import './global.css';
import dbconfig from './dbconfig';
import store from 'react-couchdb-store/store';

const dbHostResult = dbconfig.getDbHost();
let host = dbHostResult.host;
const port = dbHostResult.port;
const dbName = dbHostResult.dbname;
const protocol = dbHostResult.protocol;
const localPrefix = 'admin-';

if (!host) console.error('No host for db defined, check hostConfig in index.js!');
else console.log(`Using db host ${host}`);

const onLoginAttempt = (username, password) => {
  const useSSL = protocol === 'https';

  // Try to connect
  return store.init(host, port, dbName, username, password, useSSL, true, localPrefix).on('complete', () => {
    store.close(); // Close test connection (without live option)
    store.init(host, port, dbName, username, password, useSSL, false, localPrefix); // Re-open connection without live option
    ReactDOM.render(<Content />, document.getElementById('root'));
  });
};

ReactDOM.render(<Login onLoginAttempt={onLoginAttempt} />, document.getElementById('root'));