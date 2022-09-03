var { SlashCommandBuilder, codeBlock } = require('discord.js');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');
const { default: fetch } = require('node-fetch');

var Command = new Slash(
    {
        name: "embed",
        permissions: PermissionFlagsBits.ManageMessages,
        builder: new SlashCommandBuilder().setDescription("🗞 Send Embed").addStringOption(title => title.setName("title").setDescription("🏅 Embed title").setRequired(true)).addStringOption(description => description.setName("description").setDescription("🍃 Embed description").setRequired(true)),
        executor: async (Interaction, Client) => {
            var title = Interaction.options.get("title").value??"null";
            var description = Interaction.options.get("description").value??"null";
            Interaction.reply({
                embeds: [
                    Utility.Embed(Interaction.member.user)
                        .setTitle(title)
                        .setDescription(description)
                ]
            })

            }
    }
)

module.exports = Command;
