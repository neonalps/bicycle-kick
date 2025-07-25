import { Dispatcher, request } from "undici";
import { HTTP_METHOD } from "./constants";

export interface HttpResponse<T> {
    statusCode: number;
    body: T;
	errorMessage?: string;
}

export class HttpClient {

    get = async <T> (url: string, options?: { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, 'origin' | 'path' | 'method'> & Partial<Pick<Dispatcher.RequestOptions, 'method'>> & { textOnly?: boolean }): Promise<HttpResponse<T>> => {
        return this.performRequest(url, { ...options, method: HTTP_METHOD.GET });
    };
    
    post = async <T> (url: string, options?: { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, 'origin' | 'path' | 'method'> & Partial<Pick<Dispatcher.RequestOptions, 'method'>> & { textOnly?: boolean }): Promise<HttpResponse<T>> => {
        return this.performRequest(url, { ...options, method: HTTP_METHOD.POST });
    };

    private performRequest = async <T> (url: string, options?: { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, 'origin' | 'path' | 'method'> & Partial<Pick<Dispatcher.RequestOptions, 'method'>> & { textOnly?: boolean }): Promise<HttpResponse<T>> => {
        const { statusCode, body } = await request(url, options);

        const bodyValue = options?.textOnly === true ? await body.text() : await body.json();

        return {
            statusCode,
            body: bodyValue as T,
        }
    };

}