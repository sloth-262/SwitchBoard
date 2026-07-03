require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const {
  getStatus,
  getRoom,
  getUsage
} = require("./api");

const {
  formatStatus,
  formatRoom,
  formatUsage,
  formatError
} = require("./formatter");

const PREFIX = process.env.COMMAND_PREFIX || "!";

console.log("Starting bot...");

if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN is missing in .env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is online as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  console.log(`Message received: ${message.content}`);

  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  try {
    if (command === "help") {
      await handleHelp(message);
      return;
    }

    if (command === "status") {
      await handleStatus(message);
      return;
    }

    if (command === "room") {
      await handleRoom(message, args);
      return;
    }

    if (command === "usage") {
      await handleUsage(message);
      return;
    }

    await message.reply("Unknown command. Try `!help`.");
  } catch (error) {
    console.error(error);

    if (error.code === "ROOM_NOT_FOUND") {
      await message.reply("I could not find that room. Try `!room boss`, `!room meeting`, or `!room lobby`.");
      return;
    }

    await message.reply(formatError());
  }
});

async function handleHelp(message) {
  await message.reply(`
Available commands:

\`!status\` — Shows overall office status.
\`!room <room>\` — Shows room-specific status. Example: \`!room boss\`.
\`!usage\` — Shows today's energy usage.
`);
}

async function handleStatus(message) {
  await message.channel.sendTyping();

  const data = await getStatus();
  const reply = formatStatus(data);

  await message.reply(reply);
}

async function handleRoom(message, args) {
  const roomName = args.join(" ").trim();

  if (!roomName) {
    await message.reply("Please give a room name. Example: `!room boss`");
    return;
  }

  await message.channel.sendTyping();

  const data = await getRoom(roomName);
  const reply = formatRoom(data);

  await message.reply(reply);
}

async function handleUsage(message) {
  await message.channel.sendTyping();

  const data = await getUsage();
  const reply = formatUsage(data);

  await message.reply(reply);
}

client.login(process.env.DISCORD_TOKEN);