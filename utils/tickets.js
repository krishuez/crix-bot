const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Utility to create and setup an exchange ticket
 */
async function createExchangeTicket(interaction, type, details, currentRate, dealId) {
    const channel = await interaction.guild.channels.create({
        name: `exchange-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: process.env.TICKET_CATEGORY_ID,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
            },
            {
                id: process.env.SUPPORT_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
            },
        ],
    });

    const embed = new EmbedBuilder()
        .setTitle(`Crix Exchange Deal | ${dealId}`)
        .setDescription(`Bhai, details verify kar lo. Staff will assist you shortly!`)
        .setColor('#f1c40f')
        .addFields(
            { name: '👤 Exchanger', value: `${interaction.user}`, inline: true },
            { name: '🛠 Direction', value: type.toUpperCase(), inline: true },
            { name: '💰 Amount', value: `$${details.amount}`, inline: true },
            { name: '🪙 Asset', value: `${details.coin} (${details.network})`, inline: true },
            { name: '🏦 Method', value: details.method, inline: true },
            { name: '📈 Rate Applied', value: `₹${currentRate}/$` }
        )
        .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`paid_${dealId}`).setLabel('Mark Paid').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`confirm_${dealId}`).setLabel('Confirm Receipt').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cancel_${dealId}`).setLabel('Cancel').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ 
        content: `Welcome ${interaction.user}! Staff <@&${process.env.SUPPORT_ROLE_ID}> will help you.`, 
        embeds: [embed], 
        components: [buttons] 
    });

    return channel;
}

module.exports = { createExchangeTicket };