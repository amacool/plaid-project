import {login, logout} from "../controllers/users";
import {
  getAccessToken,
  getAccounts,
  getTransactions,
  getAccountInfo,
  getAccountInfo1,
  getAssetReportToken,
  refreshAssetToken
} from "../controllers/plaid";

module.exports = function(app) {
  app.post('/auth/login', login);
  app.post('/auth/logout', logout);

  app.post('/plaid/getPlaidAccessToken', getAccessToken);
  app.post('/plaid/getPlaidAssetReportToken', getAssetReportToken);
  app.post('/plaid/refreshAssetToken', refreshAssetToken);
  app.post('/plaid/getAccounts', getAccounts);
  app.post('/plaid/getTransactions', getTransactions);
  app.post('/plaid/getAccountInfo', getAccountInfo);
  app.post('/plaid/getAccountInfo1', getAccountInfo1);
};
