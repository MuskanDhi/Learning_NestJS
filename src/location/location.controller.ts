import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get()
    getLocation(@Req() req: Request) {
        return this.locationService.getLocation(req);
    }

    @Post('address')
    async getAddress(
        @Body() { latitude, longitude }: { latitude: number; longitude: number },
    ) {
        return this.locationService.getAddress(latitude, longitude);
    }
}