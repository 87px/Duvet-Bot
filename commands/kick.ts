import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder, GuildMember } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa um usuário do servidor.")
    .addUserOption((option) =>
      option
        .setName("usuário")
        .setDescription("O usuário a ser expulso")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("motivo")
        .setDescription("O motivo da expulsão")
        .setRequired(false)
    ),
  async execute(interaction: any) {
    if (!interaction.member.permissions.has("KICK_MEMBERS")) {
      await interaction.reply({
        content: "Você não tem permissão para usar este comando.",
        ephemeral: true,
      });
      return;
    }

    const user = interaction.options.getUser("usuário");
    const reason =
      interaction.options.getString("motivo") || "Nenhum motivo fornecido";

    const member = interaction.guild.members.cache.get(user.id) as GuildMember;
    if (!member) {
      await interaction.reply({
        content: "O usuário não está no servidor.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.kick(reason);
      const embed = new EmbedBuilder()
        .setColor("#ff8c00")
        .setTitle("Usuário Expulso")
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: "Usuário:", value: `${user.tag}`, inline: true },
          { name: "ID:", value: `${user.id}`, inline: true },
          { name: "Motivo:", value: reason }
        )
        .setTimestamp()
        .setFooter({ text: `Expulso por ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao tentar expulsar o usuário:", error);
      await interaction.reply({
        content: "Ocorreu um erro ao tentar expulsar o usuário.",
        ephemeral: true,
      });
    }
  },
};
