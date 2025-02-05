export interface ResponseInterface<T> {
    success: true;
    statusCode: number;
    message: string;
    redirect?: string;
    data?: T;
}
