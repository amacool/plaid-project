import axios from 'axios';
import notification from "../../components/notification";

const urlPrefix = "http://localhost:9000/";

// const axiosConfig = () => {
//   let config = {
//     'headers': {
//       'Content-Type': 'application/json'
//     }
//   };
//   if (localStorage.accessToken) {
//     config['headers']['accesstoken'] = localStorage.accessToken;
//   }
//   if (localStorage.idToken) {
//     config['headers']['Authorization'] = localStorage.idToken;
//   }
//   return config;
// };

const postApi = async ({url, data}) => {
  return await axios.post(urlPrefix + url, data)
    .then(res => {
      if (res.data && !res.data.status) {
        console.log(res.data.error);
        if (typeof res.data.error === 'object' && res.data.error.error_message) {
          res.data.error && notification('error', res.data.error.error_message);
        } else if (res.data.error) {
          notification('error', res.data.error);
        }
      }
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return false;
    })
};

const getApi = async ({url, data}) => {
  return await axios.get(urlPrefix + url, data)
    .then(res => {
      if (res.data && !res.data.status) {
        res.data.error && alert(res.data.error);
      }
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return false;
    })
};

export {postApi, getApi};