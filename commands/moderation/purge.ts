import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Apaga um número específico de mensagens de um canal.')
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Número de mensagens a serem apagadas')
        .setRequired(true)
    ),
  async execute(interaction: any) {
    const member = interaction.member as GuildMember;
    const roleId = '1244096764814819360';
    
    if (!member.roles.cache.has(roleId)) {
      await interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger('amount');
    if (amount === null || amount <= 0) {
      await interaction.reply({ content: 'Por favor, forneça um número válido de mensagens a serem apagadas.', ephemeral: true });
      return;
    }

    const channel = interaction.channel;
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: 'Não foi possível acessar o canal.', ephemeral: true });
      return;
    }

    try {
      const messages = await channel.bulkDelete(amount, true);
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Mensagens Apagadas')
        .setDescription(`Foram apagadas \`${messages.size}\` mensagens.`)
        .setTimestamp()
        .setFooter({ text: `Requisitado por: ${interaction.user.username}` });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Erro ao tentar apagar mensagens:', error);
      await interaction.reply({ content: 'Ocorreu um erro ao tentar apagar as mensagens.', ephemeral: true });
    }
  },
};