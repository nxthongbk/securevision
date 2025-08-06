import axiosClient from '~/utils/axiosClient';

const alarmService = {
  getAlarmByTokenDevice({ token, page, size }: { token: string; page: number; size: number }) {
    const url = `/device/alarm/${token}`;
    return axiosClient.get(url, { params: { page, size } });
  },

  changeStatusAlarm(token: string, alarmId: string, data: any) {
    const url = `/device/alarm/noauth/${token}/${alarmId}/status`;

    return axiosClient.patch(url, data);
  },
  createAlarm(token: string, data: any) {
    const url = `/device/alarm/noauth/${token}`;

    return axiosClient.post(url, data);
  },
  getAlarmLocations(
    page: number,
    size: number,
    keyword: string,
    tenantCode: string,
    locationId: string,
    status: string,
    startTime: number | string,
    endTime: number | string
  ) {
    const url = `/device/alarm-location`;
    return axiosClient.get(url, {
      params: {
        page: page || 0,
        size: size || 30,
        keyword: keyword ?? '',
        tenantCode: tenantCode ?? '',
        locationId: locationId || '',
        status: status || '',
        startTime: startTime ? new Date(startTime) : '',
        endTime: endTime ? new Date(endTime) : ''
      }
    });
  },
  getAlarmLocationByAlarmLocationId(alarmLocationId: string, tenantCode: string) {
    const url = `/device/alarm-location/${alarmLocationId}`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || '',
        alarmLocationId
      }
    });
  },
  getAlarmLocationInfo(locationId: string, tenantCode: string) {
    const url = `/device/alarm-location/${locationId}/alarm`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || ''
      }
    });
  },
  getAlarmPendingLocationInfo(locationId: string, tenantCode: string) {
    const url = `/device/alarm-location/${locationId}/pending`;
    return axiosClient.get(url, {
      params: {
        tenantCode: tenantCode || ''
      }
    });
  },
  updateAlarmStatusOfLocation(
    tenantCode: string,
    alarmLocationId: string,
    requestBody: { status: string; reason: string }
  ) {
    const url = `/device/alarm-location/${alarmLocationId}/status?tenantCode=${tenantCode}`;

    return axiosClient.patch(url, requestBody);
  },
  deleteAlarmID(
    alarmId: string
  ) {
    const url = `/device/alarm/${alarmId}/clear`;

    return axiosClient.delete(url)
  },
  deleteAlarmToken(
    alarmToken: string
  ) {
    const url = `/device/alarm/${alarmToken}/clear/all`;

    return axiosClient.delete(url)
  }
};

export default alarmService;
