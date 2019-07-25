
const graphqlApiUrl = `${window.location.origin}/graphql`;

const graphqlApi = async (query, cacheId) => {
  try {
    const response = await fetch(graphqlApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    });
    const json = await response.json();
    const { data } = json;
    return data;
  } catch (e) {
    console.error(e.toString());
    throw new Error(e.toString());
  }
};

export default graphqlApi;
