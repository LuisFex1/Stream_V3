import { reader } from '../.././Utils/index.js';

export default {
   cmd: 'ocr',
   async func(m) {
      
      const n = m.isQuote ? m.quote : m
      
      if (!n.isMedia || n.type !== 'image') return m.react('❌')
      
      const res = await reader(await n.media())
      
      if (!res.status || !res.text) return m.reply('! Ups ! no se pudo obtener el texto')
      
      m.reply(`*TEXTO*: ` + res.text)
   },
   isOwner: true
}