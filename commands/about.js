var { SlashCommandBuilder, time, inlineCode } = require('discord.js');
var Package = require('../package.json');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');

var Command = new Slash(
    {
        name: "about",
        builder: new SlashCommandBuilder().setDescription("🤔 Some information about this bot"),
        executor: (Interaction, Client) => {

            // 💾 Get platform on what is running bot
            var { platform } = process;

            // 🧱 Get used memory etc.
            var Memory = process.memoryUsage();
            var MemoryUsed = Memory.heapUsed;
            var MemoryTotal = Memory.heapTotal;
            var MemoryPercentage = Math.round(MemoryUsed/MemoryTotal * 100);

            // ⌚ Calculate uptime
            var Uptime = new Date().getTime() - process.uptime();

            // 💻 Calculate to unix time and format
            var UptimeFormatted = time(Math.round(Uptime/1000), "R");

            // 💭 Send message
            Interaction.reply({ 
                ephemeral: false,
                embeds: [
                    Utility.Embed(Client)
                       .setAuthor({ name: Client.user.tag, iconURL: Client.user.displayAvatarURL({ forceStatic: false }) })
                       .setDescription([ // 👌 Too lazy to change this, so simple .map and .join 🤪
                            { name: "🍃 Node.JS", value: inlineCode(process.version) },
                            { name: "💻 Platform", value: inlineCode( platform[0].toUpperCase() + platform.slice(1) ) },
                            { name: "⏳ Started", value: UptimeFormatted },
                            { name: "🧱 Memory Usage", value: inlineCode(MemoryPercentage + "%") },
                            { name: "🔗 Support Server", value: "https://discord.gg/vwBAZR2RTJ" },
                            { name: "🌍 Servers", value: Client.guilds.cache.size.toString()}
                       ].map(e => e.name + "\n - " + e.value).join("\n"))
                ]
             })

        }
    }
)

module.exports = Command;
