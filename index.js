import Socket from 'wa-sock';
import { join, dirname } from 'path';
import { loadPlugins } from './Utils/plugins.js';

(async () => {
   
   const __dirname = dirname(import.meta.dirname)
   const __filename = join(__dirname, 'Plugins')
   const plugins = await loadPlugins(__filename)
   
   const bot = new Socket({
      phone: '',
      owner: ['54787139743924@lid']
   })
   
   bot.on('code', code => {
      console.log(`Codigo de emparejamiento: ` + code)
   })
   bot.on('status', reazon => {
      console.log({ delete: 'La sesion esta corrupta, borrando credenciales....', open: 'La conexión esta abierta', online: 'La conexión esta en linea', restart: 'Reiniciando conexión' } [reazon])
      if (reazon === 'delete') process.exit()
   });
   
   Object.keys(plugins).forEach(name => {
      bot.cmd(name, (m, msg) => {
         const plugin = plugins[name]
         if (plugin.isOwner && !m.isOwner) return
         if (plugin.isGroup && !m.isGroup) return
         if (plugin.isAdmin && !m.isAdmin) return
         plugin.call(bot, m, msg)
      })
   })
})