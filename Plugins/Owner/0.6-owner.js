export { OPC_CONFIG } from 'wa-sock';
import fs from 'node:fs/promises';

export default {
   cmd: 'mute|unmute',
   async func(m) {
      
      const { ids } = OPC_CONFIG.ignore
      
      const mention = m.mentions || m.quote?.id || (!m.isGroup ? m.id : null)
      
      if (!mention) return m.reply('Es necesario mencionar al usuario para realizar esta acción')
      
      const mess = {
         mute: '✓ Usuario muteado',
         unmute: '✓ Usuario desmuteado',
         yamute: '✗ El usuario ya se encuentra muteado',
         yaunmute: '✗ El usuario ya se encuentra desmuteado'
      }
      
      const isMute = ids.includes(mention)
      
      if ((isMute && m.cmd == 'mute') || (!isMute && m.cmd == 'unmute')) return m.reply(mess['ya' + m.cmd])
      
      if (m.cmd === 'mute') ids.push(mention)
      if (m.cmd === 'unmute') ids = ids.filter(i => i != mention)
      
      m.reply(mess[m.cmd])
      fs.write('./Data/Json/mute.json', JSON.stringify(ids, null, 4))
   }
}