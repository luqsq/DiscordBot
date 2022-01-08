const { getEmbed } = require('../../utils.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'glosowanie',
    hidden: true,
    run: async (msg, args, client) => {
        if(!msg.member.roles.highest.name.includes('Admin')) return msg.channel.send('Nie masz uprawnień.');
        if(!args[0]) return msg.channel.send(`Podaj czas głosowania (w sekundach).\nUżycie: \`${client.prefix}glosowanie <czas> <pytanie>\``);
        if(!args[1]) return msg.channel.send(`Podaj treść głosowania.\nUżycie: \`${client.prefix}glosowanie <czas> <pytanie>\``);

        const like = "👍";
        const unlike = "👎";
        const time = parseInt(args[0]);
        if(isNaN(time)) return msg.channel.send(`Podaj poprawny czas głosowania (w sekundach).\nUżycie: \`${client.prefix}glosowanie <czas> <pytanie>\``);

        const msgVote = await msg.channel.send({
            embeds: [
                getEmbed(msg.member).setTitle('Głosowanie')
                .addField('Pytanie', args.slice(1).join(' '))
                .addField('Czas', `${time} sek.`)
            ]
        });
        await msg.delete();
        msgVote.react(like);
        msgVote.react(unlike);

        const filter = r => r.emoji.name == like || r.emoji.name == unlike;
        const reactions = await msgVote.awaitReactions({ filter, time: time*1000 });

        let likeCount = 0;
        let unlikeCount = 0;

        if(reactions.get(like)) likeCount = reactions.get(like).count - 1;
        if(reactions.get(unlike)) unlikeCount = reactions.get(unlike).count - 1;

        const embed = new MessageEmbed().setTitle('Głosowanie zakończone').setTimestamp();

        if(likeCount == 0 && unlikeCount == 0) return msg.channel.send({embeds:[embed.setColor('ffcd01').setDescription('Nikt nie zagłosował.')]});

        msg.channel.send({embeds:[embed.setColor(likeCount > unlikeCount ? '46ff46' : (likeCount < unlikeCount ? 'ff4646' : 'ffcd01')).setDescription(`${like} - **${likeCount}** / ${unlike} -  **${unlikeCount}**`)]});

    }
}