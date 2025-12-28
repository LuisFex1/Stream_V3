export default {
   cmd: 'poll',
   async func(m, { msg }) {
      
      if (!m.text) return m.react('❌')
      
      const values = []
      const opc = m.text.split(/\/|\|/g)
      
      if (!opc[0] || !opc[1] || !opc[2]) return m.reply('¡ importante ! , proporcionar el nombre de la encuesta y al menos 2 opciones')
      
      if (opc.length >= 14) return m.reply('! Limite de opciones superada , incluir solo 13 opciones como máximo')
      
      for (let i = 1; i < opc.length; i++) {
         for (let x = i + 1; x < opc.length; x++) {
            if (opc[i] === opc[x]) {
               m.reply(`¡ La opción ${x} se repite con la opción ${i} !, intente no colocar las mismas opciones`);
               return
            }
         }
         values.push(opc[i])
      }
      
      await m.react('⌛')
      
      this.sendMessage(m.from, {
         poll: {
            name: `*\`ENCUESTA\`*: ${opc[0]}`,
            values,
            selectableCount: 1
         }
      }, { quote: msg })
   },
   isOwner: true
}