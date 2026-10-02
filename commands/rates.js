const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rates')
        .setDescription('Check current exchange rates'),
    async execute(interaction) {
        const rates = JSON.parse(fs.readFileSync('./rates.json'));
        const embed = new EmbedBuilder()
            .setTitle('Crix Exchange Rates 📊')
            .setColor('#00ff00')
            .addFields(
                { name: '🇮🇳 INR → CRYPTO', value: `₹${rates.i2c}/$ (Any amount)`, inline: false },
                { name: '🪙 CRYPTO → INR', value: `Below $${rates.c2i_threshold}: ₹${rates.c2i_low}/$\nAbove $${rates.c2i_threshold}: ₹${rates.c2i_high}/$`, inline: false },
                { name: '🔄 CRYPTO → CRYPTO', value: `${rates.crypto_to_crypto_fee}`, inline: false }
            )
            .setFooter({ text: 'Fixed. No negotiation. Min $1.' });

        await interaction.reply({ embeds: [embed] });
    },
};