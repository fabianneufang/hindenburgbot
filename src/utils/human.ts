export function bytesToHumanReadableFormat(size: number): string { // https://stackoverflow.com/a/20732091
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${Number((size / Math.pow(1024, i)).toFixed(2))} ${["B", "kB", "MB", "GB", "TB"][i]}`;
}
