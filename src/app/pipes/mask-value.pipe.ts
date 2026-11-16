import { Pipe, PipeTransform, inject } from "@angular/core";
import { ValueVisibilityService } from "../services/value-visibility.service";

@Pipe({
    name: 'maskValue',
    standalone: true,
    pure: false
})
export class MaskValuePipe implements PipeTransform {
    private readonly visibility = inject(ValueVisibilityService);

    transform(value: string | number | null | undefined): string {
        return this.visibility.isHidden() ? '********' : String(value ?? '');
    }
}
