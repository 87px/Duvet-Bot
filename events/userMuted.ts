import { EmbedBuilder, Events } from "discord.js";

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember: any, newMember: any) {
    const muteChannelId = "1244372814623019019";
    const muteRoleId = "1246670034177364010";

    if (
      !oldMember.roles.cache.has(muteRoleId) &&
      newMember.roles.cache.has(muteRoleId)
    ) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Usuário Mutado")
        .addFields(
          {
            name: "Moderador",
            value: `<@${newMember.client.user.id}>`,
            inline: true,
          },
          { name: "Usuário", value: `<@${newMember.id}>`, inline: true }
        )
        .setTimestamp(new Date());

      const channel = newMember.guild.channels.cache.get(muteChannelId);
      if (channel.isTextBased()) {
        channel.send({ embeds: [embed] });
      }
    }
  },
};
