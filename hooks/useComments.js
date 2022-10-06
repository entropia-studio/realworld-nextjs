import useSWR from 'swr';

export const useComments = (slug) => {
  const { data, error } = useSWR(`/api/articles/${slug}/comments`);

  return {
    comments: data?.comments ?? [],
    isLoading: !error && !data,
    isError: error,
  };
};
