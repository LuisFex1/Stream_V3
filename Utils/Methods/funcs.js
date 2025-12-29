import fs from 'node:fs/promises';

export const exists = async path => fs.access(path).then(() => true).catch(() => false)