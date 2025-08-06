import React from 'react';

interface CardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  height?: string | number;
}

const CardFrame: React.FC<CardProps> = ({ title, children, height }) => (
  <div className="dashboard-card" style={height ? { height } : undefined}>
    <div className="dashboard-card-header">
      <span className="dashboard-card-title">{title}</span>
    </div>
    <div className="dashboard-card-content">{children}</div>
  </div>
);

export default CardFrame;