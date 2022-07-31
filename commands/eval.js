var { SlashCommandBuilder, codeBlock } = require('discord.js');
var Utility = require('../libs/Utility');
var Slash = require('../libs/Slash');
const { default: fetch } = require('node-fetch');

var Command = new Slash(
    {
        name: "eval",
        allowedUser: process.env.OWNER,
        builder: new SlashCommandBuilder().setDescription("🔧 Execute code").addStringOption(code => code.setName("code").setDescription("👨‍💻 Javascript Code").setRequired(true)),
        executor: async (Interaction, Client) => {
            
            /**
             * @type {String}
             */
            var code = Interaction.options.get("code").value??"null";
            var PastebinPrefix = "pastebin:";
            var URLPrefix = "url:";
            var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36";

            try {

                if(code.startsWith(PastebinPrefix)) {
                    var pastebinCode = code.slice(PastebinPrefix.length);
                    var url = "https://pastebin.com/raw/" + pastebinCode;
                    code = await (await fetch(url, { headers: { "user-agent": UA } })).text();
                };

                if(code.startsWith(URLPrefix)) {
                    var url = code.slice(URLPrefix.length);

                    code = await (await fetch(url, { headers: { "user-agent": UA } })).text();
                };



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