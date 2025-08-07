const BASE_URL = 'https://cloud.innovation.com.vn/api'; // Change to your Frigate URL

export async function getCameras() {
  const res = await fetch(`${BASE_URL}/cameras`);
  return res.json();
}

export async function getRecentEvents(limit = 10) {
  const res = await fetch(`${BASE_URL}/events?limit=${limit}&has_clip=1`);
  return res.json();
}

export function getEventThumbnailUrl(eventId: string): string {
  return `${BASE_URL}/events/${eventId}/thumbnail.jpg`;
}

export function getCameraSnapshot(cameraName: string): string {
  return `${BASE_URL}/${cameraName}/latest.jpg`;
}
