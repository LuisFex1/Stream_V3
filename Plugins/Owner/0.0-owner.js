export default {
   cmd: 'gpsall',
   async func(m, msg) {
      
      m.react('⌛')
      const groups = await this.fetchGroupsAll()
      const text = ''
      for (const group of groups) {
         text += [
            '> ```-----------------```',
            `→ \`NAME\`: *${group.name}*`,
            `→ \`ID\`: *${group.id}*`,
            `→ \`OPEN\`: ${group.open ? '✅' : '❌'}`,
            `→ \`BOT-ADMIN\`: ${group.isBotAdmin ? '✅' : '❌'}`
         ].join('\n')
      }
      m.reply(text)
   },
   isOwner: true
}