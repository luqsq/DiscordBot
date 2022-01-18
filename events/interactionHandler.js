module.exports = {
    event: 'interactionCreate',
    run: async (client, mysql, ia) => {
        if(!ia.isButton()) return;
        const args = ia.customId.split('_');
        const interaction = client.interactions.get(args.shift());
        if(interaction) interaction.run(ia, args, client, mysql);
    }
}
