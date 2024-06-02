import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder, GuildMember, PermissionsBitField } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Silencia um usuário por um tempo determinado.")
    .addUserOption((option) =>
      option
        .setName("usuário")
        .setDescription("O usuário a ser silenciado")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("tempo")
        .setDescription("O tempo de silêncio em minutos")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("motivo")
        .setDescription("O motivo do silêncio")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("provas")
        .setDescription(
          "Link para a prova do motivo do silêncio (URL de imagem ou texto)"
        )
        .setRequired(false)
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
    const time = interaction.options.getInteger("tempo");
    const reason =
      interaction.options.getString("motivo") || "Nenhum motivo fornecido";
    const proof =
      interaction.options.getString("provas") || "Nenhuma prova fornecida";

    const member = interaction.guild.members.cache.get(user.id) as GuildMember;
    if (!member) {
      await interaction.reply({
        content: "O usuário não está no servidor.",
        ephemeral: true,
      });
      return;
    }

    let muteRole = interaction.guild.roles.cache.find(
      (role: any) => role.name === "Mutado"
    );
    if (!muteRole) {
      muteRole = await interaction.guild.roles.create({
        name: "Muted",
        color: "#555555",
        permissions: [],
      });

      interaction.guild.channels.cache.forEach(async (channel: any) => {
        await channel.permissionOverwrites.edit(muteRole, {
          SendMessages: false,
          AddReactions: false,
          Speak: false,
        });
      });
    }

    try {
      await member.roles.add(muteRole, reason);
      const embed = new EmbedBuilder()
        .setColor("#FF5555")
        .setTitle("🔇 Usuário Silenciado")
        .setDescription(`Detalhes da ação de silenciamento:`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: "Usuário", value: `${user.tag}`, inline: true },
          { name: "ID", value: `${user.id}`, inline: true },
          { name: "Tempo", value: `${time} minutos`, inline: true },
          { name: "Motivo", value: reason },
          { name: "Provas", value: proof }
        )
        .setTimestamp()
        .setFooter({ text: `Silenciado por ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await member.roles.remove(muteRole, "Tempo de silêncio expirado");
        await interaction.followUp({
          content: `${user.tag} não está mais silenciado.`,
          ephemeral: true,
        });
      }, time * 60000);
    } catch (error) {
      console.error("Erro ao tentar silenciar o usuário:", error);
      await interaction.reply({
        content: "Ocorreu um erro ao tentar silenciar o usuário.",
        ephemeral: true,
      });
    }
  },
};
