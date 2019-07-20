/* eslint-disable no-await-in-loop */
import { async } from 'regenerator-runtime';

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
    return result;
  }
  return new Error('Invalid ID provided');
});

// eslint-disable-next-line arrow-body-style

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


export const getFollowersRecursive = (async (githubId = '') => {
  if (githubId.length > 0) {
    const depth = 3;
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

        const follower0 = response2.followers[0];
        const follower1 = response2.followers[1];
        const follower2 = response2.followers[2];
        const follower3 = response2.followers[3];
        const follower4 = response2.followers[4];
        const { searchedId } = response2;
        const Subfollowers0 = (follower0)
          ? await getUsers(follower0.followerUrl, follower0.githubId) : undefined;
        const Subfollowers1 = (follower1)
          ? await getUsers(follower1.followerUrl, follower1.githubId) : undefined;
        const Subfollowers2 = (follower2)
          ? await getUsers(follower2.followerUrl, follower2.githubId) : undefined;
        const Subfollowers3 = (follower3)
          ? await getUsers(follower3.followerUrl, follower3.githubId) : undefined;
        const Subfollowers4 = (follower4)
          ? await getUsers(follower4.followerUrl, follower4.githubId) : undefined;
        const body = {
          searchedId,
          followers:
            [],
        };
        switch (response2.followers.length) {
          case 5:
            body.followers = [
              Subfollowers0,
              Subfollowers1,
              Subfollowers2,
              Subfollowers3,
              Subfollowers4];
            break;
          case 4:
            body.followers = [Subfollowers0, Subfollowers1, Subfollowers2, Subfollowers3];
            break;
          case 3:
            body.followers = [Subfollowers0, Subfollowers1, Subfollowers2];
            break;
          case 2:
            body.followers = [Subfollowers0, Subfollowers1];
            break;
          case 1:
            body.followers = [Subfollowers0];
            break;
          default:
            break;
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

export default getFollowers();


// .then((response) => {
//   console.log(`first Res${response}`);
//   const responseBody = constructUserObject(response, input);
//   responseBody.followers.forEach(async (follower) => {
//     const nextTargetUrl = `${githubUsersApi + follower.githubId}/followers?${authQueryParam}`;
//     const tier2 = await axios.get(nextTargetUrl, config)
//       .then(response2 => constructUserObject(response2, follower.githubId));
//     tier2.followers.forEach(async (finalFollower) => {
//       const finalTargetUrl = `${githubUsersApi + finalFollower.githubId}/followers?${authQueryParam}`;
//       const tier3 = await axios.get(finalTargetUrl, config)
//         .then(response3 => constructUserObject(response3, finalFollower.githubId));
//       const t3index = tier2.followers.indexOf(finalFollower);
//       tier2.followers[t3index] = tier3;
//     });
//     const t2index = responseBody.followers.indexOf(follower);
//     responseBody.followers[t2index] = tier2;
//   });
//   console.log(`Response: ${responseBody}`);
//   return responseBody;
// })
