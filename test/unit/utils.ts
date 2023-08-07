export function setURL(url: string): () => void {
  const oldLocation = window.location;
  const location = new URL(url);
  // @ts-expect-error - replace with mock
  delete window.location;
  // @ts-expect-error - simple mock
  window.location = location;

  return () => {
    window.location = oldLocation;
  };
}
