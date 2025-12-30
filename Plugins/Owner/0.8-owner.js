import { OPC_CONFIG } from 'wa-sock';

export default {
   cmd: 'menu',
   func(m, { msg }) {
      const cmds = Object.keys(this.cmds)
      const prefix = JSON.stringify(OPC_CONFIG.prefix)
      
      let text = `
  Hola @${m.id.split('@')[0]} , aqui tienes la lista de comandos disponible.
      
> *𝌆 「 INFORMACIÓN DEL BOT 」*
      
   • *Nombre*: ${this.user.name}
   • *Version*: 3.0.0
   • *Prefijo*: ${prefix}
         
> *𝌆 「 COMANDOS 」* 
  `
      
      text += cmds.map(i => `\n    ➛ \`\`\`${i}\`\`\``).join('')
      this.sendMessage(m.from, {
         image: { url: "https://i.postimg.cc/xdkNs1Kz/menu.jpg" },
         caption: text.trim()
      }, { mentions: m.id, ephemeral: m.ephemeral, quote: msg })
   },
   isOwner: true
}