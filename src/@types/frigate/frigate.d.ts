export interface FrigateCamera {
  name: string;
  fps: number;
  width: number;
  height: number;
  detect: {
    enabled: boolean;
    fps: number;
  };
}

export interface FrigateEvent {
  id: string;
  camera: string;
  label: string;
  start_time: number;
  end_time: number | null;
  has_clip: boolean;
  has_snapshot: boolean;
}

export interface FrigateSnapshot {
	id: string;
	camera: string;
	url: string;
}