import useSWR from 'swr';
import { fetcher } from '../lib/util';

export const useFollowAuthor = (username) => {
  const { data, error } = useSWR(`/api/profiles/${username}`, fetcher);

  return {
    followedAuthor: data?.following ?? false,
    isLoading: !error && !data,
    isError: error,
  };
};
