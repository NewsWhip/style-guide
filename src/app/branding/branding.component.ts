import { Component } from '@angular/core';
import { AppCodeComponent } from '../code/code.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-branding',
    templateUrl: './branding.component.html',
    styleUrls: ['./branding.component.scss'],
    imports: [AppCodeComponent]
})
export class BrandingComponent {
    readonly headTagSnippet: ISnippet = {
        lang: 'html',
        code: `<meta name="theme-color" content="#383838">
            <link rel="shortcut icon" type="image/png" href="images/favicons/favicon.ico">
            <link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-touch-icon.png">
            <link rel="icon" type="image/png" href="images/favicons/favicon-32x32.png" sizes="32x32">
            <link rel="icon" type="image/png" href="images/favicons/favicon-16x16.png" sizes="16x16">
            <link rel="mask-icon" href="images/favicons/safari-pinned-tab.svg" color="#383838">`
    };
}
