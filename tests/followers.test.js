import axios from 'axios';
import { mockData } from './mockData';

const { getFollowers, getFollowersRecursive } = require('../src/followers');

jest.mock('axios');

let expectedResponse = '';
const mockedResponse = { data: mockData.data };
axios.get.mockResolvedValue(mockedResponse);

describe('Testing getFollowers', () => {
  beforeEach(() => {
    expectedResponse = {
      searchedId: 'laurenmarieh',
      followers:
              [{ githubId: 'FurqanM' },
                { githubId: 'iphipps' },
                { githubId: 'alixaxel' },
                { githubId: 'pe-aps24' },
                { githubId: 'zortness' }],
    };
  });

  it('When given a Github ID string, getFollowers successfully returns up to 5 followers', async () => {
    axios.get.mockResolvedValue(mockedResponse);
    const input = 'laurenmarieh';
    const result = await getFollowers(input);
    expect(result.searchedId).toEqual(input);
    expect(result.followers.length).toBeLessThanOrEqual(5);
  });
  it('When given a Github ID string, getFollowers successfully returns valid Followers', async () => {
    const input = 'laurenmarieh';
    // expectedResponse.searchedId = input;
    axios.get.mockResolvedValueOnce(mockedResponse);
    const result = await getFollowers(input);
    expect(result.searchedId).toEqual(input);
    expect(result.followers).toBeTruthy();
  });
  it('Given a valid GithubID, getFollowersRecursive successfully returns Followers up to 3 levels deep', async () => {
    const input = 'laurenmarieh';
    expectedResponse.searchedId = input;
    const result = await getFollowersRecursive(input);
    console.log(JSON.stringify(result));
    expect(result).toBeTruthy();
    expect(result.followers[0].followers[0].followers.length).toBeGreaterThan(0);
  });

  // UnhappyPaths
  it('When given a invalid Github ID string, getFollowers returns an error', async () => {
    const input = '';
    axios.get.mockResolvedValue();
    const result = await getFollowers(input);
    const expected = new Error('Invalid ID provided');
    expect(result).toEqual(expected);
  });
  it('When getFollowers returns an 403 Custom Error is returned', async () => {
    const resp = { response: { data: [], status: 403 } };
    axios.get.mockRejectedValueOnce(resp);
    const input = 'ZachariBarnes';
    const expected = new Error('Maximum number of requests to api.github.com has been reached');
    const result = await getFollowers(input);
    expect(result).toEqual(expected);
  });
  it('When getFollowers returns an 404 default Error is returned', async () => {
    const resp = { response: { data: [], status: 404 } };
    axios.get.mockRejectedValueOnce(resp);
    const input = 'ZachariBarnes';
    const expected = new Error(`The request to Github failed with error ${resp}`);
    const result = await getFollowers(input);
    expect(result).toEqual(expected);
  });
});
