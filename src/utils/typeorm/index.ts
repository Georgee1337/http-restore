import { DataSource } from "typeorm";
import { logger } from "../funcs";
import { User } from "./entities/User";

const entities = [User]

export class DatabaseUtils {
    sync: boolean;
    source: DataSource;
    constructor(
        sync: boolean
    ) {
        this.sync = sync;
    }

    private async _init(): Promise<void> {
        this.source = new DataSource({
            type: 'mysql',
            host: "91.218.67.185",
            port: 3306,
            username: "restore",
            password: "newpasswhodis1213",
            database: "bot",
            entities: entities,
            synchronize: this.sync,
        })

        await this.source.initialize().then(() => {
            logger("GREEN", 'Database connected')
        }).catch((err) => {
            console.log(err)
        })
    }
    async connect() {
        logger("YELLOW", "Database connecting...")
        await this._init()
    }
    getRepository(entity: any) {
        return this.source.getRepository(entity)
    }
}