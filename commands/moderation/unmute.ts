import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder, GuildMember, PermissionsBitField } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Remove o silêncio de um usuário.")
    .addUserOption((option) =>
      option
        .setName("usuário")
        .setDescription("O usuário a ser dessilenciado")
        .setRequired(true)
    ),
  async execute(interaction: any) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)
    ) {
      await interaction.reply({
        content: "Você não tem permissão para usar este comando.",
        ephemeral: true,
      });
      return;
    }

    const user = interaction.options.getUser("usuário");

    const member = interaction.guild.members.cache.get(user.id) as GuildMember;
    if (!member) {
      await interaction.reply({
        content: "O usuário não está no servidor.",
        ephemeral: true,
      });
      return;
    }

    const muteRole = interaction.guild.roles.cache.find(
      (role: any) => role.name === "Mutado"
    );
    if (!muteRole || !member.roles.cache.has(muteRole.id)) {
      await interaction.reply({
        content: "O usuário não está silenciado.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.roles.remove(muteRole, "Silêncio removido");
      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Usuário Dessilenciado")
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: "Usuário:", value: `${user.tag}`, inline: true },
          { name: "ID:", value: `${user.id}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Dessilenciado por ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao tentar dessilenciar o usuário:", error);
      await interaction.reply({
        content: "Ocorreu um erro ao tentar dessilenciar o usuário.",
        ephemeral: true,
      });
    }
  },
};
