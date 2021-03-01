export default {
  getDbHost: () => {
    return {
      host: window.location.hostname,
      port: 5984,
      dbname: process.env.REACT_APP_DBNAME,
      protocol: 'http',
    };
  },
};
