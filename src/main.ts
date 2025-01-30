import { createServer } from "http";
import express, { Express, Request, Response } from "express";

class Main {
    private readonly _express: Express = express();
    private readonly _port: number = Number(process.env.APP_PORT) || 7199;
    private readonly _host: string = process.env.APP_HOST || "localhost";

    constructor() {
        this._listen();
        this._hello();
        console.log(process.env.APP_PORT, this._host);
    }

    private _listen() {
        createServer(this._express).listen(this._port, () => {
            console.log(`app running at: http://${this._host}:${this._port}`);
        });
    }

    private _hello() {
        this._express.get("/", (req: Request, res: Response) => {
            console.log("hello!");
            res.send({ message: "hii" });
            return;
        });
    }
}
new Main();
