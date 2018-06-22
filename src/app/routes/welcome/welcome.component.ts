import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-welcome-page',
    templateUrl: './welcome.component.html'
})

export class WelcomeComponent {
    constructor(private http: _HttpClient) {

    }
}