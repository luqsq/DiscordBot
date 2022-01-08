const { find } = require('weather-js');
const { getEmbed } = require('../../utils.js');

const weather = [
    'Burza z piorunami',
    'Burza z piorunami',
    'Burza z piorunami',
    'Burza z piorunami',
    'Burza z piorunami',
    'Śnieg z deszczem',
    'Śnieg z deszczem',
    'Śnieg z deszczem',
    'Lodowato',
    'Lodowato',
    'Śnieg z deszczem',
    'Przelotne opady',
    'Deszczowo',
    'Przelotny śnieg',
    'Opady śniegu',
    'Burza śnieżna',
    'Opady śniegu',
    'Burza z piorunami',
    'Przelotne opady',
    'Dust',
    'Mgła',
    'Niewielka mgła',
    'Niewielka mgła',
    'Wietrznie',
    'Wietrznie',
    'Lodowato',
    'Pochmurno',
    'Częściowo pochmurno',
    'Częściowo pochmurno',
    'Częściowo pochmurno',
    'Częściowo pochmurno',
    'Słonecznie',
    'Słonecznie',
    'Częściowo pochmurno',
    'Częściowo pochmurno',
    'Burza z piorunami',
    'Gorąco',
    'Możliwe burze',
    'Możliwe burze',
    'Możliwe deszcze',
    'Przelotne opady',
    'Możliwy śnieg',
    'Opady śniegu',
    'Opady śniegu',
    'Brak danych',
    'Możliwe deszcze',
    'Możliwy śnieg',
    'Możliwe burze'
]

module.exports = {
    name: 'pogoda',
    usage: '<miejscowość>',
    desc: 'Wyświetla informacje o pogodzie.',
    run: (msg, args, client) => {
        if(args.length == 0) return msg.channel.send(`Nie wpisano miasta.\nUżycie: \`${client.prefix}pogoda <miejscowość>\``);
        find({ search: args.join(' '), degreeType: 'C' }, (error, result) => {
            if(error) return msg.channel.send('Wystąpił błąd.');
            if(result.length == 0) return msg.channel.send('Nic nie znaleziono.');
            msg.channel.send({embeds:[
                getEmbed(msg.member)
                .setTitle(`Pogoda dla ${result[0].location.name.replace('Warsaw', 'Warszawa').replace('Cracow', 'Kraków').replace('Poland', 'Polska')}`)
                .addField('Temp.', `${result[0].current.temperature}°C`, true)
                .addField('Odczuwalne', `${result[0].current.feelslike}°C`, true)
                .addField('Wilgotność', `${result[0].current.humidity}%`, true)
                .addField('Wiatr', result[0].current.windspeed, true)
                .addField('Pogoda', weather[result[0].current.skycode], true)
                .setThumbnail(result[0].current.imageUrl)
            ]});
        })
    }
}