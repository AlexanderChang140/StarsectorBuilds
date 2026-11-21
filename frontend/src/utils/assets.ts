const API_URL = import.meta.env.VITE_API_URL;

// TODO: Safe path joining
export function imageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  return `${API_URL}/images/${path}`;
}