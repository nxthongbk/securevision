export interface IParamsCreacteDeviceProfile {
  name: string;
  typeId: string;
  imageUrl?: string;
  signalWaitingTime: number;
  description?: string;
  typeIdTemp?: IDeviceTypeContent;
}

export interface IParamsEditDeviceProfile extends IParamsCreacteDeviceProfile {
  id: string;
}

export interface IParamsCreateDeviceType {
  label: string;
}

export interface IParamsGetDeviceType {
  page: number;
  size: number;
  keyword: string;
}

export interface IDeviceTypeOption {
  inputValue?: string;
  label: string;
  value: string;
}

export interface IDeviceTypeContent {
  inputValue?: string;
  label: string;
  id: string;
}

export interface IRowDataTabelDeviceProfile {
  description?: string;
  id: string;
  code: number;
  imageUrl: string;
  name: string;
  signalWaitingTime: number;
  totalDevices: { total: number; totalActive: number };
  type: { id: string; label: string };
  action?: string;
  stt?: string;
}
