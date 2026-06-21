import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Method } from 'axios';

@Injectable()
export class ProxyService {
    constructor(private readonly httpService: HttpService) {}

    async repassar(
        baseUrl: string,
        path: string,
        method: Method,
        body?: any,
    ): Promise<any> {
        const url = `${baseUrl}${path}`;

        const response = await firstValueFrom(
            this.httpService.request({
                url,
                method,
                data: body,
            }),
        );

        return response.data;
    }
}