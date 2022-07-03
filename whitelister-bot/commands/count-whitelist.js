module.exports = {
    name: "count-whitelist",
    type: "CHAT_INPUT",
    usage: "/count-whitelist",
    description: "Count all whitelisted addresses.",
    adminOnly: true,
    run: async ({ get, interaction, config }) => {

        const serverData = get(interaction.guild.id);

        if (!serverData || !Object.keys(serverData).filter((elem) => elem !== "role" && elem !== "channel").length) return interaction.reply({ content: config.messages.noWhitelistedAddress, ephemeral: true });

        const results = Object.values(serverData).filter((obj) => !Array.isArray(obj));

        if (!results.length) return interaction.reply({ content: config.messages.notEnoughResults, ephemeral: true });

        return interaction.reply({ embeds: [{
            color: "BLURPLE",
            description: config.messages.countAll.replace("<count>", results.length)
        }], ephemeral: true });
    }
}