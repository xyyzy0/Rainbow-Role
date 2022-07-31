const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord = require('discord.js');


/**
 * Register Slash Commands
 * @param {Discord.Client} Client
 * @param {{ global: Boolean, guild: String|null }} Options
 */
async function Register(Client, Options) {
    var Rest = new REST({ version: 9 }).setToken(Client.token);
    var body = Array.from(Client.Commands.values()).map(e => e.builder);

    if(Options.global) {
        await Rest.put(Routes.applicationCommands(Client.user.id), { body });
    } else if (!Options.global && Options.guild) {
        await Rest.put(Routes.applicationGuildCommands(Client.user.id, Options.guild), { body });
    };
};

module.exports = Register;