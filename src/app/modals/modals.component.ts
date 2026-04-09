import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-modals',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf]
})
export class ModalsComponent implements OnInit {
    private _fb = inject(FormBuilder);
    private _dialog = inject(Dialog);


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
