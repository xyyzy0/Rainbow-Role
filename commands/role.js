var { SlashCommandBuilder, time, inlineCode, PermissionFlagsBits, roleMention } = require('discord.js');
var Package = require('../package.json');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');
var Command = new Slash("ping");


var Command = new Slash(
    {
        name: "role",
        permissions: PermissionFlagsBits.ManageRoles,
        builder: new SlashCommandBuilder()
                        .setDescription("🌈 Manage your rainbow role")
                        .addSubcommand(function(Subcommand) {
                            return Subcommand
                                     .setName("set")
                                     .setDescription("Set what role do you want to be rainbow role 🌈")
                                     .addRoleOption(Role => Role.setName("role").setDescription("Rainbow Role").setRequired(true));                            
                        })
                        .addSubcommand(function(Subcommand) {
                            return Subcommand
                                     .setName("reset")
                                     .setDescription("Reset your rainbow role, making it no longer rainbow 🏳")
                        }),
        executor: async (Interaction, Client, Member) => {
            
            // 🏠🎫 Get guild and subcommand name
            var { guild, options: { _subcommand } } = Interaction;

            // 🤖 Get bot's member instance on this guild
            var { me } = guild.members;
            
            // 🎁 Check if subcommand equals "set"
            if(_subcommand == "set") {
                
                // 🎉 Get role
                var Role = Interaction.options.get("role").role;

                // 🤖🎊 Get bot's role or highest role
                var HighestRole = me.roles.botRole??me.roles.highest;

                // 🔐 Check if bot have permissions to edit roles, remove roles etc.
                if(!me.permissions.has("ManageRoles")) {

                     // 💭 Send message
                    Interaction.reply({
                        embeds: [
                            Utility.Embed(Client)
                                .setDescription("❌ Bot doesn't have permissions to edit roles")
                        ]
                    });

                    return;
                };

                // 🔑 Check the highest role or bot role the bot has
                if(HighestRole.position < Role.position) {

                    // 💭 Send message
                    Interaction.reply({
                        embeds: [
                            Utility.Embed(Client)
                                .setDescription("🛑 Please move the " + roleMention(Role.id) + " role above the " + roleMention(HighestRole.id))
                        ]
                    });

                    return;
                };

                // 👥 Remember! @everyone role is not allowed to use as rainbow role!
                // 👥 Remember! Bots roles are not allowed to use as rainbow role!
                if(Role.id == guild.id || typeof(Role.tags?.botId) === "string") {

                    // 💭 Send message
                    Interaction.reply({
                        ephemeral: true,
                        embeds: [
                            Utility.Embed(Client)
                                .setDescription("🤔 Sorry, but you can't use " + roleMention(Role.id) + " as rainbow role")
                        ]
                    });

                    return;
                };

                try {
                    await guild.roles.edit(Role, { color });
                    await Client // 🧱 Client instance
                             .db // 🔓 Access database
                             .set("RainbowRole." + guild.id, { guildName: guild.name, setDate: new Date(), roleId: Role.id }); // 📨 Set value in database

                    // 💭 Send message
                    Interaction.reply({
                        embeds: [ Utility.Embed(Member).setDescription("🌈 Successfully set role " + roleMention(Role.id) + " as rainbow role") ]
                    })

                } catch(err) {

                    // 💭 Send message
                    Interaction.reply({
                        ephemeral: true,
                        embeds: [ Utility.Embed(Client).setDescription("🎯 Something went wrong!") ]
                    });
                };
            }; // <--- Set Subcommand


            // ✒️ Remove rainbow role for current guild
            if(_subcommand === "reset") {
                try {

                    if(!(await Client.db.get("RainbowRole"))[guild.id]) {
                        Interaction.reply({
                            ephemeral: true,
                            embeds: [ Utility.Embed(Client).setDescription("⛔ This server doesn't have a rainbow role") ]
                        });

                        return;
                    };

                    await Client // 🧱 Client instance
                             .db // 🔓 Access database
                             .delete("RainbowRole." + guild.id) // 🧹 Remove key from database

                    // 💭 Send message
                    Interaction.reply({
                        embeds: [ Utility.Embed(Member).setDescription("🏳 From now, this server does not have rainbow role") ]
                    })

                    
                } catch(err) {

                    // 💭 Send message
                    Interaction.reply({
                        ephemeral: true,
                        embeds: [ Utility.Embed(Client).setDescription("🎯 Something went wrong!") ]
                    });
                };

                return;
            };
        }
    }
)

module.exports = Command;