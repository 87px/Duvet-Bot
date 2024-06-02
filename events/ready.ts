import { Events } from 'discord.js';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: any) {
		console.log(`Tudo pronto com: ${client.user.username}`);
	},
};