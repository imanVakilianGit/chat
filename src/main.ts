import { createServer } from "http";
import express, {
    ErrorRequestHandler,
    Express,
    NextFunction,
    Request,
    Response,
} from "express";
import * as dotEnv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import { APP_ROUTER } from "./app/app.routes";
import path from "path";
import { JwtService } from "./jwt/jwt.service";
import { SocketServiceClass } from "./socket/socket.service";

class Main {
    private readonly _app: Express = express();
    private readonly _port: number = Number(process.env.APP_PORT) || 7199;
    private readonly _host: string = process.env.APP_HOST || "localhost";
    private readonly _server = createServer(this._app);
    private readonly _io = new Server(this._server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    constructor() {
        this._listen();
        this._setting();
        this._mongoConnection();
        this._templateEjs();
        this._routes();
        this._errorHandler();
        this._ioConnection();
    }

    private _listen() {
        this._server.listen(this._port, () => {
            console.log(`App running at: http://${this._host}:${this._port}`);
        });
    }

    private _setting() {
        dotEnv.config();
        this._app.use(express.static(`${process.cwd()}/source`));
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(cookieParser(process.env.COOKIE_SECRET));
    }

    private _mongoConnection() {
        mongoose
            .connect(process.env.DATABASE_URI || "")
            .then(() => {})
            .catch(() => {});

        mongoose.connection.on("connected", () => {
            console.log("Mongo db connected successfully...");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Mongo db connection failed...");
        });
    }

    private _templateEjs() {
        this._app.set("view engine", "ejs");
        this._app.set("views", `${process.cwd()}/source/views`);
    }

    private _routes() {
        this._app.use(APP_ROUTER);
    }

    private _errorHandler() {
        this._app.use(
            (err, req: Request, res: Response, next: NextFunction) => {
                console.dir(
                    { "main.ts:69:err": err },
                    { depth: null, colors: true }
                );

                res.status(err.statusCode ?? 500).json({
                    success: err.success ?? false,
                    statusCode: err.statusCode ?? 500,
                    message: err.message ?? "internal server error",
                    redirect: err.redirect ?? undefined,
                });
            }
        );
    }

    private _ioConnection() {
        SocketServiceClass.getInstance(this._io);
    }
}
new Main();
