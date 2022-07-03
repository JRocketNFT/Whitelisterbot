module.exports = {
    name: "clear",
    type: "CHAT_INPUT",
    usage: "/clear <user>",
    description: "Clear a single user",
    options: [{
        name: "user",
        description: "Clear a single user address",
        type: "USER",
        required: true
    }],
    adminOnly: true,
    run: async ({ get, set, interaction, config }) => {

        const serverData = get(interaction.guild.id);

        if (!serverData || !Object.keys(serverData).filter((elem) => elem !== "role" && elem !== "channel").length) return interaction.reply({ content: config.messages.noWhitelistedAddress, ephemeral: true });

        const user = interaction.options.getUser("user");

        if (!serverData[user.id]) return interaction.reply({ embeds: [{
            color: "RED",
            description: config.messages.userNotFound
        }], ephemeral: true });

        set(interaction.guild.id, { [user.id]: null });

        return interaction.reply({ embeds: [{
            color: "RED",
            description: config.messages.deletedTheUser
        }], ephemeral: true });
    }
}