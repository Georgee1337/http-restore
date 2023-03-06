import "dotenv/config";
import { verifyKey } from "discord-interactions";
import fetch from "node-fetch";

export function VerifyDiscordRequest(clientKey: string) {
    return function (req, res, buf, encoding) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            console.log('Bad request signature');
        }
    };
}


export async function DiscordRequest(
    endpoint: string,
    options: { method: string; body: any }
) {
    const url = "http://node1-eu.blackph.one:3000/api/v9/" + endpoint;
    if (options.body) options.body = JSON.stringify(options.body);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
            "Content-Type": "application/json; charset=UTF-8",
        },
        ...options,
    });
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    return res;
}