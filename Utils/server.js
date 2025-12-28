import express from 'express';
import fs from 'node:fs/promises';
import { reader } from './reader.js';

class Server {
   #port = 8080
   #server = {}
   #bot
   constructor(port, bot) {
      this.#port = port
      this.#bot = bot
   }
   
   start = () => {
      this.#server = express()
      this.#server.use(express.json({ limit: '100mb' }))
      const listEvents = this.#listEvents()
      for (const { event, func } of listEvents) {
         this.#server.post(event, func)
      }
      this.#server.listen(this.#bot, () => {
         console.log('Servidor escuchando en el puerto ' + this.#port)
      })
   }
   
   #listEvents = () => [
   {
      event: '/send',
      func: ({ body: { id, ...content } }, res) => {
         try {
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
               
               if (isBc) {
                  id = 'status@broadcast'
                  n.jidList = content.status.list || db.contacts.map(i => i.id)
               }
               
               this.#bot.sendMessage(id, m, n)
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
      },
      validate({ body: { ...content } }, res, next) {
         const send = message => res.json({
            status: '500',
            message
         })
         try {
            const isId = ['net', 'us', 'lid'].some(i => content.id.endsWith(i))
            const isBc = !!content.status
            
            if (!id || !isBc) return send('Id no configurado, asegúrate de que tenga el formato correcto')
            
            if (!!content.poll) {
               
               const { name, opc } = content.poll
               
               if (!opc || !name || opc.length <= 1) return send('La encuesta necesita un nombre y almenos 2 opciones')
               
               for (let i = 0; i < opc.length; i++) {
                  for (let j = i + 1; j < opc.length; i++) {
                     if (opc[i] == opc[j]) {
                        send(`La opción ${j} se repite con la opción ${i} asegúrese de no poner las mismas opciones`)
                        return
                     }
                  }
               }
            }
            next()
         } catch (e) {
            send('Error inesperado ' + e.message)
         }
      }
   },
   {
      event: '/ocr',
      func: async ({ body: { ...content }}, res) => {
         const isBase64 = content.data.length > 5000
         const res = await reader(isBase64 ? Buffer.from(content.data,'base64') : content.data)
         
         if(!res.status){
            return res.json({
               status: '500',
               message: res.text
            })
         } 
         res.json({
            status: '200',
            message: res.text
         })
      },
      validate({ body: { ...content }}, res, next){
         if(true){}
      }
   }]
}