import { Command } from "types/common"
import { getEmoji, thumbnails } from "utils/common"
import Defi from "adapters/defi"
import { composeEmbedMessage } from "utils/discordEmbed"
import { PREFIX } from "utils/constants"
import add from "./add"
import remove from "./remove"
import list from "./list"
import addcustom from "./addCustom"
import compare from "./compare"
import { getAllAliases } from "utils/commands"

const actions: Record<string, Command> = {
  list,
  add,
  remove,
  addcustom,
  compare,
}
const commands: Record<string, Command> = getAllAliases(actions)

const command: Command = {
  id: "tokens",
  command: "tokens",
  brief: "Show all supported tokens by Mochi",
  category: "Defi",
  run: async function (msg, action) {
    if (action !== undefined) {
      action = action.replace("-", "")
    }
    const actionObj = commands[action]
    if (actionObj) {
      return actionObj.run(msg)
    }
    const supportedTokens = await Defi.getSupportedTokens()
    const description = supportedTokens
      .map((token) => {
        const tokenEmoji = getEmoji(token.symbol)
        return `${tokenEmoji} **${token.symbol.toUpperCase()}**`
      })
      .join("\n")

    return {
      messageOptions: {
        embeds: [
          composeEmbedMessage(msg, {
            author: ["All supported tokens by Mochi"],
            description,
          }),
        ],
      },
    }
  },
  getHelpMessage: async (msg, action) => {
    const actionObj = commands[action]
    if (actionObj) {
      return actionObj.getHelpMessage(msg)
    }
    return {
      embeds: [
        composeEmbedMessage(msg, {
          thumbnail: thumbnails.TOKENS,
          usage: `${PREFIX}tokens`,
          includeCommandsList: true,
        }),
      ],
    }
  },
  canRunWithoutAction: true,
  aliases: ["token"],
  actions,
  colorType: "Defi",
}

export default command
