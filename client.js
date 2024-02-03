const { Client, Collection } = require("discord.js");
const { readdirSync } = require('node:fs')

class Bot extends Client {
    constructor() {
        super({
            intents: [
                'Guilds',
                'GuildMembers',
                'GuildMessages',
                'MessageContent',
                'GuildMessageReactions'
            ]
        })

        this.commands = new Collection()
        this.config = require('../config.json')
    }

    async init(token) {
        if (!token) return console.error("Bot token is empty! Make sure to fill this out in config.js");

        readdirSync('./commands').map(async cmd => {
            this.commands.set(cmd.split(".")[0], require(`../commands/${cmd}`))
        })

        readdirSync('./events').map(async file => {
            this.on(file.split(".")[0], require(`../events/${file}`).bind(null, this));
        })

        this.login(token);
    }
}

module.exports = Bot;