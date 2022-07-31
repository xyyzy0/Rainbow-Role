var { SlashCommandBuilder, codeBlock } = require('discord.js');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');

var Command = new Slash(
    {
        name: "eval",
        allowedUser: process.env.OWNER,
        builder: new SlashCommandBuilder().setDescription("🔧 Execute code").addStringOption(code => code.setName("code").setDescription("👨‍💻 Javascript Code").setRequired(true)),
        executor: (Interaction, Client) => {
            var code = Interaction.options.get("code").value??"null";

            try {
                var res = eval(code);
                
                if(typeof(res) === "object") {
                    res = JSON.stringify(res);
                };

                Interaction.reply({
                    embeds: [
                        Utility.Embed(Client)
                            .setAuthor({ name: "📤 Code" })
                            .setDescription(codeBlock("js", new String(code))),
                        Utility.Embed(Client)
                            .setAuthor({ name: "📥 Response" })
                            .setDescription("```js\n" + res + "```"),
                    ]
                })

            }catch(err){
                Interaction.reply({
                    ephemeral: true,
                    embeds: [
                        Utility.Embed(Client)
                            .setAuthor({ name: "📤 Code" })
                            .setDescription(codeBlock("js", code)),
                        Utility.Embed(Client)
                        .setAuthor({ name: "🛑 Error" })
                        .setDescription(codeBlock("bash", err))
                    ]
                })
            }

        }
    }
)

module.exports = Command;