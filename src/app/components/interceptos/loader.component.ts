import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if(loader.loading$ | async) {
        <div class="loader-overlay">
            <div class="spinner"></div>
        </div>
        }
    `,
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {

    constructor(
        public loader: LoaderService
    ) {

    }
}