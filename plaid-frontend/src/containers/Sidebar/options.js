import {getDefaultPath} from '../../helpers/urlSync';
//import asyncComponent from "../../helpers/AsyncFunc";

const options = [
  {
    label: 'Accounts',
    key: 'accounts',
  },
  {
    label: 'Transactions',
    key: 'transactions',
  }
];
const getBreadcrumbOption = () => {
  const preKeys = getDefaultPath();
  let parent, activeChildren;
  options.forEach(option => {
    if (preKeys[option.key]) {
      parent = option;
      (option.children || []).forEach(child => {
        if (preKeys[child.key]) {
          activeChildren = child;
        }
      });
    }
  });
  return {parent, activeChildren};
};
export default options;
export {getBreadcrumbOption};
