export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, options);
  const body = await response.json().catch(() => ({ error: 'API unavailable. Start the backend with npm run server.' }));
  if (!response.ok) throw new Error(body.error || 'Request failed.');
  return body;
}

export function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}
