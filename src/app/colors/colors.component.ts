import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-colors',
    templateUrl: './colors.component.html'
})
export class ColorsComponent implements OnInit {
// todo DM Add Levels, add docs not to use light-steps.
    public showColorCodes: boolean = false;
    public colorNames = [
        "levels",
        "gray",
        "primary",
        "secondary",
        "tertiary",
        "alt",
        "coolgray"
    ];

    public shades = [
        "dark",
        "base",
        "light",
        "x-light",
        "2x-light",
        "3x-light",
        "4x-light",
        "5x-light",
        "6x-light"
    ];

    public levelsShades = this.shades.slice(1, 7);

    public standaloneColors = [
        "yellow",
        "green"
    ];

    constructor(private _chRef: ChangeDetectorRef) { }

    ngOnInit() {
        setTimeout(() => {
            this.showColorCodes = true;
        }, 100)
    }

    getColors(splash):string {
        let rgb = getComputedStyle(splash).backgroundColor;

        return `
            ${this.getHex(rgb)}<br><br>
            ${this.getRgb(rgb)}<br><br>
            ${this.getHsl(rgb)}<br><br>
            ${this.getHsb(rgb)}
        `;
    }

    getHex(rgbString) {
        return this.rgb2hex(rgbString);
    }

    getRgb(rgbString) {
        return rgbString;
    }

    getHsb(rgbString) {
        let rgb = rgbString.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        let hsv = this.rGBtoHsb(parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10));
        let h = Math.round(hsv.h * 360);
        let s = Math.round(hsv.s * 100);
        let b = Math.round(hsv.v * 100);

        return `hsb(${h}, ${s}%, ${b}%)`
    }

    getHsl(rgbString) {
        let rgb = rgbString.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        let hsl = this.rgbToHsl(parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10));
        let hue = Math.round(hsl[0]);
        let sat = Math.round(hsl[1]);
        let light = Math.round(hsl[2]);

        return `hsl(${hue}, ${sat}%, ${light})%`;
    }

    rgb2hex(rgbString) {
        let rgb = rgbString.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h *= 60;
        }

        return [h, s * 100, l*100];
    }

    rGBtoHsb(r, g, b) {
        if (arguments.length === 1) {
            g = r.g, b = r.b, r = r.r;
        }
        var max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;

        switch (max) {
            case min: h = 0; break;
            case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
            case g: h = (b - r) + d * 2; h /= 6 * d; break;
            case b: h = (r - g) + d * 4; h /= 6 * d; break;
        }

        return {
            h: h,
            s: s,
            v: v
        };
    }

}
