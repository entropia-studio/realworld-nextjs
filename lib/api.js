export const API_URL = 'http://localhost:3000/api';

export const getTags = async () => {
  const tags = await fetch(`${API_URL}/tags`);
  return await tags.json();
};

export const getArticles = async () => {
  const articles = await fetch(`${API_URL}/articles`);
  return await articles.json();
};

export const getArticleBySlug = async (slug) => {
  const article = await fetch(`${API_URL}/articles/${slug}`);
  return await article.json();
};

export const getArticlePaths = async () => {
  const slugsResponse = await fetch(`${API_URL}/slugs`);
  const response = await slugsResponse.json();

  const paths = response.slugs.map((slug) => {
    return {
      params: {
        slug: slug.slug,
      },
    };
  });
  return paths;
};

export const getProfile = async (username) => {
  const profile = await fetch(`${API_URL}/profiles/${username}`);
  return await profile.json();
};

export const getComments = async (slug) => {
  const comments = await fetch(`${API_URL}/articles/${slug}/comments`);
  return await comments.json();
};
