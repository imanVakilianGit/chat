import { ErrorDataInterface } from "../interface/error-data.interface";
import { ExceptionHandlerInterface } from "../interface/exception-handler.interface";

export function exceptionHandler(
    errorData: ErrorDataInterface = {}
): ExceptionHandlerInterface {
    return {
        success: false,
        statusCode: errorData.statusCode ?? 500,
        message: errorData.message ?? "internal server error",
        redirect: errorData.redirect ?? undefined,
    };
}
