import { Component, signal } from '@angular/core';
import { LoaderComponent } from './components/interceptos/loader.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [
        LoaderComponent,
        RouterOutlet
    ]
})
export class App {
    protected readonly title = signal('NecroFinances');
}
