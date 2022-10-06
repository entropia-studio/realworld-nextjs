import useSWR from 'swr';

export const useFavoriteArticle = (slug) => {
  const { data, error } = useSWR(`/api/articles/${slug}/favorite`);

  return {
    favoritedArticle: data?.article?.favorited ?? false,
    isLoading: !error && !data,
    isError: error,
  };
};
