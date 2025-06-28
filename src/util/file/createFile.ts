import fs from 'fs';
export const createDir = (path: string) =>
  !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });
