import { createServer } from "http";
import express, { Express, Request, Response } from "express";
import * as dotEnv from "dotenv";

class Main {
    private readonly _app: Express = express();
    private readonly _port: number = Number(process.env.APP_PORT) || 7199;
    private readonly _host: string = process.env.APP_HOST || "localhost";

    constructor() {
        this._listen();
        this._setting();
        this._templateEjs();
        this._mainPage();
    }

    private _listen() {
        createServer(this._app).listen(this._port, () => {
            console.log(`app running at: http://${this._host}:${this._port}`);
        });
    }

    private _setting() {
        dotEnv.config();
    }

    private _templateEjs() {
        this._app.set("view engine", "ejs");
        this._app.set("views", `${process.cwd()}/source/views`);
        express.static(`${process.cwd()}/source`);
    }

    private _mainPage() {
        this._app.get("/", (req: Request, res: Response) => {
            res.render("index");
            return;
        });
    }
}
new Main();
