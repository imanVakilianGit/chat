export interface ResponseDataInterface<T> {
    statusCode?: number;
    message?: string;
    redirect?: string;
    data?: T;
}
