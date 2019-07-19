const axios = require('axios');
require('babel-polyfill');

const githubUsersApi = 'https://api.github.com/users/';


// This function accepts a string and determines what letters are missing
export const getFollowers = (async (githubId = '') => {
  const input = githubId.toLowerCase();
  const targetUrl = `${githubUsersApi + input}/followers`;
  const result = await axios.get(targetUrl)
    .then((response) => {
      // console.log(response.data);
      return response.data.slice(0, 5);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      return new Error(`The request to Github failed with error ${error}`);
    });
  return result;
});

export default getFollowers();
