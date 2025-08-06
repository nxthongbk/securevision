import { has } from 'lodash';

type NestedObject = {
  ts: number;
  value: number | string | NestedObject;
};

export function getFinalLatestTelemetryValue(obj: NestedObject) {
  const valueType = typeof obj.value;
  if (['number', 'string'].includes(valueType)) {
    return obj.value;
  }
  if (valueType === 'boolean') return `${obj.value}`;
  if (valueType === 'object' && has(obj.value, 'value')) {
    return getFinalLatestTelemetryValue(obj.value as NestedObject);
  }
  return JSON.stringify(obj.value);
}
