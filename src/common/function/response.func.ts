import { ErrorDataInterface } from "../interface/error-data.interface";
import { ExceptionHandlerInterface } from "../interface/exception-handler.interface";
import { ResponseDataInterface } from "../interface/response-data.interface";
import { ResponseInterface } from "../interface/response.interface";

export function response<T>(
    successData: ResponseDataInterface<T> = {}
): ResponseInterface<T> {
    return {
        success: true,
        statusCode: successData.statusCode ?? 200,
        message: successData.message ?? "ok",
        redirect: successData.redirect ?? undefined,
        data: successData.data,
    };
}
