const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Learn how to use Crix Exchange'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('How to use Crix Exchange 📚')
            .setDescription('Exchange process ka simple guide yaha hai:')
            .setColor('#3498db')
            .addFields(
                { 
                    name: 'Step 1: Command ⌨️', 
                    value: 'Type `/exchange` and select your direction (INR to Crypto or Crypto to INR).' 
                },
                { 
                    name: 'Step 2: Details 📝', 
                    value: 'Modal mein Amount, Coin, Network aur Payment method enter karein.' 
                },
                { 
                    name: 'Step 3: Ticket 🎫', 
                    value: 'Aapke liye ek private ticket open hoga. Wait for staff to provide payment details.' 
                },
                { 
                    name: 'Step 4: Done ✅', 
                    value: 'Payment karke screenshot bhejien. Staff verify karke exchange complete kar denge!' 
                }
            )
            .setFooter({ text: 'Always deal inside the server for safety! 🛡️' });

        await interaction.reply({ embeds: [embed] });
    },
};