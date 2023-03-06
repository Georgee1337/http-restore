import { APIApplicationCommandOption, ApplicationCommandType } from "discord-api-types/v10";

export interface CommandOptions {
    name: string;
    description: string;
    type: ApplicationCommandType;
    options?: APIApplicationCommandOption[];
    defaultPermission?: boolean;
    default_member_permissions?: any;
}