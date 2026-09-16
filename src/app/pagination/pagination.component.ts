import { Component } from '@angular/core';
import { AppCodeComponent } from '../code/code.component';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    imports: [CodeSandboxComponent, AppCodeComponent]
})
export class PaginationComponent {
    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { SpikePaginationComponent } from 'app/components/pagination/pagination.component';`
    };

    readonly paginationSnippet: ISnippet = {
        lang: 'html',
        code: `<nav aria-label="Page navigation">
    <ul class="pagination">
        <li class="disabled">
            <a aria-label="First">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="disabled">
            <a aria-label="Previous">
                <span aria-hidden="true">&lsaquo;</span>
            </a>
        </li>
        <li class="active"><a>1</a></li>
        <li><a>2</a></li>
        <li><a>3</a></li>
        <!-- Add more page numbers as needed -->
        <li>
            <a aria-label="Next">
                <span aria-hidden="true">&rsaquo;</span>
            </a>
        </li>
        <li>
            <a aria-label="Last">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
</nav>`
    };
}
