import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-branding',
    templateUrl: './branding.component.html',
    styleUrls: ['./branding.component.scss'],
    standalone: false
})
export class BrandingComponent implements OnInit {

    public unsafeHeadTag: string =`
<meta name="theme-color" content="#383838">

<link rel="shortcut icon" type="image/png" href="images/favicons/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="images/favicons/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="images/favicons/favicon-16x16.png" sizes="16x16">
<link rel="mask-icon" href="images/favicons/safari-pinned-tab.svg" color="#383838">`;

    ngOnInit() {
    }

    escapeHtml(unsafe: string) {
        return unsafe
            .trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

}
