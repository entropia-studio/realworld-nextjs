import useSWR from 'swr';
import { fetcher } from '../lib/util';

export const useFavoriteArticle = (slug) => {
  const { data, error } = useSWR(`../api/articles/${slug}/favorite`, fetcher);

  return {
    favoritedArticle: data?.article?.favorited ?? false,
    isLoading: !error && !data,
    isError: error,
  };
};
