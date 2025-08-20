import dayjs from 'dayjs';

export const FormatTime = (time: any) => {
  if (time) return dayjs(time).format('DD/MM/YYYY HH:mm:ss');
  else return '---';
};

export const FormatDate = (time: any) => {
  return dayjs(time).format('DD/MM/YYYY');
};

export const FormatShortTime = (time: any) => {
  return dayjs(time).format('DD/MM HH:mm');
};

export const FormatHourly = (time: any) => {
  return dayjs(time).format('HH:mm');
};

export const FormatLongTime = (time: any) => {
  return dayjs(time).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};

export const FormatTimeToNumber = (time: any) => {
  return dayjs(time).hour() * 60 + dayjs(time).minute();
};

export const FormatTimeToDayOfWeek = (time: any) => {
  return dayjs(time).format('dddd').toUpperCase();
};

export const FormatTimeAt12amISO = (time?: any) => {
  if (time) {
    return dayjs(time).format('YYYY-MM-DDT12:00:00.000[Z]');
  }
  return dayjs().format('YYYY-MM-DDT12:00:00.000[Z]');
};

export const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}