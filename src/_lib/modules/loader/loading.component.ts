import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: '[nwLoading]',
	template: `
        <div class="nw-loader"
            [class.spike-loading]="isLoading"
            [class.full-height]="isFullHeight">
            <nw-loader *ngIf="isLoading"
                [isLoading]="isLoading"
                [size]="size"
                [delayMs]="delayMs"
                [isInline]="isInline"></nw-loader>
		</div>

		<ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class LoadingComponent {

	@Input() isLoading: boolean = false;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() isFullHeight: boolean = false;
    @Input() delayMs: number = 700;
    @Input() isInline: boolean = false;

}
