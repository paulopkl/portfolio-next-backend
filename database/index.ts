import config from "../knexfile";
import knex from "knex";
const db = knex(config);

db.raw("SELECT 1")
    .then(() => console.log("MySQL connected"))
    .catch((e) => {
        console.log("MySQL not connected");
        console.error(e);
    });

// db.migrate.latest([config])
export { db }