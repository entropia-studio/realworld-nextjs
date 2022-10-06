import useSWR from 'swr';

export const useFollowAuthor = (username) => {
  const { data, error } = useSWR(`/api/profiles/${username}`);

  return {
    followedAuthor: data?.following ?? false,
    isLoading: !error && !data,
    isError: error,
  };
};
