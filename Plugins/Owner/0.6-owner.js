export default {
   cmd: 'mute|unmute',
   async func(m, { db }) {
      
      const mention = m.mentions || m.quote?.id || (!m.isGroup ? m.id : null)
      
      if (!mention) return m.reply('Es necesario mencionar al usuario para realizar esta acción')
      
      const mess = {
         mute: '✓ Usuario muteado',
         unmute: '✓ Usuario desmuteado',
         yamute: '✗ El usuario ya se encuentra muteado',
         yaunmute: '✗ El usuario ya se encuentra desmuteado'
      }
      
      const isMute = db.isIgnore(mention)
      
      if ((isMute && m.cmd == 'mute') || (!isMute && m.cmd == 'unmute')) return m.reply(mess['ya' + m.cmd])
      
      if (m.cmd === 'mute')  await db.addIgnore(mention)
      
      if (m.cmd === 'unmute') await db.delIgnore(mention)
      
      m.reply(mess[m.cmd])
   },
   isOwner: true
}