import axiosClient from '~/utils/axiosClient';

export const URL_SMS = '/device/sendSMS';

const controlCenterService = {
  sendSms: (body: { message: string; phone: string }) => {
    return axiosClient.post(URL_SMS, body);
  },
  startStream: (body: { ipV4: string }) => {
    return axiosClient.get(`http://192.168.12.10:9090/start/${body.ipV4}`);
  },
  stopStream: (body: { ipV4: string }) => {
    return axiosClient.get(`http://192.168.12.10:9090/stop/${body.ipV4}`);
  },
  connectSocket: () => {},
};

export default controlCenterService;
