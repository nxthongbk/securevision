import axiosClient from '~/utils/axiosClient';

export interface CreateLocationInputData {
  tenantCode: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  status: string;
  operatorId: string;
  imageUrl: string;
}

export interface UpdateLocationInputData {
  locationId: string;
  requestBody: CreateLocationInputData;
}

const locationService = {
  getLocations(page: number, size: number, keyword: string, tenantCode: string) {
    const url = `/device/location`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        keyword: keyword || '',
        tenantCode: tenantCode || ''
      }
    });
  },
  getLocationDetail(locationId: string, tenantCode: string) {
    const url = `/device/location/${locationId}`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || ''
      }
    });
  },
  getCamera(deviceId: string) {
    const url = `/camera/${deviceId}?type=TC-CAM`;
    return axiosClient.get(url);
  },

  deleteLocation(locationId: string) {
    const url = `/device/location/${locationId}`;
    return axiosClient.delete(url, {});
  },
  createLocation(requestBody: CreateLocationInputData) {
    const url = '/device/location';
    return axiosClient.post(url, requestBody);
  },
  updateLocation(locationId: string, requestBody: CreateLocationInputData) {
    const url = `/device/location/${locationId}`;
    return axiosClient.put(url, requestBody);
  },
  getProvinces(keyword: string, page: number, size: number) {
    const url = '/device/provinces';
    return axiosClient.get(url, {
      params: {
        keyword,
        page,
        size
      }
    });
  },
  getDashboards(locationId: string, tenantCode: string) {
    const url = `/device/location/${locationId}/dashboards`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || ''
      }
    });
  }
};

export default locationService;
