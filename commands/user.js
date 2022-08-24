var { SlashCommandBuilder, time, inlineCode } = require('discord.js');
var Package = require('../package.json');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');

var Command = new Slash(
    {
        name: "user",
        builder: new SlashCommandBuilder().setDescription("🤔 User informations").addUserOption(user => user.setName("user").setDescription("👤 User").setRequired(true)),
        executor: (Interaction, Client) => {

            var user = Interaction.options.get("user")??"null";
            var badges = []; //🏅 Get user badges array

            const supportServer = Client.guilds.cache.find(Guild => Guild.id == "1002671491827122187"); //🌍 Get a support guild
            const member = supportServer.members.cache.find(Member => Member.id == user.id); //👤 Get member

            if(member){
                member.roles.cache.forEach(Role => {
                    if(Role.id == "1010510723518046259") badges.push("🌍") //👤 User role
                    if(Role.id == "1008305977512173681") badges.push("✅") //✅ Verified role
                    if(Role.id == "1010509152679907388") badges.push("😎") //😎 Friend role
                    if(Role.id == "1008306774388002926") badges.push("🛠") //🛠 Staff role
                    if(Role.id == "1002861411887747094") badges.push("💻") //💻 Dev role

                })
            }

            // 💭 Send message
            Interaction.reply({ 
                ephemeral: false,
                embeds: [
                    Utility.Embed(Client)
                       .setAuthor({ name: Client.user.tag, iconURL: Client.user.displayAvatarURL({ forceStatic: false }) })
                       .setTitle(user.tag + "'s info")
                       .setDescription([ // 👌 Too lazy to change this, so simple .map and .join 🤪
                            { name: "🪪 ID", value: user.id.toString() },
                            { name: "🏅 Badges", value: badges.join("; ") },
                       ].map(e => e.name + "\n - " + e.value).join("\n"))
                ]
             })

        }
    }
)

module.exports = Command;
