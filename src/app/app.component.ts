import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {}
