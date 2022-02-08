import { ILocation } from "../modules/common/Common.Models";

export function generateRandomCode(length: Number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function splitBase64Data(base64: string) {
  const [mime, data] = base64.split(";base64,");

  return { mime: mime.replace('data:', ''), data };
}

export function parseLocation(location: string): ILocation {
  if (!location) return null;

  const coords = location.split(',');

  if (coords.length !== 2) return null;

  try {
    let lat = parseFloat(coords[0]);
    let lng = parseFloat(coords[1]);

    return { lat, lng };
  } catch (error) {
    return null;
  }
}
