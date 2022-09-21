const API_URL = 'http://localhost:3000/api';

export const getTags = async () => {
  const tags = await fetch(`${API_URL}/tags`);
  return await tags.json();
};

export const getArticles = async () => {
  const articles = await fetch(`${API_URL}/articles`);
  return await articles.json();
};

export const getSlugs = async () => {
  const slugsResponse = await fetch(`${API_URL}/slugs`);
  const response = await slugsResponse.json();

  const paths = response.slugs.map((slug) => {
    return {
      params: {
        slug,
      },
    };
  });
  return paths;
};
