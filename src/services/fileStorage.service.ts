import axiosClient from '~/utils/axiosClient';
const fileStorageService = {
  uploadFile: (formData: any) => {
    return axiosClient.post('/storage/files/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getFileImage: (fileId: string) => {
    return axiosClient.get(`/storage/files/image/${fileId}`, {
      responseType: 'blob' // Đặt responseType là 'arraybuffer' để nhận dữ liệu nhị phân
    });
  },
  deleteFile: (fileId: string) => {
    return axiosClient.delete(`/storage/files/${fileId}`);
  }
};
export default fileStorageService;
