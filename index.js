require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getGeminiResponse } = require('./utils/gemini');
const { saveDeal, updateDealStatus } = require('./utils/database');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

// Load Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Interaction Handling
client.on(Events.InteractionCreate, async interaction => {
    // 1. Select Menu Handling
    if (interaction.isStringSelectMenu() && interaction.customId === 'select_direction') {
        const direction = interaction.values[0];
        const modal = new ModalBuilder()
            .setCustomId(`exchange_modal_${direction}`)
            .setTitle(direction === 'i2c' ? 'INR to Crypto' : 'Crypto to INR');

        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('amount').setLabel('Amount in USD ($)').setPlaceholder('e.g. 50').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('coin').setLabel('Coin (USDT/BTC/ETH etc)').setPlaceholder('USDT').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('network').setLabel('Network (Polygon/BSC/TRC20)').setPlaceholder('TRC20').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('method').setLabel('Payment Method').setPlaceholder('UPI / Bank / Paytm').setStyle(TextInputStyle.Short).setRequired(true))
        );

        await interaction.showModal(modal);
    }

    // 2. Modal Submission
    if (interaction.isModalSubmit() && interaction.customId.startsWith('exchange_modal_')) {
        const type = interaction.customId.split('_')[2];
        const amount = parseFloat(interaction.fields.getTextInputValue('amount'));
        const coin = interaction.fields.getTextInputValue('coin');
        const network = interaction.fields.getTextInputValue('network');
        const method = interaction.fields.getTextInputValue('method');

        if (amount < 1) {
            return interaction.reply({ content: "Bhai minimum $1 hai 🙏", ephemeral: true });
        }

        const dealId = `CRIX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        // Create Private Ticket
        const channel = await interaction.guild.channels.create({
            name: `exchange-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: process.env.TICKET_CATEGORY_ID,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                { id: process.env.SUPPORT_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            ],
        });

        const rates = JSON.parse(fs.readFileSync('./rates.json'));
        const currentRate = type === 'i2c' ? rates.i2c : (amount > rates.c2i_threshold ? rates.c2i_high : rates.c2i_low);

        const embed = new EmbedBuilder()
            .setTitle(`New Exchange Request: ${dealId}`)
            .setColor('#f1c40f')
            .addFields(
                { name: '👤 User', value: `${interaction.user}`, inline: true },
                { name: '🛠 Type', value: type.toUpperCase(), inline: true },
                { name: '💰 Amount', value: `$${amount}`, inline: true },
                { name: '🪙 Coin/Net', value: `${coin} (${network})`, inline: true },
                { name: '🏦 Method', value: method, inline: true },
                { name: '📈 Rate applied', value: `${currentRate}/$` }
            )
            .setFooter({ text: 'Please wait for staff to provide payment details.' });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`paid_${dealId}`).setLabel('Mark Paid').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`confirm_${dealId}`).setLabel('Confirm Receipt').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`cancel_${dealId}`).setLabel('Cancel').setStyle(ButtonStyle.Danger)
        );

        await channel.send({ content: `<@&${process.env.SUPPORT_ROLE_ID}>`, embeds: [embed], components: [buttons] });
        
        saveDeal({ id: dealId, userId: interaction.user.id, type, amount, coin, network, method, status: 'OPEN' });

        await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
    }

    // 3. Button Handling (Simplified for brevity)
    if (interaction.isButton()) {
        const [action, dealId] = interaction.customId.split('_');
        
        if (action === 'confirm') {
            updateDealStatus(dealId, 'COMPLETED');
            await interaction.reply("Deal Completed! ✅ Logging to history...");
            
            // Logging to LOG_CHANNEL
            const logChannel = interaction.guild.channels.cache.get(process.env.EXCHANGE_LOG_CHANNEL_ID);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('Exchange Completed')
                    .setDescription(`**ID:** ${dealId}\n**Exchanger:** User\n**Amount:** Success\n**Note:** Client info hidden for privacy.`)
                    .setColor('Green')
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
        
        if (action === 'cancel') {
            await interaction.reply("Deal cancelled. Ticket closing...");
            setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
        }
    }

    // 4. Slash Commands Execution
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try { await command.execute(interaction); } catch (e) { console.error(e); }
});

// Gemini AI Mention Handling
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (message.mentions.has(client.user)) {
        const response = await getGeminiResponse(message.content.replace(`<@${client.user.id}>`, '').trim());
        message.reply(response);
    }
});

client.login(process.env.DISCORD_TOKEN);