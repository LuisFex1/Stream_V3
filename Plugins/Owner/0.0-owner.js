export default {
   cmd: 'gpsall',
   async func(m) {
      
      m.react('⌛')
      const groups = await this.fetchGroupsAll()
      let text = ''
      for (const group of groups) {
         text += [
            '\n> ```-----------------```',
            `→ \`NAME\`: *${group.name}*`,
            `→ \`ID\`: *${group.id}*`,
            `→ \`OPEN\`: ${group.open ? '✅' : '❌'}`,
            `→ \`BOT-ADMIN\`: ${group.isBotAdmin ? '✅' : '❌'}`
         ].join('\n')
      }
      m.react('✅')
      m.reply(text)
   },
   isOwner: true
}