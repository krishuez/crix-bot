const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fees')
        .setDescription('Check our exchange and transaction fees'),
    async execute(interaction) {
        const rates = JSON.parse(fs.readFileSync('./rates.json'));
        
        const embed = new EmbedBuilder()
            .setTitle('Crix Exchange Fees 💸')
            .setColor('#e67e22')
            .addFields(
                { name: '💰 I2C / C2I', value: 'Hamari fees rate ke andar hi included hai. No extra hidden charges!', inline: false },
                { name: '🔄 Crypto → Crypto', value: `${rates.crypto_to_crypto_fee}`, inline: false },
                { name: '⛽ Network Fees', value: 'Network fees are paid by the user (varies by chain like ETH/TRC20).', inline: false },
                { name: '⚠️ Min Amount', value: 'Minimum exchange amount is $1.', inline: false }
            )
            .setFooter({ text: 'Transparent fees, no bakwas. 🚫' });

        await interaction.reply({ embeds: [embed] });
    },
};