module.exports = {
    name: "setup",
    type: "CHAT_INPUT",
    usage: "/setup <channel> <role> <secondchannel> <secondrole>",
    description: "Setup everything :-)",
    options: [{
        name: "channel",
        description: "Channel where users can use the whitelist command.",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
        required: true
    }, {
        name: "role",
        description: "Role which the users need for using the command.",
        type: "ROLE",
        required: true
    }, {
        name: "secondchannel",
        description: "Optional secondary channel where users can use the whitelist command.",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
        required: false
    }, {
        name: "secondrole",
        description: "Optional secondary role which the users need for using the command.",
        type: "ROLE",
        required: false
    }],
    run: async ({ set, interaction }) => {

        const firstChannel = interaction.options.getChannel("channel"), 
        firstRole = interaction.options.getRole("role"),
        secondChannel = interaction.options.getChannel("secondchannel"),
        secondRole = interaction.options.getRole("secondrole");

        const dataObj = { channel: [firstChannel.id], role: [firstRole.id] };

        if (secondChannel) dataObj.channel.push(secondChannel.id);
        if (secondRole) dataObj.role.push(secondRole.id);

        set(interaction.guild.id, dataObj);

        return interaction.reply({ embeds: [{
            color: "BLURPLE",
            title: "Setup completed ✅",
            description: `Channel: <#${firstChannel.id}>\nRole: <@&${firstRole.id}>\nSecond channel: ${secondChannel ? "<#" + secondChannel.id + ">" : "**Null**"}\nSecond role: ${secondRole ? "<@&" + secondRole.id + ">" : "**Null**"}`,
            footer: { text: `Requested by ${interaction.user.id}` },
            timestamp: new Date()
        }], ephemeral: true });
    }
}