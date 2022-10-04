import useSWR from 'swr';
import { fetcher } from '../lib/util';
import { API_URL } from '../lib/api';

export const useFollowAuthor = (username) => {
  const { data, error } = useSWR(`${API_URL}/profiles/${username}`, fetcher);

  return {
    followedAuthor: data?.following ?? false,
    isLoading: !error && !data,
    isError: error,
  };
};
