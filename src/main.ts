import { Client, Collection, GatewayIntentBits, Events } from "discord.js";
import "dotenv/config";
import * as fs from "fs";
import path from "path";

const { TOKEN } = process.env;

class MyClient extends Client {
  commands: Collection<string, any>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.commands = new Collection();
  }
}

const client = new MyClient();

const commandsPath = path.join(__dirname, "../commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: string) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`Comando em ${filePath} não tem "execute" ou "data".`);
  }
}

const eventsPath = path.join(__dirname, "../events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on(Events.InteractionCreate, async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return;
  const command: any = client.commands.get(interaction.commandName);
  if (!command) {
    console.error("Cannot find this command.");
    return;
  }
  try {
    await command.execute(interaction);
  } catch (e) {
    console.error(e);
    await interaction.reply("Got an error.");
  }
});

client.login(TOKEN);
