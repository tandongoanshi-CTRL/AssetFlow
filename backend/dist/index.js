"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const app_1 = require("./app");
const cron_1 = require("./worker/cron");
app_1.app.listen(env_1.env.port, () => {
    console.log(`AssetFlow API listening on http://localhost:${env_1.env.port}`);
});
void (0, cron_1.startCronWorkers)();
