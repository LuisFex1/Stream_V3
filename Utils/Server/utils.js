export function normalizeBody(body = {}) {
   let m = {
      id: body.number || body.id || body.phone 
   }
   if (body.type) {
      switch (body.type) {
         case 'image':
         case 'video':
         case 'audio':
            m[body.type] = body.path ? { url: body.path } : Buffer.from(body.base64)
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
   
   for (const i of ['viewOnce', 'voiceNote', 'broadcast', 'action']) {
      if (i in body) m[i] = body[i]
   }
   
   return m
}