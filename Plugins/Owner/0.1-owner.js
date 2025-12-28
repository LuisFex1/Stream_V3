export default {
   cmd: 'notify',
   async func(m) {
      
      const n = m.isQuote ? m.quote : m
      
      if (!m.isQuote && !m.isMedia && !m.text) {
         return m.react('❌')
      }
      
      await m.react('⌛')
      
      const group = await this.groupData(m.from)
      
      const content = n.isMedia ? {
         [n.type]: await n.media(),
         caption: n.text || m.text,
         mimetype: n.mime
      } : { text: n.text || m.text }
      
      await this.sendMessage(m.from, content, {
         ephemeral: group.ephemeral,
         mentions: group.users.map(i => i.id)
      })
   },
   isOwner: true,
   isGroup: true
}