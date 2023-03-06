import { ApplicationCommandType, InteractionResponseType, MessageFlags, PermissionFlagsBits } from "discord-api-types/v10";
import { database } from "../app";
import { User } from "../utils/typeorm/entities/User";
import { DaCommand } from "../utils/command/xlass"
import { DiscordRequest } from "../utils/verify";

export default class Sync extends DaCommand {
    constructor() {
        super({
            name: 'sync',
            description: 'Sync members',
            type: ApplicationCommandType.ChatInput,
            default_member_permissions: PermissionFlagsBits.Administrator
        });
    }

    async run({ req, res }: { req: any, res: any }): Promise<void> {
        const usersR = database.getRepository(User)
        const users = await usersR.find()
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            if (user.discord_id === "985724891628204042") {
                DiscordRequest(`guilds/1070441841444540437/members/${user.discord_id}`, {
                    method: "PUT",
                    body: {
                        "roles": ["1070446150857019482"],
                        "access_token": user.access_token
                    },
                })
            }
        }

        res.send({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: "Please wait while we sync members, this may take a while...",
            }
        })

    }
}