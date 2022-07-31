var Discord = require('discord.js');

/**
 * Embed
 * @param {Discord.User} User[]
 */
function Embed(User) {
    var embed = new Discord.EmbedBuilder();
    embed.setColor(3092790);

    if(User.user) {
        User = User.user;
    };    

    if(User && !User.token) {
        embed.setFooter({
            iconURL: User.displayAvatarURL({ forceStatic: false }),
            text: User.tag 
        });
    } else if(User.token) {
        embed.setFooter({
            iconURL: User.user.displayAvatarURL(),
            text: User.user.tag
        });
    };

    return embed;
};

/**
 * Check if user is bot Owner
 * @param {String} ids User ID or IDS
 */
function isOwner(ids){
    return ids.includes(process.env.OWNER);
};


module.exports = { isOwner, Embed };