import {login, logout} from "../controllers/users";
import {getAccessToken, getAccounts, getTransactions} from "../controllers/plaid";

module.exports = function(app) {
  app.post('/api/auth/login', login);
  app.post('/api/auth/logout', logout);
  
  app.post('/api/plaid/getPlaidAccessToken', getAccessToken);
  app.post('/api/plaid/getAccounts', getAccounts);
  app.post('/api/plaid/getTransactions', getTransactions);
};
