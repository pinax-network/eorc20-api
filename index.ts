#!/usr/bin/env node

import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { Address } from "viem";
import { groupBySupply } from './sql/groupBySupply.js'
import { groupByHolders } from './sql/groupByHolders.js'
import { sumByAddress } from './sql/sumByAddress.js'
import { toFile } from './src/fetch/cors.js';
import swaggerHtml from "./swagger/index.html";
import swaggerFavicon from "./swagger/favicon.png";
import { file } from 'bun';
import { openapi } from './src/fetch/openapi.js';

const app = new Hono()
app.use('/*', cors())
app.get('/supply', async (c) => {
    const response = await groupBySupply()
    return c.json(response);
})

app.get('/holders', async (c) => {
    const response = await groupByHolders()
    return c.json(response);
})

app.get('/tokens', async (c) => {
    const {searchParams} = new URL(c.req.url)
    const address = searchParams.get('address') as Address | null
    if ( !address ) return c.json({error: 'address is required'});
    const response = await sumByAddress(address)
    return c.json(response);
})

app.get('/', async (c) => {
    return toFile(file(swaggerHtml));
})

app.get('/favicon.png', async () => {
    return toFile(file(swaggerFavicon));
})

app.get('/openapi', async (c) => {
    return c.json(JSON.parse(await openapi()));
})

export default app