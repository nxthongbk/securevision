import { useMutation, useQuery } from '@tanstack/react-query';
import fileStorageService from '~/services/fileStorage.service';
import handleNotificationMessege from '../notification';

export const useUploadFileAvatar = () => {
  const { data, mutate, reset, isPending } = useMutation({
    mutationKey: ['uploadFileAvatar'],
    mutationFn: (dataForm: any) => fileStorageService.uploadFile(dataForm),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    }
  });
  return { dataFile: data?.data, mutateUploadFile: mutate, resetUploadFile: reset, isPendingUploadFile: isPending };
};

export const useDeleteFileAvatar = () => {
  const { data, mutate } = useMutation({
    mutationKey: ['deleteFileAvatar'],
    mutationFn: (fileId: string) => fileStorageService.deleteFile(fileId),
    onError: (error: any) => {
      if (error.response && error.response.data.data) {
        handleNotificationMessege(error?.response?.data?.data);
      } else {
        handleNotificationMessege(error.message);
      }
    }
  });
  return { dataFile: data?.data, mutateDeleteFile: mutate };
};

export const useDownloadFileAvatar = (fileId: string) => {
  if (fileId) {
    const { data } = useQuery({
      queryKey: ['downloadFileAvatar', { fileId }],
      queryFn: async () => {
        try {
          if (fileId) {
            const response: any = await fileStorageService.getFileImage(fileId);
            if (response !== undefined) {
              let url = await URL.createObjectURL(response);
              return url;
            }
            return '';
          }
        } catch (error) {
          console.error('~~no image', error);
        }
      },
      staleTime: 4 * 60 * 1000
    });
    return { imageUrl: data, imageUrlR: data };
  } else {
    return { imageUrl: '', imageUrlR: '' };
  }
};
