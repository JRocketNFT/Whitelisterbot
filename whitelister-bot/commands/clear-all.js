const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "clear-all",
    type: "CHAT_INPUT",
    usage: "/clear-all",
    description: "Clear all users addresses",
    adminOnly: true,
    run: async ({ set, get, interaction, config }) => {

        const serverData = get(interaction.guild.id);

        if (!serverData || !Object.keys(serverData).filter((elem) => elem !== "role" && elem !== "channel").length) return interaction.reply({ content: config.messages.noWhitelistedAddress, ephemeral: true });

        const newInteraction = await interaction.reply({ embeds: [{
            color: "YELLOW",
            description: config.messages.areYouSure
        }], fetchReply: true, components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`${interaction.guild.id}${interaction.user.id}Y`).setLabel("Yes").setStyle("SUCCESS"), new MessageButton().setCustomId(`${interaction.guild.id}${interaction.user.id}N`).setLabel("No").setStyle("DANGER"))], ephemeral: true });

        newInteraction.awaitMessageComponent({ filter: (i) => i.user.id === interaction.user.id && [`${interaction.guild.id}${interaction.user.id}Y`, `${interaction.guild.id}${interaction.user.id}N`].includes(i.customId) }).then((int) => {
            if (int.customId === `${interaction.guild.id}${interaction.user.id}N`) {
                return interaction.editReply({ embeds: [{
                    color: "YELLOW",
                    description: config.messages.cancelledDelete
                }], components: [] });
            };

            set(interaction.guild.id, { channel: serverData.channel, role: serverData.role }, false, true);

            return interaction.editReply({ embeds: [{
                color: "YELLOW",
                description: config.messages.deletedAll
            }], components: [] });

        }).catch((er) => {
            console.trace(er);
            return newInteraction.edit({ content: config.messages.somethingWentWrong, embeds: [], components: [] });
        })
    }
}