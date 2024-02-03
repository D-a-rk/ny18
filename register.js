const { readdirSync } = require("node:fs");
const path = require('path')
const { REST, Routes } = require('discord.js');
const { client_token, client_id } = require('./config.json')

const commands = []

readdirSync("./commands/").map(async cmd => {
    commands.push(require(path.join(__dirname, `./commands/${cmd}`)).data.toJSON())
})

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
    try {
      await rest.put(Routes.applicationCommands(client_id), { body: commands });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.log(error)
    }
})();