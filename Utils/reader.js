import tesseract from 'tesseract.js';
import { exists } from './funcs.js';

export async function reader(source, lang = 'spa') {
   const payload = (Buffer.isBuffer(sourve) || (await exists(source))) ? source : null
   
   if (!payload) return {
      status: false,
      text: 'invalid parameter'
   }
   
   const result = await tesseract.recognize(payload, lang)
   
   return {
      status: true,
      text: result?.data?.text?.trim() || undefined
   }
}