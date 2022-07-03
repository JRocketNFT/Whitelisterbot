const { Formatters: { codeBlock } } = require("discord.js");

module.exports = {
    name: "wl",
    type: "CHAT_INPUT",
    usage: "/wl <address>",
    description: "Whitelist yourself or get whitelisted address.",
    options: [{
        name: "address",
        description: "Address you want to whitelist",
        type: "STRING",
        required: false
    }],
    run: async ({ get, set, interaction, config }) => {

        const serverData = get(interaction.guild.id);

        if (!serverData) return interaction.reply({ content: config.messages.setChannelAndRole, ephemeral: true });
        if (!serverData.channel.some((el) => el === interaction.channel.id)) return interaction.reply({ content: serverData.channel.length > 1 ? config.messages.wrongChannelMultiple.replace("<channel1>", `<#${serverData.channel[0]}>`).replace("<channel2>", `<#${serverData.channel[1]}>`) : config.messages.wrongChannel.replace("<channel>", `<#${serverData.channel[0]}>`), ephemeral: true });
        if (!serverData.role.some((el) => interaction.member.roles.cache.has(el))) return interaction.reply({ content: serverData.role.length > 1 ? config.messages.noSetRoleMultiple.replace("<role1>", `<@&${serverData.role[0]}>`).replace("<role2>", `<@&${serverData.role[1]}>`) : config.messages.noSetRole.replace("<role>", `<@&${serverData.role[0]}>`), ephemeral: true });

        const address = interaction.options.getString("address", false);

        if (!address) {
            if (!serverData[interaction.user.id]) return interaction.reply({ content: config.messages.addressNotFound, ephemeral: true });
            return interaction.reply({ embeds: [{
                color: "BLURPLE",
                description: `${config.messages.hereYourAddress}\n${codeBlock("javascript", serverData[interaction.user.id])}`
            }], ephemeral: true });
        };

        if (address.length < 5) return interaction.reply({ content: config.messages.invalidAddress, ephemeral: true });

        set(interaction.guild.id, { [interaction.user.id]: address });

        return interaction.reply({ embeds: [{
            color: "BLURPLE",
            description: `${config.messages.hereYourAddress}\n${codeBlock("javascript", address)}`
        }], ephemeral: true });
    }
}