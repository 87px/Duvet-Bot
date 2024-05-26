import { Client } from "discord.js";

export interface CustomClient extends Client {
  deploy: () => Promise<void>;
}
