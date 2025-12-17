import { join } from 'path';
import fs from 'node:fs/promises';

const plugins = {}

function loadPlugins(folder) {
   return fs.access(folder).then(async () => {
      const files = await fs.readdir(folder, { withFileTypes: true })
      for (const file of files) {
         const path = join(folder, file.name)
         if (file.isFile()) await readPlugins(path)
         if (file.isDirectory()) await loadPlugins(path)
      }
      return plugins
   }).catch(() => plugins)
}

async function readPlugins(path) {
   
   const file = (await import(path)).default
   
   if (file && Boolean(file.cmd) && typeof file.func === 'function') {
      
      file.cmd.split(/\/|\|/g).forEach(cmd => {
         plugins[cmd] = Object.assign(file.func, {
            active: true,
            ...Object.fromEntries(Object.entries(file).filter(([k, v]) => typeof v !== 'function')),
            path
         })
      })
   }
}

export {
   loadPlugins,
   readPlugins
}