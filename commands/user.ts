import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction: any) {
    const user = interaction.user;
    const member = interaction.member;

    const joinDate = member.joinedAt.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Informações do usuário")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "<:1041searchthreads:1219064690286530610> Usuário:", value: `\`${user.username}\`` },
        { name: "<:3568id:1219064700999041166> ID:", value: `\`${user.id}\`` },
        { name: "<:8879global:1219064726193963028> Entrou em:", value: `\`${joinDate}\`` }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};
