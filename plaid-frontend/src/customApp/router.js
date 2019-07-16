import asyncComponent from "../helpers/AsyncFunc";

const routes = [
  {
    path: "/dashboard/accounts",
    component: asyncComponent(() => import("./containers/Accounts/index"))
  },
  {
    path: "/dashboard/transactions",
    component: asyncComponent(() => import("./containers/Transactions/index"))
  }
];
export default routes;
