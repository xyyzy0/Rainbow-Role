const Discord = require('discord.js'); // 💾 Load discord.js module
const { config } = require('dotenv'); // 🦈 Load dotenv's module config function
const fs = require('fs'); // 📁 Load default node.js File System module
const { default: chalk } = require('chalk') // 🎨 Load chalk for console colors
const { QuickDB } = require('quick.db'); // 📠 Load database module

// 📚 Load Libs
const Logger = require('./libs/Logger')
const Utility = require('./libs/Utility');
const registerSlashes = require('./libs/RegisterSlashes');

// 💖 Load Environment 
config();

// 🧱 Create Client Instance
var Client = new Discord.Client({ intents: [ "Guilds" ] });

// 💌 Define commands collection map and database
Client.Commands = new Discord.Collection();
Client.db  = new QuickDB({ filePath: "./Rainbow-Role.sqlite" });

// 🏃‍♀️ Run function when bot is ready
Client.on('ready', async () => {
    console.clear();
    Logger.INFO("Welcome! Your bot " + chalk.yellow(Client.user.tag) + " is now ready to work!");

    // 💳 Register all bot's slash commands
    await registerSlashes(Client, { global: true, guild: "991088591201517600" });
    Logger.INFO("Registeried all slash commands.")
    
    // ⭐ Set bot's activity 
    Client.user.setActivity({
        type: Discord.ActivityType.Watching,
        name: "🌈 Rainbow"
    });

    // 🌈 Rainbow roles

    /**
     * Update Rainbow Roles
     */
    async function updateRainbowRoles() {
        var Roles = await Client.db.get("RainbowRole")??{};
        var color = "#" + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6); // TODO: Smooth rgb color transistion
        global.color = color; // 🎨 Just to make this global

        Logger.INFO("Got " + chalk.yellow(Object.keys(Roles).length) + " guilds with rainbow role " + chalk.cyanBright("|") + " New Color: " + chalk.hex(color)(color))

        for (const GuildID in Roles) {
            const Entry = Roles[GuildID];

            // 🏫 Get guild from bot's cache
            var Guild = Client.guilds.cache.get(GuildID);

            // 🎍 Check if guild exists
            if(!Guild) {

                // 🤔 Remove guild's rainbow role from database
                Client.db.delete("RainbowRole." + GuildID);
                Logger.ERR("Removed unknown guild " + chalk.yellow(Entry.guildName??"Unknown") + " with ID " + chalk.yellow(GuildID??"Unknown") + " from rainbow roles database.")
                
                return;
            };

            // 🎉 Find role in guild by id from cache
            var Role = Guild.roles.cache.get(Entry.roleId);
            
            // 🎊 Check if role exists
            if(!Role) {
                Logger.WARN("Failed to get rainbow role role from guild " + chalk.yellow(Entry.guildName??"Unknown") + " with ID " + chalk.yellow(GuildID??"Unknown"));
                
                return;
            };

          try {

            // 🎨 Edit rainbow role color
            await Role.edit({ color });
          }catch(err) {
            Logger.ERR("Failed changing rainbow role color for guild " + chalk.yellow(Entry.guildName??"Unknown") + " with ID " + chalk.yellow(GuildID??"Unknown"))
          };

        };

    };
    
    // 🌠 Update rainbow roles on bot start
    updateRainbowRoles();

    // ⌛ Update rainbow roles every 15 minutes
    setInterval(updateRainbowRoles, 60000 * 15);

});

// ✅ Load Commands 
fs.readdirSync("commands") // 📂 Get all files from folder 
   .filter(e => e.endsWith(".js")) // 📝 Check if file ends with ".js" 
   .map(e => require("./commands/" + e)) // 🤔 Get command, and maybe your mom too 
   .forEach(e => Client.Commands.set(e.name, e)); // 🗿 Add command to map 


// 🏠 Run function when bot was added to guild
Client.on("guildCreate", async Guild => {
    Logger.INFO("🏭 Someone added bot to guild!");
    Logger.INFO("   - Name: " + Guild.name);
    Logger.INFO("   - ID: " + Guild.id);
    Logger.INFO("   - Owner ID: " + Guild.ownerId);

    var SystemChannel = Guild.systemChannel; // 💻 Get guild's system channel
    var { me } = Guild.members; // 🤖 Get bot's member instance on this guild

    // 💻🔍 Check if guild's system channel exists
    if(!SystemChannel) {
        return;
    };

    // 📝❔ Check if bot have permissions to view channel and send messages on system channel
    if(!me.permissionsIn(SystemChannel).has([ "ViewChannel", "SendMessages" ])) {
        return;
    };

    // 👋 Send welcome message to system channel
    SystemChannel.send({
        embeds: [
            Utility
               .Embed(Client.user)
               .addFields({ name: "Hi!", value: "Thank you for adding our bot to your server 👋\nThe bot was created to enable the creation of rainbow roles! 🌈" })                
        ]
    });

});

// 😘 Run function when someone send interaction to application
Client.on("interactionCreate", Interaction => {

    // 📝 Check if current interaciton is slash command
    if(Interaction.type != Discord.InteractionType.ApplicationCommand) {
        return;
    };

    // 🙄 Check if command exists
    if(!Client.Commands.has(Interaction.commandName)) {
        return Interaction.reply({ ephemeral: true, embeds: [ Embed(Interaction.user).setDescription("Really... I don't know how, but command was not found.") ] });
    };

    // 🎈 Get command by name from Map
    var Command = Client.Commands.get(Interaction.commandName);

    // 🤷 I don't know what I can write here, so just ignore this comment please
    if(!Interaction.member) {
        Interaction.member = Interaction.user;
    };
    
    // 📜 Check if array's length of allowed users doesn't equals 0
    if(Command.AllowedUser.length >= 1) {

        // ✅ Check if user is allowed to use this command
        if(!Command.AllowedUser.includes(Interaction.user.id)) {

            Logger.INFO("User " + chalk.yellow(Interaction.user.tag) + " is not allowed to use command " + chalk.yellow(Interaction.commandName));
            return Interaction.reply({ ephemeral: true, embeds: [ Utility.Embed(Interaction.user).setDescription("Sorry! You are not allowed to use this command!") ] });
        
        } else { // 😍 User is allowed to use command
            
            Logger.INFO("User " + chalk.yellow(Interaction.user.tag) + " used command " + chalk.yellow(Interaction.commandName) + " on " + chalk.yellow(Interaction.guild.name));            
            
            // 💉 Execute command's function
            return Command.executor(Interaction, Client, Interaction.member);
        };
    };

    Logger.INFO("User " + chalk.yellow(Interaction.user.tag) + " used command " + chalk.yellow(Interaction.commandName) + " on " + chalk.yellow(Interaction.guild.name));            
    
    // 💉 Execute command's function
    return Command.executor(Interaction, Client, Interaction.member);
})

// 💕 Login With Token From Environment
Client.login(process.env.TOKEN);