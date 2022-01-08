const yts = require('yt-search');

module.exports = {
    name: 'youtube',
    usage: '<tekst>',
    desc: 'Szuka filmu w serwisie YouTube.',
    run: async (msg, args, client) => {
        if(args.length == 0) return msg.channel.send(`Brak wyszukiwanej frazy.\nUżycie: \`${client.prefix}youtube <tekst>\``);
        msg.channel.send((await yts({ query: args.join(' ') })).videos[0].url);
    }
}