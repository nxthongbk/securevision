import axiosClient from '~/utils/axiosClient';
export interface CreateDashboardInputData {
  tenantCode: string;
  name: string;
  type: string;
  imageUrl: string;
}

export interface CreatePageInputData {
  pages: [
    {
      title: string;
      widgets: any[];
      id?: string;
    }
  ];
}
export const dashboardService = {
  getDashboardData(page: number, size: number, tenantCode: string) {
    const url = '/device/dashboard';
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        tenantCode: tenantCode || ''
      }
    });
  },
  createDashboardData(requestBody: CreateDashboardInputData) {
    const url = '/device/dashboard';
    return axiosClient.post(url, requestBody);
  },
  getDashboardById(dashboardId: string, tenantCode: string) {
    const url = `/device/dashboard/${dashboardId}`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || ''
      }
    });
  },
  deleteDashboardById(dashboardId: string) {
    const url = `/device/dashboard/${dashboardId}`;
    return axiosClient.delete(url);
  },
  updateDashBoardById(dashboardId: string, requestBody: CreateDashboardInputData) {
    const url = `/device/dashboard/${dashboardId}`;
    return axiosClient.put(url, requestBody);
  },
  createPage(tenantCode: string, dashboardId: string, requestBody: any) {
    const url = `/device/telemetry/DASHBOARD/${dashboardId}/attributes?tenantCode=${tenantCode}`;
    return axiosClient.post(url, { pages: requestBody });
  },
  saveEntityAttributes(tenantCode, entityId, data) {
    const url = `/device/telemetry/DASHBOARD/${entityId}/attributes?tenantCode=${tenantCode}`;
    const payload = data;
    return axiosClient.post(url, payload);
  },

  /**
   * 🔹 Uploads a file (e.g. .glb, .gltf, .png, etc.) to the central storage service
   * Returns metadata including file ID, type, and signature
   */
  uploadBabylonScene(file: File, onProgress?: (percent: number) => void) {
    const url = 'https://scity-dev.innovation.com.vn/api/storage/files/upload-file';
    const formData = new FormData();
    formData.append('file', file);

    return axiosClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress?.(percent); // ✅ Report progress
        }
      },
    });
  },


  /**
   * 🔹 Combined helper that:
   *   1. Uploads the file to storage
   *   2. Saves the resulting file ID as an attribute under the entity
   *
   * Returns both upload and save responses
   */
  async uploadAndSaveModel(tenantCode: string, entityId: string, file: File, onProgress?: (percent: number) => void) {
    try {
      // Step 1️⃣: Upload model file
      const uploadRes = await this.uploadBabylonScene(file, onProgress);
      console.log("AFTER UPLOADING:" ,uploadRes)

      // console.log('📤 [uploadAndSaveModel] Upload response:', uploadRes);
      // console.log('📦 [uploadAndSaveModel] Upload response data:', uploadRes?.data);

      const fileId = uploadRes?.data?.id; // ✅ correct key
      // console.log('🪪 [uploadAndSaveModel] Extracted file ID:', fileId);

      if (!fileId) {
        throw new Error('File upload failed — missing file ID in response.');
      }

      // Step 2️⃣: Save model reference as entity attribute
      const payload = {
        operationModel: fileId,
      };

      // console.log('💾 [uploadAndSaveModel] Saving payload:', payload);

      const saveRes = await this.saveEntityAttributes(tenantCode, entityId, payload);

      // console.log('✅ [uploadAndSaveModel] Model uploaded and saved:', { fileId, saveRes });
      return { uploadRes, saveRes };
    } catch (err) {
      console.error('❌ uploadAndSaveModel failed:', err);
      throw err;
    }
  },

  /**
   * 🔹 Fetch model URL by file ID (used when rendering BabylonViewer)
   */
  // async getBabylonModel(fileId: string): Promise<string> {
  //   try {

  //     const url = `https://scity-dev.innovation.com.vn/api/storage/files/download/${fileId}`;
  //     const response = await axiosClient.get(url, { responseType: 'blob' });
  //     const blob = response.data;
  //     // ✅ Convert to object URL for Babylon
  //     const blobUrl = URL.createObjectURL(blob);
  //     return url;

  //   } catch (err) {
  //     console.error('❌ Failed to fetch Babylon model:', err);
  //     throw err;
  //   }
  // },
  // https://scity-dev.innovation.com.vn/api/storage/files/noauth/model/cdd0f433-6642-44e7-88f1-01eb827351f7_a1863d0b.glb
  // "dc88a98a-c594-4b72-8ea4-30bc2a399ee3_a1863d0b.glb"

  async getBabylonModel(fileId: string): Promise<string> {
    // console.log("this is being called")
    // console.log(fileId)
    const appended_url = `https://scity-dev.innovation.com.vn/api/storage/files/noauth/model/${fileId}`
    // console.log(appended_url)
    return appended_url;
  }

  



};
