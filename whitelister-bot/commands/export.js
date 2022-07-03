const { writeFileSync, readFileSync, unlinkSync } = require("fs");

module.exports = {
    name: "export",
    type: "CHAT_INPUT",
    usage: "/export <type>",
    description: "Export all whitelisted addresses.",
    options: [{
        name: "type",
        description: "In which file type you want to export?",
        type: "STRING",
        required: true,
        choices: [{
            name: "TXT",
            value: "txt"
        }, {
            name: "CSV",
            value: "csv"
        }, {
            name: "JSON",
            value: "json"
        }]
    }],
    adminOnly: true,
    run: async ({ get, interaction, config }) => {

        const serverData = get(interaction.guild.id);

        if (!serverData || !Object.keys(serverData).filter((elem) => elem !== "role" && elem !== "channel").length) return interaction.reply({ content: config.messages.noWhitelistedAddress, ephemeral: true });

        const type = interaction.options.get("type").value;

        const results = Object.values(serverData).filter((obj) => !Array.isArray(obj));

        if (!results.length) return interaction.reply({ content: config.messages.notEnoughResults, ephemeral: true });

        switch (type) {
            case "txt": {
                writeFileSync(`${interaction.user.id}${interaction.guild.id}.txt`, results.join("\n"))
                await interaction.reply({ embeds: [{
                    color: "BLURPLE",
                    description: config.messages.exportForYourServer
                }], files: [{
                    attachment: readFileSync(`${interaction.user.id}${interaction.guild.id}.txt`),
                    name: "export.txt",
                    description: `Exported data for ${interaction.guild.name}`
                  }], ephemeral: true });
                unlinkSync(`${interaction.user.id}${interaction.guild.id}.txt`);
                break;
            }
            case "csv": {
                writeFileSync(`${interaction.user.id}${interaction.guild.id}.csv`, "address\n" + results.join("\n"))
                await interaction.reply({ embeds: [{
                    color: "BLURPLE",
                    description: config.messages.exportForYourServer
                }], files: [{
                    attachment: readFileSync(`${interaction.user.id}${interaction.guild.id}.csv`),
                    name: "export.csv",
                    description: `Exported data for ${interaction.guild.name}`
                }], ephemeral: true });
                unlinkSync(`${interaction.user.id}${interaction.guild.id}.csv`);
                break;
            }
            case "json": {
                writeFileSync(`${interaction.user.id}${interaction.guild.id}.json`, JSON.stringify(results, null, 2));
                await interaction.reply({ embeds: [{
                    color: "BLURPLE",
                    description: config.messages.exportForYourServer
                }], files: [{
                    attachment: readFileSync(`${interaction.user.id}${interaction.guild.id}.json`),
                    name: "export.json",
                    description: `Exported data for ${interaction.guild.name}`
                }], ephemeral: true });
                unlinkSync(`${interaction.user.id}${interaction.guild.id}.json`);
                break;
            }
        }
    }
}