import { Injectable } from '@angular/core';

@Injectable()
export class OrganizationRouteService {

    /**
     * 页码数
     * @type {number}
     */
    step: 0 | 1 | 2  = 0;



    constructor() {

    }
}

