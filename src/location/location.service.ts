import { Injectable } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class LocationService {


    async getLocation(req: Request) {
        const ip =
            req.headers['x-forwarded-for']?.toString().split(',')[0] ||
            req.socket.remoteAddress;
        // const ip = "8.8.8.8"; // Google public Domain name system (DNS) server IP address for testing

        const geo = geoip.lookup(ip);

        console.log('IP:', ip);
        console.log('Geo Location:', geo);

        return {
            ip,
            geo,
        };
    }

    async getAddress(latitude: number, longitude: number) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
        );

        return response.data.results[0]?.formatted_address;
    }
}