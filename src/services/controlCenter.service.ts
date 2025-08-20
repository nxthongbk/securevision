import axiosClient from "~/utils/axiosClient"

export const URL_SMS = '/device/sendSMS';

const controlCenterService = {
  sendSms: (body: { message: string, phone: string }) => {
    return axiosClient.post(URL_SMS, body);
  },
  connectSocket: () => {

  }
};

export default controlCenterService;