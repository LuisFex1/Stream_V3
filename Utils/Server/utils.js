const isUrl = input => /^https?:\/\//.test(input)

export function normalizeBody(body = {}) {
   let m = {
      id: body.number || body.id || body.phone
   }
   if (body.type) {
      switch (body.type) {
         case 'image':
         case 'video':
         case 'audio':
            m[body.type] = isUrl(body.path) ? { url: body.path } : !Buffer.isBuffer(body.path) && typeof body.path !== 'string' ? Buffer.from(body.path, 'base64') : body.path
            m.caption = body.message
            break;
         case 'text':
            m.text = body.message
            break
         case 'poll':
         case 'location':
            m[body.type] = body[body.type]
            break
         case 'contact':
            m.contact = {
               name: body.name,
               phone: body.phone
            }
            break
         default:
      }
   }
   
   for (const i of ['viewOnce', 'voiceNote', 'status', 'action']) {
      if (i === 'status') {
         m[i] = { list: body.users }
         continue
      }
      if (i in body) m[i] = body[i]
   }
   
   return m
}