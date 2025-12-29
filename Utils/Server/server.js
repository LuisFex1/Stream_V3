import express from 'express';
import fs from 'node:fs/promises';
import { reader } from '.././reader.js';
import { normalizeBody } from './utils.js';

class Server {
   #port = 8080
   #server = {}
   #bot
   #db
   constructor(port, bot, db) {
      this.#port = port
      this.#bot = bot
      this.#db = db
   }
   
   start = () => {
      this.#server = express()
      this.#server.use(express.json({ limit: '100mb' }))
      this.#initEvents()
      this.#server.listen(this.#bot, () => {
         console.log('Servidor escuchando en el puerto ' + this.#port)
      })
      
   }
   
   #initEvents = () => {
      this.#server.post('/send', async ({ body }, res) => {
         try {
            const { id, ...content } = normalizeBody(body)
            const isId = typeof id == 'string'
            const isBc = 'status' in content
            
            if (isId || isBc) {
               
               const m = {}
               const n = {}
               
               for (const i of ['image', 'video', 'audio', 'sticker']) {
                  if (i in content) {
                     m[i] = content[i].length > 5000 ? Buffer.from(content[i], 'Base64') : content[i].type === 'Buffer' ? Buffer.from(content[i]) : {
                        url: content[i]
                     }
                     break
                  }
               }
               
               for (const i of ['text', 'caption', 'mimetype', 'mentions', 'viewOnce']) {
                  if (i in content) {
                     m[i] = content[i]
                  }
               }
               
               if ('voiceNote' in content) {
                  m.ptt = !!content.voiceNote
                  m.mimetype = 'audio/ogg; codecs=opus'
               }
               
               if ('poll' in content) {
                  m.poll = {
                     name: content.poll.name || '',
                     values: content.poll.opc || [],
                     selectableCount: 1
                  }
               }
               if ('location' in content) {
                  m.location = {
                     name: content.location.name || '',
                     address: content.location.desc || '',
                     degreesLatitude: content.location.latitud || 0,
                     degreesLongitude: content.location.longitud || 0
                  }
               }
               
               if ('action' in content) {
                  if (content.action === 'mute') this.#db.addIgnore(id)
                  if (content.action == 'unmute') this.#db.delIgnore(id)
                  if (content.action == 'notify') {
                     if (!id.endsWith('us')) return
                     n.mentions = (await this.#bot.groupData(id)).users.map(i => i.id)
                  }
               }
               
               if (isBc) {
                  id = 'status@broadcast'
                  n.jidList = content.status.list || db.contacts.map(i => i.pn)
               }
               
               this.#bot.sendMessage(id, m, n).then(() => {
                  if ('contact' in content) {
                     this.#bot.sendContact(id, content.contact)
                  }
               })
               
            }
            
            return res.json({
               status: isId ? '200' : '404',
               message: isId ? 'mensaje enviado' : 'El id no es válido'
            })
         } catch (e) {
            return res.json({
               status: '500',
               message: 'Error inesperado: ' + e.message
            })
         }
      })
   }
}