import useSWR from 'swr';
import { fetcher } from '../lib/util';
import { API_URL } from '../lib/api';

export const useFavoriteArticle = (slug) => {
  const { data, error } = useSWR(
    `${API_URL}/articles/${slug}/favorite`,
    fetcher
  );

  return {
    favoriteArticle: data?.article?.favorited,
    isLoading: !error && !data,
    isError: error,
  };
};
