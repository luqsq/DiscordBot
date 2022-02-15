const { support } = require('../../permissions.js');
const { getPermLvl } = require('../../utils.js');
const { modChannel, supportRole } = require('../../config.js');

module.exports = {
    name: 'duty',
    desc: 'Przełącz powiadomienie z kanałów pomocy.',
    run: async msg => {

        if(msg.channel.id != modChannel) return;

        if(getPermLvl(msg.member.roles.cache) < support) return msg.channel.send('Nie masz uprawnień.');
        
        const { roles } = msg.member;
        if(roles.cache.has(supportRole)) {
            await roles.remove(supportRole);
            return msg.channel.send('Powiadomienie z kanałów pomocy **wyłączone**.');
        }
        else {
            await roles.add(supportRole);
            return msg.channel.send('Powiadomienie z kanałów pomocy **włączone**.');
        }

    }
}