// src/events/Event.ts
import { Client, Events } from "discord.js";
import { Event } from "../interfaces/Event";
import { CustomClient } from "../interfaces/CustomClient";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    const customClient = client as CustomClient;
    if (!process.argv.includes("--no-deployment")) await customClient.deploy();
    console.log(
      `\nReady! Logged in as ${customClient.user?.tag} (${customClient.user?.id})`
    );
  },
};

export default event;
