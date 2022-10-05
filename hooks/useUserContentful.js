import useSWR from 'swr';
import { fetcher } from '../lib/util';

export const useUserContentful = () => {
  const { data, error } = useSWR(`/api/user`, fetcher);
  return {
    userContentful: data?.user,
    isLoading: !error && !data,
    isError: error,
  };
};
