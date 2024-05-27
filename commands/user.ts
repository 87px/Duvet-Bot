import { SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction: any) {
    await interaction.reply(
      `Esse foi comando foi executado por: ${interaction.user.username}\nQue entrou em: ${interaction.member.joinedAt}.`
    );
  },
};
