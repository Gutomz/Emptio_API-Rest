import axios from "axios";

function parseWebsite(website: string) {
  return website.replace('http://', '').replace('https://', '');
}

export async function getMarketLogo(website: string, size: number = 80, grayScale: boolean = false) {
  if (!website) return null;

  let url = `https://logo.clearbit.com/${parseWebsite(website)}?size=${size}`;
  if (grayScale) url += '&grayscale=true';

  try {
    const request = await axios.get(url, { responseType: 'arraybuffer' });
    return "data:" + request.headers["content-type"] + ";base64," + Buffer.from(request.data).toString('base64');
  } catch (error) {
    return null;
  }
}