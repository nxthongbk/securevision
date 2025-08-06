export interface IParamsGetDeviceInterFace {
  page: number;
  size: number;
  keyword: string;
  tenantCode?: string;
  status?: string;
  deviceProfileId?: string;
  locationId?: string;
  alarmStatus?: string;
}

export interface IParamsUseGetDeviceInterFace {
  page: number;
  size: number;
  keyword: string;
  tenantCode?: string;
  status?: string;
  deviceProfileId?: string;
  locationId?: string;
  alarmStatusList?: string[];
}

export interface IParamCreateDeviceInterface {
  name: string;
  label?: string;
  description?: string;
  token: string;
  deviceProfileId?: string;
}

export interface IParamEditDeviceInterFace extends IParamCreateDeviceInterface {
  id: string;
}

export interface IRowTableDeviceInterface {
  id: string;
  code: string;
  token: string;
  status: string;
  action: string;
  deviceProfileId: string;
  deviceProfileName: string;
  deviceProfileImageUrl: string;
  dataIndex: any;
  alarmStatus: string;
  deviceName: string;
  tenant: object;
  location: object;
}

export interface ICreateMQTT {
  clientId: string;
  username: string;
  password: string;
  deviceId: string;
  isEdit?: boolean;
}
