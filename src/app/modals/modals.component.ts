import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-modals',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.scss']
})
export class ModalsComponent implements OnInit {

    @ViewChild('modalTmpl') modalTmpl: TemplateRef<any>;

    public form: FormGroup;
    public sizes: { name: string; id: 'sm' | 'md' | 'lg' | 'fullscreen' }[] = [
        {
            id: 'sm',
            name: 'Small'
        },
        {
            id: 'md',
            name: 'Medium'
        },
        {
            id: 'lg',
            name: 'Large'
        },
        {
            id: 'fullscreen',
            name: 'Fullscreen'
        }
    ];

    constructor(
        private _fb: FormBuilder,
        private _dialog: Dialog) { }

    ngOnInit() {
        this.form = this._fb.group({
            size: 'md',
            modalType: 'standard',
            transparentBackdrop: false
        });
    }

    openModal() {
        const backdropClass = this.form.get('transparentBackdrop').value ?
            ['modal-backdrop', 'transparent'] :
            'modal-backdrop';

        this._dialog.open(this.modalTmpl, {
            backdropClass
        });
    }

    closeModal() {
        this._dialog.closeAll();
    }
}
