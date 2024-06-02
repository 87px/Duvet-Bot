const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("@discordjs/builders");
const dotenv = require("dotenv");

dotenv.config();

const { TOKEN, CLIENT_ID } = process.env;

const commands: any = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = getCommandFiles(commandsPath);

for (const file of commandFiles) {
  const command = require(`./${file}`);
  if (command.data) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`Comando em ${file} não tem "data" definida.`);
  }
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`Resetando ${commands.length} comandos globalmente.`);

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Sucesso ao registrar todos os comandos.");
  } catch (e) {
    console.error(e);
  }
})();

function getCommandFiles(dir: string): string[] {
  let commandFiles: string[] = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      commandFiles = commandFiles.concat(getCommandFiles(filePath));
    } else if (file.endsWith(".ts")) {
      const relativePath = path.relative(__dirname, filePath);
      commandFiles.push(relativePath);
    }
  }
  return commandFiles;
}

export { getCommandFiles };
