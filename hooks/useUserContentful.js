import useSWR from 'swr';

export const useUserContentful = () => {
  const { data, error } = useSWR(`/api/user`);
  return {
    userContentful: data?.user,
    isLoading: !error && !data,
    isError: error,
  };
};
