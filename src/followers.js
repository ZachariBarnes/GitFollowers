/* eslint-disable no-await-in-loop */

const axios = require('axios');
require('babel-polyfill');
const env = require('../env');

// This pulls in the clientID  and client Secret from the env.js file
// this allows the API to call the github API up tp 5,000 times per hour instead of 60
const config = {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Coding-Test-App',
  },
};
const githubUsersApi = 'https://api.github.com/users/';
const authQueryParam = env.credentials;

// This function takes data from the github API and trims off the fields we do not want
const constructUserObject = ((response, input) => {
  const data = response.data.slice(0, 5);
  const responseBody = {
    searchedId: input,
    followers: [],
  };
  data.forEach((follower) => {
    const newFollower = {
      githubId: follower.login,
      followerUrl: follower.followers_url,
      followers: [],
    };
    responseBody.followers.push(newFollower);
  });
  return responseBody;
});

// This function creates the shape of the data we display to the user
const constructUserbody = ((response, input) => {
  const data = response.data.slice(0, 5);
  const responseBody = {
    searchedId: input,
    followers: [],
  };
  data.forEach((follower) => {
    const newFollower = {
      githubId: follower.login,
    };
    responseBody.followers.push(newFollower);
  });
  return responseBody;
});

// This function gets a single user and their followers from the API
// It is called multiple times to generate the follower tree
const getUser = (async (url, id) => axios.get(url + authQueryParam, config)
// eslint-disable-next-line arrow-body-style
  .then((response) => {
    const result = constructUserbody(response, id);
    // console.log(`result: ${JSON.stringify(result)}`);
    return result;
  })
  .catch((error) => {
    console.log(error.error, error.config);
  }));

// This function calls getUser for each follower of a given githubId
const getUsers = (async (url, id) => {
  const results = await axios.get(url + authQueryParam, config)
    .then((response) => {
      const result = constructUserObject(response, id);
      // console.log(`result: ${JSON.stringify(result)}`);
      return result;
    })
    .then(async (response2) => {
      // console.log(`Response 2: ${JSON.stringify(response2)}`);
      const follower = response2.followers;
      const Subfollowers = [];
      const { searchedId } = response2;
      Subfollowers[0] = (follower[0])
        ? await getUser(follower[0].followerUrl, follower[0].githubId) : undefined;
      Subfollowers[1] = (follower[1])
        ? await getUser(follower[1].followerUrl, follower[1].githubId) : undefined;
      Subfollowers[2] = (follower[2])
        ? await getUser(follower[2].followerUrl, follower[2].githubId) : undefined;
      Subfollowers[3] = (follower[3])
        ? await getUser(follower[3].followerUrl, follower[3].githubId) : undefined;
      Subfollowers[4] = (follower[4])
        ? await getUser(follower[4].followerUrl, follower[4].githubId) : undefined;
      const body = {
        searchedId,
        followers:
          [],
      };
      for (let i = 0; i < response2.followers.length; i += 1) {
        body.followers.push(Subfollowers[i]);
      }
      return body;
    })
    .catch((error) => {
      console.log(error.error, error.config);
    });

  return results;
});

// This function Gets the data for the given github ID
// It also returns all of his/her followers up to 3 levels deep if they exist
const getFollowersRecursive = (async (githubId = '') => {
  if (githubId.length > 0) {
    const input = githubId.toLowerCase();
    const targetUrl = `${githubUsersApi + input}/followers${authQueryParam}`;
    let responseBody = {};
    const result = await axios.get(targetUrl, config)
      .then(async (response) => {
        responseBody = constructUserObject(response, input);
        return responseBody;
      })
      .then(async (response2) => {
        // console.log(`Response 2: ${JSON.stringify(response2)}`);
        const follower = response2.followers;
        const Subfollowers = [];
        const { searchedId } = response2;
        Subfollowers[0] = (follower[0])
          ? await getUsers(follower[0].followerUrl, follower[0].githubId) : undefined;
        Subfollowers[1] = (follower[1])
          ? await getUsers(follower[1].followerUrl, follower[1].githubId) : undefined;
        Subfollowers[2] = (follower[2])
          ? await getUsers(follower[2].followerUrl, follower[2].githubId) : undefined;
        Subfollowers[3] = (follower[3])
          ? await getUsers(follower[3].followerUrl, follower[3].githubId) : undefined;
        Subfollowers[4] = (follower[4])
          ? await getUsers(follower[4].followerUrl, follower[4].githubId) : undefined;
        const body = {
          searchedId,
          followers:
            [],
        };
        for (let i = 0; i < response2.followers.length; i += 1) {
          body.followers.push(Subfollowers[i]);
        }
        return body;
      })
      .catch((error) => {
        if (error.response.status === 403) {
          return new Error('Maximum number of requests to api.github.com has been reached');
        }
        // eslint-disable-next-line no-console
        console.log(error);
        return new Error(`The request to Github failed with error ${error}`);
      });
    return result;
  }
  return new Error('Invalid ID provided');
  // return (depth > 0) ? getFollowers(githubId, depth - 1) : null;
});

module.exports = getFollowersRecursive;
