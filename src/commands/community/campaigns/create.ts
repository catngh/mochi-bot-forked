import { Command } from "types/common"
import { PREFIX } from "utils/constants"
import { composeEmbedMessage } from "utils/discordEmbed"
import { Message } from "discord.js"
import { getCommandArguments } from "utils/commands"
import community from "adapters/community"

const command: Command = {
  id: "whitelist_create",
  command: "create",
  brief: "Create a whitelist campaign",
  category: "Community",
  run: async (msg: Message) => {
    let description = ""
    const args = getCommandArguments(msg)
    const campaignName = args.slice(2).join(" ")
    const res = await community.createWhitelistCampaign(
      campaignName,
      msg.guild.id
    )

    if (!res.name) {
      return
    }
    description = `Campaign **${res.name}** is successfully created ✅`

    return {
      messageOptions: {
        embeds: [
          composeEmbedMessage(msg, {
            description,
            title: "Whitelist Management",
          }),
        ],
      },
    }
  },
  getHelpMessage: async (msg) => {
    return {
      embeds: [
        composeEmbedMessage(msg, {
          usage: `${PREFIX}wl create <campaign-name>`,
          examples: `${PREFIX}wl create rabby-whitelist`,
        }),
      ],
    }
  },
  canRunWithoutAction: true,
  colorType: "Command",
  minArguments: 3,
}

export default command
