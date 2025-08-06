import React from 'react';

function pluralize(value: number, unit: string) {
  return value === 1 ? `${value} ${unit} ago` : `${value} ${unit}s ago`;
}

export function timeAgo(dateInput: string | number | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diff) || diff < 0) return '';

  if (diff < 60) return pluralize(diff, 'second');
  if (diff < 3600) return pluralize(Math.floor(diff / 60), 'minute');
  if (diff < 86400) return pluralize(Math.floor(diff / 3600), 'hour');
  if (diff < 2592000) return pluralize(Math.floor(diff / 86400), 'day');
  if (diff < 31536000) return pluralize(Math.floor(diff / 2592000), 'month');
  return pluralize(Math.floor(diff / 31536000), 'year');
}

type TimeAgoProps = {
  date: string | number | Date | undefined | null;
  className?: string;
};

const TimeAgo: React.FC<TimeAgoProps> = ({ date, className }) => {
  if (!date) return null;
  return <span className={className}>{timeAgo(date)}</span>;
};

export default TimeAgo;
