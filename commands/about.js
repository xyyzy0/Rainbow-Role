var { SlashCommandBuilder, time, inlineCode } = require('discord.js');
var Package = require('../package.json');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');

// â Calculate uptime
var Uptime = new Date().getTime() - process.uptime();

// ðŧ Calculate to unix time and format
var UptimeFormatted = time(Math.round(Uptime/1000), "R");

var Command = new Slash(
    {
        name: "about",
        builder: new SlashCommandBuilder().setDescription("ðĪ Some information about this bot"),
        executor: (Interaction, Client) => {

            // ðū Get platform on what is running bot
            var { platform } = process;

            // ð§ą Get used memory etc.
            var Memory = process.memoryUsage();
            var MemoryUsed = Memory.heapUsed;
            var MemoryTotal = Memory.heapTotal;
            var MemoryPercentage = Math.round(MemoryUsed/MemoryTotal * 100);

            // ð­ Send message
            Interaction.reply({ 
                ephemeral: false,
                embeds: [
                    Utility.Embed(Client)
                       .setAuthor({ name: Client.user.tag, iconURL: Client.user.displayAvatarURL({ forceStatic: false }) })
                       .setDescription([ // ð Too lazy to change this, so simple .map and .join ðĪŠ
                            { name: "ð Node.JS", value: inlineCode(process.version) },
                            { name: "ðŧ Platform", value: inlineCode( platform[0].toUpperCase() + platform.slice(1) ) },
                            { name: "âģ Started", value: UptimeFormatted },
                            { name: "ð§ą Memory Usage", value: inlineCode(MemoryPercentage + "%") },
                            { name: "ð Support Server", value: "https://discord.gg/vwBAZR2RTJ" },
                            { name: "ð Servers", value: inlineCode( Client.guilds.cache.size.toString() )}
                       ].map(e => e.name + "\n - " + e.value).join("\n"))
                ]
             })

        }
    }
)

module.exports = Command;
