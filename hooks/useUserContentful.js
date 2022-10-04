import useSWR from 'swr';
import { API_URL } from '../lib/api';
import { fetcher } from '../lib/util';

export const useUserContentful = () => {
  const { data, error } = useSWR(`${API_URL}/user`, fetcher);
  return {
    userContentful: data?.user,
    isLoading: !error && !data,
    isError: error,
  };
};
