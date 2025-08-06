import {
  ICreateMQTT,
  IParamCreateDeviceInterface,
  IParamEditDeviceInterFace,
  IParamsGetDeviceInterFace
} from '~/@types/deviceType/device.type';

import axiosClient from '~/utils/axiosClient';

const deviceService = {
  getDeviceById(id: string) {
    const url = `/device/devices/${id}`;
    return axiosClient.get(url);
  },
  getDevice(params: IParamsGetDeviceInterFace) {
    const { keyword, page, size, tenantCode, deviceProfileId, locationId, status, alarmStatus } = params;
    const url = `/device/devices`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        keyword: keyword || '',
        tenantCode: tenantCode || '',
        deviceProfileId: deviceProfileId || '',
        locationId: locationId || '',
        status: status || '',
        alarmStatus: alarmStatus
      }
    });
  },
  getRandomTokenDevice() {
    const url = '/device/devices/random/token';
    return axiosClient.get(url);
  },

  createDevice(data: IParamCreateDeviceInterface) {
    const url = `/device/devices`;
    return axiosClient.post(url, data);
  },

  updateDevice(data: IParamEditDeviceInterFace) {
    const url = `/device/devices/${data.id}`;
    return axiosClient.put(url, data);
  },

  assignDeviceToLocation(deviceToken: string, locationId: string) {
    const url = `/device/devices/${deviceToken}/assign/${locationId}`;
    return axiosClient.patch(url, {});
  },
  unassignDevice(deviceToken: string) {
    const url = `/device/devices/${deviceToken}/unassign`;
    return axiosClient.patch(url);
  },
  deleteDevice(id: string) {
    const url = `/device/devices/${id}`;
    return axiosClient.delete(url, {});
  },
  getAttributes(entityType: string, entityId: string) {
    const url = `/device/telemetry/${entityType}/${entityId}/values/attributes`;
    return entityId && axiosClient.get(url);
  },
  upsertAttribute(deviceId: string, attributes: Record<string, any>) {
    const url = `/device/telemetry/DEVICE/${deviceId}/attributes`;
    return axiosClient.post(url, attributes);
  },
  deleteAtrributes(entityId: string, keyAtrribute: string) {
    const url = `/device/telemetry/DEVICE/${entityId}/attributes?attributeKey=${keyAtrribute}`;
    return axiosClient.delete(url, {});
  },
  createMQTT(data: ICreateMQTT) {
    const url = '/mqtt/users';
    return axiosClient.post(url, data);
  },
  updateMQTT(data: ICreateMQTT) {
    const url = '/mqtt/users';
    return axiosClient.put(url, data);
  },
  getInforMQTT(deviceId: string) {
    const url = `/mqtt/users/${deviceId}`;
    return axiosClient.get(url);
  },
  exportDevice() {
    const url = `/device/devices/export`;
    return axiosClient.get(url, { responseType: 'arraybuffer' });
  },
  exportSample() {
    const url = `/device/devices/export-sample`;
    return axiosClient.get(url, { responseType: 'arraybuffer' });
  },
  uploadDevice(formdata) {
    const url = `/device/devices/import`;
    return axiosClient.post(url, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } 
};

export default deviceService;
