import { createClient as createClientWeb } from "@clickhouse/client-web";
import { CLICKHOUSE_DATABASE, CLICKHOUSE_HOST, CLICKHOUSE_PASSWORD } from "../config.js";
import { ping } from "./ping.js";

function createClient() {
    const client = createClientWeb({
        host: CLICKHOUSE_HOST,
        password: CLICKHOUSE_PASSWORD,
        database: CLICKHOUSE_DATABASE,
        clickhouse_settings: {
            wait_for_async_insert: 0, // 0
            async_insert: 1, // 1
            readonly: "1",
        },
        application: "EORC-20 API",
    });
    client.command = client.exec;
    client.ping = ping as any;
    return client;
}

export const client = createClient();