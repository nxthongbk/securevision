export interface MenuItem {
  label: string;
  path?: string;
  icon?: string;
}

export const menuItems: MenuItem[] = [
  { label: 'Traffic Light', path: '/traffic-light', icon: 'lightbulb' },
  { label: 'CCTV', path: '/cctv', icon: 'video' },
  { label: 'Energy', path: '/energy', icon: 'bolt' },
  { label: 'Fire Alarm', path: '/fire-alarm', icon: 'fire-extinguisher' },
  { label: 'Street Light', path: '/street-light', icon: 'street-light' },
  { label: 'Solar Monitoring', path: '/solar-monitoring', icon: 'solar-panel' },
  { label: 'Environment Monitoring', path: '/environment-monitoring', icon: 'leaf' },
  { label: 'Water Meter Monitoring', path: '/water-meter-monitoring', icon: 'tint' },
  { label: 'Parking Monitoring', path: '/parking-monitoring', icon: 'parking' },
  { label: 'Access Control', path: '/access-control', icon: 'door-closed' },
  { label: 'Safety', path: '/safety', icon: 'safety' },
  { label: 'HVAC', path: '/hvac', icon: 'hvac' },
];
