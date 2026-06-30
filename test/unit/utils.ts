/* eslint-disable unicorn/no-global-object-property-assignment */

export function setURL(url: string): () => void {
  const oldLocation = window.location;
  const location = new URL(url);
  // @ts-expect-error - replace with mock
  delete window.location;
  // @ts-expect-error - simple mock
  window.location = location;

  return () => {
    // @ts-expect-error - replace with original
    window.location = oldLocation;
  };
}
