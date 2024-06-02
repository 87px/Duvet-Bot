import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

interface CatResponse {
  _id: string;
  mimetype: string;
  size: number;
  tags: string[];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Retorna um gato aleatório"),
  async execute(interaction: CommandInteraction) {
    try {
      const response = await fetch(
        "https://cataas.com/api/cats?limit=1&skip=0"
      );
      const data: unknown = await response.json();

      if (Array.isArray(data) && data.length > 0 && isCatResponse(data[0])) {
        const cat = data[0];
        const catUrl = `https://cataas.com/cat/${cat._id}`;

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Aqui está um gato!")
          .setImage(catUrl)
          .setFooter({ text: `Tags: ${cat.tags.join(", ")}` });

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply(
          "Não encontrei nenhum gato no momento. Tente novamente mais tarde."
        );
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Houve um erro ao buscar a imagem do gato. Tente novamente mais tarde."
      );
    }
  },
};

function isCatResponse(obj: any): obj is CatResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj._id === "string" &&
    typeof obj.mimetype === "string" &&
    typeof obj.size === "number" &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: any) => typeof tag === "string")
  );
}
