import { Command } from "types/common"
import { Message } from "discord.js"
import { PREFIX } from "utils/constants"
import Community from "adapters/community"
import { composeEmbedMessage } from "utils/discord-embed"
import { getHeader, onlyAdminsAllowed, getCommandArguments } from "utils/common"

const command: Command = {
  id: "invites_config",
  command: "config",
  name: "Configure Invite Tracker log channel",
  category: "Community",
  run: async function config(msg: Message) {
    const isPermitted = await onlyAdminsAllowed(msg)
    if (!isPermitted) {
      return {
        messageOptions: {
          content: `${getHeader("Only admins can do this", msg.author)}`,
        },
      }
    }
    
    const args = getCommandArguments(msg)
    if (args.length < 3) {
      return {
        messageOptions: {
          content: `${getHeader("Missing target channel", msg.author)}`,
        },
      }
    }
    
    const logChannel = args[2].replace(/<#|>/g, "")
    const body = JSON.stringify({
      guild_id: msg.guild.id,
      log_channel: logChannel,
    })
    
    const resp = await Community.configureInvites(body)
    if (resp.error) {
      return {
        messageOptions: {
          content: `${getHeader(resp.error, msg.author)}`,
        },
      }
    }
    
    const embedMsg = composeEmbedMessage(msg, {
      title: `Invites Config`,
    })
    embedMsg.addField(`Successfully`, `Currently, Invite Tracker's logs will be shown at <#${logChannel}>`)
    
    return {
      messageOptions: {
        embeds: [embedMsg],
      }
    }
  },
  getHelpMessage: async (msg) => {
    const embed = composeEmbedMessage(msg, {
      description: `
      Configure Invite Tracker log channel.\n
        **Usage**\`\`\`${PREFIX}invite config <channel> \`\`\`\n
        **Example**\`\`\`${PREFIX}invite config #general \`\`\`\n
        Type \`${PREFIX}help invite <action>\` to learn more about a specific action!
      `,
    })

    return { embeds: [embed] }
  },
  canRunWithoutAction: true,
}

export default command