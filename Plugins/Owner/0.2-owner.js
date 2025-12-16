import fs from 'node:fs/promises';
import { toObject, delay } from 'wa-sock/utils';

export default {
   cmd: 'spamfex',
   async func(m) {
      
      const spamfex = JSON.parse(await fs.read('./Data/Json/spamfex.json'))
      if (Object.keys(spamfex) == 0) return m.reply('⚠️  Json sin elementos')
      
      for (const id in spamfex) {
         
         const data = spamfex[id]
         const type = ['image', 'video'].find(i => i in data)
         
         this.sendMessage(id, {
            ...(type ? {
               [type]: data[type]
            } : {}),
            ...(type ? { caption: data.desc } : { text: data.text || data.desc })
         })
         await delay(5000)
      }
   }
}