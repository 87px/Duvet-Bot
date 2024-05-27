const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dotenv = require('dotenv');

dotenv.config();

const { TOKEN, CLIENT_ID } = process.env;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));

const commands = commandFiles.map((file: any) => {
    const command = require(`./commands/${file}`);
    return command.data.toJSON();
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Resetando ${commands.length} comandos globalmente.`);
        
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('Sucesso ao registrar todos os comandos.');
    } catch (e) {
        console.error(e);
    }
})();