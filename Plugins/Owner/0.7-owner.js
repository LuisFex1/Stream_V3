export default {
   cmd: 'status',
   async func(m, { db }) {
      
      const n = m.isQuote ? m.quote : m
      
      if (!n.isQuote && !n.isMedia && !n.text) return m.react('❌')
      
      if (n.isMedia && !['image', 'video', 'audio'].includes(n.type)) return m.reply('! Ups ! este typo de media no es soportado')
      
      const jidList = [...db.contacts.values()].map(i => i.pn)
      
      if (jidList.length <= 0) return m.reply('¡ Importante ! no hay usuarios disponibles en la db')
      
      const content = n.isMedia ? {
         [n.type]: await n.media(),
         caption: n.text || m.text,
         mime: n.mime
      } : { text: n.text || m.text }
      
      this.sendMessage('status@broadcast', content, { jidList })
   },
   isOwner: true
}