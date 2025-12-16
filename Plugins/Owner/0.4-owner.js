import { delay } from 'wa-sock/utils';

export default {
   cmd: 'broadcast',
   async func(m) {
      
      const n = m.isQuote ? m.quote : m
      
      if (!m.isQuote && !n.isMedia && !n.text) return m.react('❌')
      
      const content = n.isMedia ? {
         [n.type]: await n.media(),
         caption: n.text || m.text,
         mimetype: n.mime
      } : { text: n.text || m.text }
      
      await m.react('⌛')
      
      const groups = await this.fetchGroupsAll()
      
      for (const { id, ...data } of groups) {
         
         if (!data.open && !data.idBotAdmin) continue
         
         this.sendMessage(id, content, {
            ephemeral: data.ephemeral
         })
         
         await delay(6000)
      }
      
      await m.react('✅')
   }
}