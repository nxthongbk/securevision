import { useMutation, useQuery } from '@tanstack/react-query';
import axiosClient from '~/utils/axiosClient';

// Custom hook for getting the file system
export const useGetFileSystem = ({ file }: { file?: string }) => {
  return useQuery({
    queryKey: ['getFileSystem', file],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/storage/files/system/${file}`);
      return data;
    },
    staleTime: 3000
  });
};

export const usePostFileSystem = () => {
  return useMutation({
    mutationFn: async (body: FormData) => {
      const { data } = await axiosClient.post('/storage/files/system', body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return data;
    }
  });
};
