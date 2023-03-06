import "dotenv/config";
import express, { Request } from "express";

import {
    InteractionType,
    InteractionResponseType,
} from 'discord-api-types/v10';
import { VerifyDiscordRequest } from "./utils/verify";
import { registerCommands } from "./utils/command/register";
import { Collection } from "@discordjs/collection";
import { HasGuildCommands } from "./utils/command/funcs";
import { DaCommand } from "./utils/command/xlass";
import { logger } from "./utils/funcs";
import { DatabaseUtils } from "./utils/typeorm";
import { User } from "./utils/typeorm/entities/User";
import { Response } from "node-fetch";
import axios from "axios";

const app = express();
const PORT = process.env.PORT;
export const commands: Collection<string, DaCommand> = new Collection()
export const database = new DatabaseUtils(true)

app.use(express.json({ verify: VerifyDiscordRequest("b3c676c74cb9e324a00e32425f8148ece1868afbdaf1db02ca1d6bc8a8909125") }));

app.post('/interactions', async (req, res) => {
    const { type, data } = req.body;
    if (type === InteractionType.Ping) {
        return res.send({ type: InteractionResponseType.Pong });
    }
    if (type === InteractionType.ApplicationCommand) {
        const command = commands.get(data.name);
        if (!command) return;
        await command.run({ req, res });
    }
})
const CLIENT_ID = process.env.APP_ID;
const CLIENT_SECRET = process.env.SECRET;
const redirect = encodeURIComponent(process.env.CALLBACK_URL);

app.get('/redirect', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+guilds.join&response_type=code&redirect_uri=${redirect}`);
})
app.get('/success', (req, res) => {
    res.send("Thank you for verifying.")
})

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.redirect('/redirect');
    try {
        const formData = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code as string,
            redirect_uri: process.env.CALLBACK_URL,
        });
        const response = await axios.post('https://discord.com/api/oauth2/token', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { data } = await axios.get("http://node1-eu.blackph.one:3000/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${response.data.access_token}`
            }
        })
        const usersR = database.getRepository(User)


        const user = await usersR.findOne({
            where: {
                discord_id: data.id
            }
        })
        if (!user) {
            const newU = await usersR.create({
                discord_id: data.id,
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
            })
            await usersR.save(newU)
            res.redirect("/success")
        } else {
            await usersR.update(user.id, {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token
            })
            res.redirect("/success")
        }

    } catch (error) {
        res.send(error);
    }

})

app.listen(PORT, async () => {
    await registerCommands("../../commands");
    database.connect();
    // console.clear();
    logger("GREEN", `Listening on port ${PORT}`)
    HasGuildCommands(
        process.env.APP_ID,
        process.env.GUILD,
        toApplicationCommand(commands)
    );

});

function toApplicationCommand(collection: Collection<string, DaCommand>): any[] {
    return collection.map(x => {
        return {
            name: x.name,
            description: x.description,
            options: x.options,
            default_member_permissions: x.default_member_permissions.toString(),
        };
    });
}
