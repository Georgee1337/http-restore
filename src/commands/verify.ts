import { ApplicationCommandType, InteractionResponseType, MessageFlags, PermissionFlagsBits } from "discord-api-types/v10";
import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DaCommand } from "../utils/command/xlass"

export default class Verify extends DaCommand {
    constructor() {
        super({
            name: 'verify',
            description: 'Verify your membership status & ensure reinstatement in the event of a termination',
            type: ApplicationCommandType.ChatInput,
            default_member_permissions: PermissionFlagsBits.ViewChannel
        });
    }

    async run({ req, res }: { req: any, res: any }): Promise<void> {

        res.send({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: "Please click the verification button to confirm your membership status & ensure reinstatement in the event of a termination.",
                components: [
                    {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: MessageComponentTypes.BUTTON,
                                url: "https://alcetaswaf.lol/verify/",
                                label: "Verify",
                                style: ButtonStyleTypes.LINK,
                            },
                        ],
                    },
                ],
            }
        })

    }
}