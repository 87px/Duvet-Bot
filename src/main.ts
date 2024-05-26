import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Tudo pronto com: ${readyClient.user.username}`);
});

client.login(process.env.TOKEN);

export default client;