const axios = require('axios');
require('babel-polyfill');
const env = require('../env');

const config = {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Coding-Test-App',
  },
};
const githubUsersApi = 'https://api.github.com/users/';
const authQueryParam = env.credentials;


// This function accepts a string and determines what letters are missing
export const getFollowers = (async (githubId = '') => {
  if (githubId.length > 0) {
    const input = githubId.toLowerCase();
    const targetUrl = `${githubUsersApi + input}/followers?${authQueryParam}`;
    const result = await axios.get(targetUrl, config)
      .then((response) => {
        // console.log(response.data);
        const data = response.data.slice(0, 5);
        const responseBody = {
          searchedId: input,
          followers: [],
        };
        data.forEach((follower) => {
          const newFollower = { githubId: follower.login };
          responseBody.followers.push(newFollower);
        });
        return responseBody;
      })
      .catch((error) => {
        if (error.response.status === 403) {
          return new Error('Maximum number of requests to api.github.com has been reached');
        }
        // eslint-disable-next-line no-console
        console.log(error);
        return new Error(`The request to Github failed with error ${error}`);
      });
    console.log(result);
    return result;
  }
  return new Error('Invalid ID provided');
});

export const getFollowersRecursive = (async (githubId = '') => {
  console.log('searching recursively: ', githubId);
  console.log(`auth: ${authQueryParam}`);
  const results = await getFollowers(githubId);
  console.log(`my results: ${JSON.stringify(results)}`);
  return results;
});
export default getFollowers();
