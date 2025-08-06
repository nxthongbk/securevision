export const VN_PHONE_REGEX = /^(0[0-9]{9}|(\+84)[0-9]{9})$/;

export const GEO_COORDINATE_REGEX = /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i;

export type SearchBoxOption = {
  label: MapboxGeocoder.Result['place_name'];
  id: MapboxGeocoder.Result['id'];
  feature: any;
  fullAddress: any;
};

export function coordinateFeature(lng, lat) {
  return {
    label: 'Vĩ độ: ' + lat + ' Kinh độ: ' + lng,
    id: `${lat}${lng}`,
    reverseLookup: true,
    lat,
    lng
  };
}

export function generateCaptcha(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters[randomIndex];
  }
  return captcha;
}
