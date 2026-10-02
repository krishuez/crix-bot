const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrate')
        .setDescription('Update rates (Admin Only)')
        .addStringOption(opt => opt.setName('key').setDescription('i2c, c2i_low, or c2i_high').setRequired(true))
        .addNumberOption(opt => opt.setName('value').setDescription('New rate value').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const key = interaction.options.getString('key');
        const value = interaction.options.getNumber('value');
        
        let rates = JSON.parse(fs.readFileSync('./rates.json'));
        if (!rates[key]) return interaction.reply("Invalid key!");
        
        rates[key] = value;
        fs.writeFileSync('./rates.json', JSON.stringify(rates, null, 2));
        
        await interaction.reply(`Updated ${key} to ${value} ✅`);
    },
};