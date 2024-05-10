type Response = {
    success: boolean;
    data?: any;
    error?: any;
    message?: any;
}

export class BaseController {

    // respond with a spesific type of response for consistent uses
    respond(data: any, is_success: boolean, message?: string): object {
        const response: Response = {
            success: is_success,
            message,
        }

        if(!data) return response;

        if (!is_success) response['error'] = data
        else response['data'] = data

        return response;
    }
}