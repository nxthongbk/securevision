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
    name: 'alarm-status.ignore'
  },
  {
    id: '2',
    value: AlarmStatus.CONFIRM,
    name: 'alarm-status.confirm'
  },
  {
    id: '3',
    value: AlarmStatus.PENDING,
    name: 'alarm-status.pending'
  },
  {
    id: '4',
    value: AlarmStatus.ALARM,
    name: 'alarm-status.alarm'
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
