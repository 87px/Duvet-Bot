import { Client } from 'discord.js';
import { ClientEvents as DiscordClientEvents } from 'discord.js';

export interface Event {
    name: keyof DiscordClientEvents;
    once?: boolean;
    execute(client: Client, ...args: any[]): void;
}