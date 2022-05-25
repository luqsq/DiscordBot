const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { createPool } = require('mysql2/promise');
const { schedule } = require('node-cron');

require('dotenv').config();
const { env } = process;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    presence: {
        activities: [{
            name: '!komendy'
        }]
    }
});

var mysql;
(async () => {

    mysql = await createPool({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

})();

client.prefix = '!';
client.commands = new Collection();
client.aliases = new Collection();
readdirSync('./commands').forEach(folder => {
    readdirSync(`./commands/${folder}`).forEach(file => {
        const cmd = require(`./commands/${folder}/${file}`);
        cmd.type = folder;
        client.commands.set(cmd.name, cmd);
        if(cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name));
    });
});

client.interactions = new Collection();

readdirSync('./interactions').forEach(file => {
    const ia = require(`./interactions/${file}`);
    client.interactions.set(ia.name, ia);
});

client.tempbans = new Collection();

readdirSync('./events').forEach(file => {
    const event = require(`./events/${file}`);
    client.on(event.event, (p1, p2) => event.run(client, mysql, p1, p2));
});

readdirSync('./cron').forEach(file => {
    const cron = require(`./cron/${file}`);
    schedule(cron.schedule, () => cron.run(client, mysql));
});

client.login(env.TOKEN);