// Volto para fazer depois;

import { TextChannel } from "discord.js";

module.exports = {
  data: {
    name: "setwelcome",
    description: "Define o canal de boas-vindas para novos membros.",
    options: [
      {
        type: 7, 
        name: "channel",
        description: "O canal para enviar mensagens de boas-vindas",
        required: true,
      },
    ],
  },
  async execute(interaction: any) {
    const channel = interaction.options.getChannel("channel");

    if (!channel || !(channel instanceof TextChannel)) {
      await interaction.reply({
        content: "Por favor, escolha um canal de texto válido!",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `Canal de boas-vindas definido para ${channel.name}`,
      ephemeral: true,
    });
  },
};
