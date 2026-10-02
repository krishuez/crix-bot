const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const { saveDeal } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exchange')
        .setDescription('Start an INR to Crypto or Crypto to INR exchange'),

    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_direction')
                    .setPlaceholder('Choose Direction')
                    .addOptions([
                        { label: 'INR → Crypto (I2C)', value: 'i2c', emoji: '🇮🇳' },
                        { label: 'Crypto → INR (C2I)', value: 'c2i', emoji: '🪙' },
                    ]),
            );

        await interaction.reply({ content: 'Bhai, kya exchange karna hai aaj?', components: [row], ephemeral: true });
    },

    // Logic for Modal and Ticket creation is handled in index.js to keep it centralized
};