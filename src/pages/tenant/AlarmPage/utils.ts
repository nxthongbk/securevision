export enum AlarmStatus {
  IGNORE = 'IGNORE',
  CONFIRM = 'CONFIRM',
  PENDING = 'PENDING',
  ALARM = 'ALARM'
}

export const statusFilterOptions = [
  {
    id: '1',
    value: AlarmStatus.IGNORE,
    name: 'Bỏ qua'
  },
  {
    id: '2',
    value: AlarmStatus.CONFIRM,
    name: 'Xác minh'
  },
  {
    id: '3',
    value: AlarmStatus.PENDING,
    name: 'Chờ xác minh'
  },
  {
    id: '4',
    value: AlarmStatus.ALARM,
    name: 'Cảnh báo'
  }
];

type AlarmInfo = {
  id: string;
  date: string;
  username: string;
};

export interface FireAlertItem {
  code: number;
  createdAlarmBy: AlarmInfo;
  updatedAlarmBy: AlarmInfo;
  locationInfo: {
    name: string;
    id: string;
  };
  id: string;
  status: AlarmStatus;
  reason: string;
  type: string;
}

export const typeFilterOptions = [
  {
    id: '1',
    value: 'Báo cháy',
    name: 'Báo cháy'
  }
];
