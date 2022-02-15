const { request } = require('http');
const { getEmbed } = require('../../utils.js');

module.exports = {
    name: 'shiba',
    desc: 'Zobacz losowe zdjęcię shiby.',
    run: msg => {
        const req = request({
            hostname: 'shibe.online',
            port: 80,
            path: '/api/shibes',
            method: 'GET'
        }, res => {
            res.on('data', d => {
                msg.channel.send({embeds:[
                    getEmbed(msg.member).setTitle('Shiba').setImage(JSON.parse(d.toString('utf-8'))[0])
                ]});
            });
        });
        req.on('error', e => {
            msg.channel.send('Wystąpił błąd.');
        });
        req.end();
    }
}