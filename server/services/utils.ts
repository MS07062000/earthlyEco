export function isValidHttpUrl(image: string) {
  let url;

  try {
    url = new URL(image);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
