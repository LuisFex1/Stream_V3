import { OPC_CONFIG } from 'wa-sock';

export default {
   cmd: 'menu',
   func(m) {
      const cmds = Object.keys(this.cmds)
      const prefix = JSON.stringify(OPC_CONFIG.prefix)
      
      let text = `
      Hola @${m.id.split('@')[0]} , aqui tienes la lista de comandos disponible.
      
      > *𝌆 「 INFORMACIÓN DEL BOT 」*
      
         • *Nombre*: ${this.bot.user.name}
         • *Version*: 3.0.0
         • *Prefijo*: ${prefix}
         
      > *𝌆 「 COMANDOS 」* 
      `.trim()
      
      text += cmds.map(i => `\n    ➛ \`\`\`${i}\`\`\``).join('')
      m.reply(text, { mentions: m.id })
   },
   isOwner: true 
}