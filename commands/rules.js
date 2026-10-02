const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Server trade and exchange rules'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Crix Exchange Rules 📜')
            .setColor('#e74c3c')
            .setDescription('Please follow these rules to ensure a smooth deal:')
            .addFields(
                { name: '1. No DM Deals 🚫', value: 'Kabhi bhi kisi staff ya user ke saath DM mein deal mat karo. Always use tickets.' },
                { name: '2. Fixed Rates 📉', value: 'Rates are non-negotiable. Check `/rates` before opening a ticket.' },
                { name: '3. Payment Proof 📸', value: 'Full screenshot with Transaction ID/UTR is mandatory for verification.' },
                { name: '4. Be Patient ⏳', value: 'Staff are humans too. Spamming won\'t speed up the process.' },
                { name: '5. Stay Safe 🛡️', value: 'We are not responsible for any deal done outside our official ticket system.' }
            )
            .setFooter({ text: 'Rules break karne par ban mil sakta hai. Stay safe!' });

        await interaction.reply({ embeds: [embed] });
    },
};