// redis.service.ts

import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    client = createClient({
        url: 'redis://localhost:6379',
    });

    constructor() {
        this.client.connect();
    }
}