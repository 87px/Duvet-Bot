import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const eventsPath: string = path.join(__dirname, 'events');
const eventFiles: string[] = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

interface Event {
    name: string;
    once: boolean;
    execute: (...args: any[]) => void;
}

for (const file of eventFiles) {
    const filePath: string = path.join(eventsPath, file);
    const event: Event = require(filePath) as Event;
    if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
    }
}

client.login(process.env.TOKEN);

export default client;
