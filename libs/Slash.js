var Discord = require('discord.js');
const { QuickDB } = require('quick.db'); 

// Don't ask why ok
class DiscordClient extends Discord.Client { 
    constructor(){

        /**
         * @type {Discord.Collection}
         */
        this.Commands;

        /**
         * @type {QuickDB}
         */
        this.db;
        
        

    }
};

/**
* Command Executor
* @param {Discord.Interaction} Interaction 
* @param {Discord.GuildMember} Member 
* @param {DiscordClient} Client 
*/
function Execute(Interaction, Client, Member){};

class SlashCommand {
    /**
     * Create Slash Command
     * @param {{ builder: Discord.SlashCommandBuilder, name: String, executor: Execute, allowedUser: []|null, permissions: Array<String> }} o
     */
    constructor(o) {
        
        if(o.builder) {
            o.builder.setName(o.name); // Set Name
            o.builder.setDMPermission(false) // No, you can't use this bot's slash commands in dm's
            
            // Check if key 'permissions' exists in object
            if(o.permissions) {
                o.builder.setDefaultMemberPermissions(o.permissions); // Set permissions required by command
            };
        };

        this.builder = o.builder;
        this.name = o.name;
        this.executor = o.executor;
        this.AllowedUser = o.allowedUser??[];

    };
};

module.exports = SlashCommand;