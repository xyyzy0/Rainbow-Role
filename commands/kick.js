var { SlashCommandBuilder, codeBlock, PermissionFlagsBits } = require('discord.js');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');
const { default: fetch } = require('node-fetch');

var Command = new Slash(
    {
        name: "kick",
        permissions: PermissionFlagsBits.KickMembers,
        builder: new SlashCommandBuilder().setDescription("🦵 Kick member").addUserOption(user => user.setName("user").setDescription("👤 User to kick").setRequired(true)).addStringOption(reason => reason.setName("reason").setDescription("📖 Kick Reason").setRequired(true)),
        executor: async (Interaction, Client) => {
            var user = Interaction.options.getUser("user")??"null";
            var reason = Interaction.options.get("reason").value??"No reason provided";

            // 🤖 Get bot's member instance on this guild
            var { me } = guild.members;


            // 🔐 Check if bot have permissions to kick members
            if(!me.permissions.has("KickMembers")) {

                    // 💭 Send message
                    Interaction.reply({
                        embeds: [
                            Utility.Embed(Client)
                                .setDescription("❌ Bot doesn't have permissions to kick members")
                        ]
                    });

                    return;

            };

          //👤 Get member to kick
          var member = guild.members.cache.find(Member => Member.id == user.id);

          //🍃 Check member exists
          if(!member){

                 // 💭 Send message
                 Interaction.reply({
                     embeds: [
                         Utility.Embed(Client)
                             .setDescription("❌ Couldn't find this member")
                     ]
                });
           }

          //🦵 Check the member is kickable
          if(!member.kickable){

                // 💭 Send message
                Interaction.reply({
                     embeds: [
                         Utility.Embed(Client)
                             .setDescription("❌ Couldn't kick this member")
                     ]
                });

         //🦵 Kick the member
         member.kick({reason})

            Interaction.reply({
                embeds: [
                    Utility.Embed(Interaction.member.user)
                        .setTitle("Kick")
                        .setDescription(member.user.tag + " was kicked by " + Interaction.member.user + " with reason: " + reason)
                ]
            })
}
            }
    })

module.exports = Command;
