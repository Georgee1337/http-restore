import * as fs from 'fs/promises';
import * as path from 'path';
import { DaCommand } from './xlass';
import { commands } from '../../app'

async function registerCommands(...dirs: string[]): Promise<void> {
    for (const dir of dirs) {
        const files = await fs.readdir(path.join(__dirname, dir));

        for (const file of files) {
            const stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                await registerCommands(path.join(dir, file));
            } else if (file.endsWith('.ts')) {
                try {
                    const cmdModule: DaCommand = new ((await import(path.join(__dirname, dir, file))).default)();
                    const { name } = cmdModule;
                    commands.set(name.toLowerCase(), cmdModule)
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
}

export { registerCommands };