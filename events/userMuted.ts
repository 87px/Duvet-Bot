import { EmbedBuilder, Events } from "discord.js";

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember: any, newMember: any) {
    const muteRoleName = "Mutado";
    const muteChannelName = "punições"; 

    const muteRole = newMember.guild.roles.cache.find(
      (role: any) => role.name === muteRoleName
    );
    if (!muteRole) return;

    if (
      !oldMember.roles.cache.has(muteRole.id) &&
      newMember.roles.cache.has(muteRole.id)
    ) {
      const muteChannel = newMember.guild.channels.cache.find(
        (channel: any) => channel.name === muteChannelName && channel.isTextBased()
      );
      if (!muteChannel) return;

      const embed = new EmbedBuilder()
        .setColor(0xdd3333)
        .setTitle("🔇 Usuário Mutado")
        .setDescription(`O usuário ${newMember.user.tag} foi mutado.`)
        .addFields(
          { name: "Moderador", value: "Desconhecido", inline: true }, 
          { name: "Usuário", value: `${newMember}`, inline: true }
        )
        .setThumbnail(newMember.user.displayAvatarURL())
        .setTimestamp();

      muteChannel.send({ embeds: [embed] });
    }
  },
};
