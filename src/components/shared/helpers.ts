export const matchClass = (prefix: string, suffix: string, key?: string) => {
  if (key) {
    return prefix + key + suffix.slice(0, 1).toUpperCase() + suffix.slice(1);
  }
  return prefix + suffix;
};
