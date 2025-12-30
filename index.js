import Socket from 'wa-sock';
import { fileURLToPath } from 'url'
import { dirname, join } from 'path';
import { format } from 'util';
import fs from 'node:fs/promises';
import { loadPlugins, DB, Server } from './Utils/index.js';

(async () => {
   
   const __filename = fileURLToPath(import.meta.url)
   const __dirname = dirname(__filename)
   const pluginsPath = join(__dirname, 'Plugins')
   const plugins = await loadPlugins(pluginsPath)
   
   const db = new DB('./Data/Json/contacts.json', './Data/Json/ignore.json')
   await db.init()
   
   const bot = new Socket({
      phone: '',
      owner: ['54787139743924@lid'],
      ignore: {
         has: id => db.isIgnore(id)
      }
   })
   
   bot.on('code', code => {
      console.log(`Codigo de emparejamiento: ` + code)
   })
   bot.on('status', reazon => {
      console.log({ delete: 'La sesion esta corrupta, borrando credenciales....', open: 'La conexión esta abierta', online: 'La conexión esta en linea', restart: 'Reiniciando conexión' } [reazon])
      if (reazon === 'delete') process.exit()
   });
   
   bot.on('contacts', contacts => {
      for (const { id, lid ,name } of contacts) {
         if (db.isContact(id)) continue
         db.addContact({
            id: lid || id,
            pn: id,
            name: name || 'annonymous'
         })
      }
   })
   bot.on('text', async (m, msg) => {
      if (/^[>_]/.test(m.text) && m.isOwner) {
         const text = /await|return/g.test(m.text) ? `(async() => { ${m.text.slice(1)}})()` : m.text.slice(1)
         let result = ''
         try {
            result = await eval(text)
         } catch (e) {
            result = e.message
         }
         m.reply(format(result))
      }
   })
   Object.keys(plugins).forEach(name => {
      bot.cmd(name, (m, msg) => {
         const plugin = plugins[name]
         if (plugin.isOwner && !m.isOwner) return
         if (plugin.isGroup && !m.isGroup) return
         if (plugin.isAdmin && !m.isAdmin) return
         plugin.call(bot, m, { msg, db })
      })
   })
   
   bot.start().then(() => {
      const server = new Server(8080, bot, db)
      server.start()
   }).catch((e) => console.log('Error: ' + e.message))
})()