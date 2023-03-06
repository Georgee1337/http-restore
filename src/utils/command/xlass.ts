import { APIApplicationCommandOption, ApplicationCommandType, PermissionFlagsBits } from "discord-api-types/v10";
import { CommandOptions } from "../types";

class HustlaCommand {
    name: string;
    description: string;
    type: number;
    default_member_permissions: any;
    options?: APIApplicationCommandOption[];

    constructor({
        name = "",
        description = "",
        type = ApplicationCommandType.ChatInput,
        default_member_permissions = PermissionFlagsBits.ViewChannel,
        options = [],
    }: CommandOptions) {
        this.name = name;
        this.default_member_permissions = default_member_permissions;
        this.description = description;
        this.type = type;

        if (options && options.length) this.options = options;
    }
}


export class DaCommand extends HustlaCommand {
    [x: string]: any;
    constructor(opts: CommandOptions) {
        super(opts);
    }
}

