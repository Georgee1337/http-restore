import { logger } from "../funcs";
import { DiscordRequest } from "../verify";

export async function HasGuildCommands(
    appId: string,
    guildId: string,
    commands: any[]
) {
    if (guildId === "" || appId === "") return;

    commands.forEach((c: any) => HasGuildCommand(appId, guildId, c));
}

async function HasGuildCommand(
    appId: string,
    guildId: string,
    command: { [x: string]: any }
) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    try {
        const res = await DiscordRequest(endpoint, {
            method: "GET",
            body: undefined,
        });
        const data = await res.json();

        if (data) {
            const installedNames = data.map((c: { [x: string]: any }) => c["name"]);
            if (!installedNames.includes(command["name"])) {
                logger("YELLOW", `Installing "${command["name"]}"`)

                InstallGuildCommand(appId, guildId, command);
            } else {
                logger("YELLOW", `"${command["name"]}" command already installed`)
            }
        }
    } catch (err) {
        console.error(err);
    }
}

export async function InstallGuildCommand(
    appId: string,
    guildId: string,
    command: any
) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    try {
        await DiscordRequest(endpoint, { method: "POST", body: command });
    } catch (err) {
        console.error(err);
    }
}