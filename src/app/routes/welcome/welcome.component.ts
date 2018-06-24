import {Component, Inject} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';

@Component({
    selector: 'app-welcome-page',
    templateUrl: './welcome.component.html'
})

export class WelcomeComponent {

    version = [
        '教师版',
        'Admin版'
    ];

    showVersion: any;

    constructor(private http: _HttpClient,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
        if(this.tokenService.get().gid == 28){
            this.showVersion = this.version[0];
        }else if(this.tokenService.get().gid == 27){
            this.showVersion = this.version[1];
        }
    }
}