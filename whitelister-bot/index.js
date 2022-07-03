const { Client, Intents } = require("discord.js"), { readdirSync, readFileSync, writeFileSync } = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require("./config.json");

client.commands = [];

const get = (key) => {
    try {
        return JSON.parse(readFileSync("./database.json", "utf8"))[key];
    } catch (_) {
        return set({});
    };
  };
  
const set = (key, value, remove = false, overwrite = false) => {
    if (!value && remove === false) return writeFileSync("./database.json", JSON.stringify(key, null, 2));
    const read = JSON.parse(readFileSync("./database.json", "utf8"));
    if (remove) return writeFileSync("./database.json", JSON.stringify((delete read[key], read), null, 2));
    if (read[key] && typeof read[key] !== "string" && !overwrite) return writeFileSync("./database.json", JSON.stringify((read[key] = Object.assign(read[key], { ...value }), read), null, 2));
    return writeFileSync("./database.json", JSON.stringify((read[key] = value, read), null, 2));
};

const commands = readdirSync("./commands");

for (const command of commands) {
    const commandFile = require(`./commands/${command}`);
    if (!commandFile.name) {
        console.log(`${command}: Unable to get name property!`);
        break;
    }
    client.commands.push(commandFile);
}

client.on("ready", () => {
    (config.production ? client.application : client.guilds.cache.get(config.testingServerID)).commands.set(client.commands);
    console.log("Bot is ready to go!");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const commandCode = client.commands.find((elem) => elem.name === interaction.commandName);

    if (!commandCode) return interaction.reply({ content: config.messages.somethingWentWrong, ephemeral: true });
    if (commandCode.adminOnly && !interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: config.messages.noAdministratorPermission, ephemeral: true });

    try {
        commandCode.run({ client, interaction, config, get, set });
    } catch (_) {
        console.trace(_);
        return interaction.reply({ content: messages.somethingWentWrong, ephemeral: true });
    };
});

client.login(config.discord_bot_token);