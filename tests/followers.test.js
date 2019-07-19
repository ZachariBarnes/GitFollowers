const { getFollowers } = require('../src/followers');

let expected;
describe('Testing getFollowers', () => {
  beforeEach(() => {
    expected = null;
  });

  it('When given a Github ID string, getFollowers successfully returns up to 5 followers', async () => {
    const input = 'syntaqx';
    const result = await getFollowers(input);
    expect(result.length).toBeLessThanOrEqual(5);
  });
  it('When given a Github ID string, getFollowers successfully returns valid Followers', async () => {
    const input = 'laurenmarieh';
    const result = await getFollowers(input);
    expect(result[0].login).toBeTruthy();
    expect(result[0].id).toBeTruthy();
    expect(result[0].followers_url).toBeTruthy();
  });
});
