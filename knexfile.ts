import dotenv from "dotenv";
dotenv.config();

export default {
    client: 'mysql2',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_NAME
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName : 'knex_migrations'
    }
};