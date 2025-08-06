export const DASHBOARD_TYPES = {
  Monitor: 'monitoring',
  Management: 'management',
  RemoteControl: 'remote-control',
  AccessControl: 'access-control',
  Map: 'map',
  CustomWidget: 'custom-widget'
};

function addZero(n) {
  return (n < 10 ? '0' : '') + n;
}
export function timestampToDate(ts) {
  const a = new Date(ts);
  const year = a.getFullYear();
  const month = a.getMonth() + 1;
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = `${addZero(year)}-${addZero(month)}-${addZero(date)} ${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
  return time;
}
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
