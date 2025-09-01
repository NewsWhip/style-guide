import { FormControl } from "@angular/forms";

export interface IValidationChange {
    isValid: boolean;
    emails: string[];
    control: FormControl;
}
