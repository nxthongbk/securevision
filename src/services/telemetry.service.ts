import axiosClient from '~/utils/axiosClient';

const telemetryService = {
  getLatestTelemetry: ({ entityType, entityId }: { entityType: string; entityId: string }) => {
    const url = `/device/telemetry/${entityType}/${entityId}/values/latest`;
    return axiosClient.get(url);
  },
  getLatestTelemetryCassandra: ({ entityId }: { entityType: string; entityId: string }) => {
    const url = `/device/telemetryC/${entityId}`;
    return axiosClient.get(url);
  },
  getTimeseriTelemetry: ({
    entityId,
    startTime,
    endTime,
    keys
  }: {
    entityId: string;
    startTime: any;
    endTime: any;
    keys: any;
  }) => {
    const url = `/device/telemetry/DEVICE/${entityId}/values/timeseries?startTs=${startTime}&endTs=${endTime}&interval=5000&keys=${keys}&agg=SUM`;
    return axiosClient.get(url);
  },
  postTelemetryDevice: ({ deviceId, telemetry }: { deviceId: string; telemetry: any }) => {
    const url = `/device/telemetry/${deviceId}`;
    return axiosClient.post(url, telemetry);
  },
  postTelemetry: ({ token, telemetry }: { token: string; telemetry: any }) => {
    const url = `/device/telemetry/noauth/${token}`;
    return axiosClient.post(url, telemetry);
  }
};
export default telemetryService;
