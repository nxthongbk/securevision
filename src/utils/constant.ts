export enum UserRole {
  SYSADMIN = 'SYSADMIN',
  TENANT = 'TENANT'
}

export const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';
