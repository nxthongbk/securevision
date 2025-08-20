import { IParamsAlarmConfig } from '~/@types/alarmConfig/alarmConfig.type';
import axiosClient from '~/utils/axiosClient';

const ruleEngineService = {
  getCondition() {
    const url = `/rule-engine/rules/condition`;
    return axiosClient.get(url);
  },
  saveAlarmConfig(data: IParamsAlarmConfig) {
    const url = `/rule-engine/alarm-configuration/save`;
    return axiosClient.post(url, data);
  },
  getAlarmConfigByDeviceID(deviceId: string) {
    const url = `/rule-engine/alarm-configuration/${deviceId}`;
    return axiosClient.get(url);
  },
  getAlarmConfigByTelemetry(deviceId: string, telemetry: string) {
    const url = `/rule-engine/alarm-configuration/${deviceId}/${telemetry}`;
    return axiosClient.get(url);
  },
  deleteAlarmConfig(deviceId: string, telemetry: string) {
    const url = `/rule-engine/alarm-configuration`;
    return axiosClient.delete(url, {
      data: { deviceId, telemetry }
    });
  }
};

export default ruleEngineService;
