import { OPC_CONFIG } from 'wa-sock';

export default {
   cmd: 'me',
   func(m) {
      const text = [
         `*\`NAME\`*: *${m.name}*`,
         `*\`ID\`*: *${m.id}*`,
         `*\`LID\`*: *${m.user_lid}*`,
         `*\`JID\`*: *${m.user_pn}*`,
         `*\`OWNER\`*: ${OPC_CONFIG.owner.includes(m.id) ? '✅' : '❌'}`
      ].map(i => '→ ' + i).join('\n')
      
      m.reply(text)
   }
}