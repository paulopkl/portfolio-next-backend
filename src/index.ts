require("dotenv").config();
import express from "express";
import routes from "./routes";
import cors from "cors";

function main() {
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    app.use(routes);
    
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log("App listening on port: " + port);
    });
}

main();