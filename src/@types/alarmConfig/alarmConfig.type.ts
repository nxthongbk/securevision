export interface IParamsAlarmConfig {
  deviceId: string;
  telemetry: string;
  condition: string;
  value: object;
  duration: number;
  alarmType: string;
  alarmDetail: string;
}
