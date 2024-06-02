import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

type Choice = "pedra" | "papel" | "tesoura";
const choices: Choice[] = ["pedra", "papel", "tesoura"];

const results: Record<Choice, Record<Choice, "empate" | "user" | "bot">> = {
  pedra: { pedra: "empate", papel: "bot", tesoura: "user" },
  papel: { pedra: "user", papel: "empate", tesoura: "bot" },
  tesoura: { pedra: "bot", papel: "user", tesoura: "empate" },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Joga pedra, papel ou tesoura com o bot.")
    .addStringOption((option) =>
      option
        .setName("escolha")
        .setDescription("Sua escolha: pedra, papel ou tesoura")
        .setRequired(true)
        .addChoices(
          { name: "Pedra", value: "pedra" },
          { name: "Papel", value: "papel" },
          { name: "Tesoura", value: "tesoura" }
        )
    ),
  async execute(interaction: any) {
    const userChoice = interaction.options.getString("escolha") as Choice;
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    const result = results[userChoice][botChoice];

    let resultMessage;
    if (result === "empate") {
      resultMessage = "Foi um empate!";
    } else if (result === "user") {
      resultMessage = "Você ganhou!";
    } else {
      resultMessage = "Você perdeu!";
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Pedra, Papel ou Tesoura")
      .setDescription("Veja abaixo os resultados do jogo:")
      .addFields(
        { name: "Sua escolha:", value: `\`${userChoice}\``, inline: true },
        { name: "Escolha do bot:", value: `\`${botChoice}\``, inline: true },
        { name: "Resultado:", value: `**${resultMessage}**` }
      )
      .setThumbnail("https://play-lh.googleusercontent.com/n0QR3mpy49gXbFt734TktoF6lPMKJSD8KKdsGb3uMbnu5hALk6vjOGpbM38z7ayjhA")
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};
