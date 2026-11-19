import { AfterViewInit, Directive, Input, NgZone, OnDestroy, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';

export function parseAutoDecimalInput(digits: string, fractionDigits: number): number {
    const numericDigits = digits.replace(/\D/g, '');

    return Number(numericDigits || '0') / 10 ** fractionDigits;
}

@Directive({
    selector: 'p-inputNumber[appAutoDecimalInput], p-inputnumber[appAutoDecimalInput], p-input-number[appAutoDecimalInput]',
    standalone: true
})
export class AutoDecimalInputDirective implements AfterViewInit, OnDestroy {
    @Input() appAutoDecimalInput = 2;

    private readonly inputNumber = inject(InputNumber);
    private readonly ngControl = inject(NgControl, { self: true });
    private readonly zone = inject(NgZone);
    private inputElement!: HTMLInputElement;
    private digits = '';
    private replaceOnNextDigit = true;
    private selectionTimer: number | undefined;
    private readonly listeners: Array<() => void> = [];

    ngAfterViewInit(): void {
        this.inputElement = this.inputNumber.input.nativeElement;
        this.listen('focus', this.onFocus, true);
        this.listen('blur', this.onBlur, true);
        this.listen('keydown', this.onKeyDown, true);
        this.listen('input', this.onNativeInput, true);
        this.listen('paste', this.onPaste, true);
    }

    ngOnDestroy(): void {
        this.listeners.forEach(removeListener => removeListener());
        if (this.selectionTimer !== undefined) {
            window.clearTimeout(this.selectionTimer);
        }
    }

    private readonly onFocus: EventListener = (): void => {
        this.digits = '';
        this.replaceOnNextDigit = true;
        this.inputElement.select();
    };

    private readonly onBlur: EventListener = (): void => {
        this.digits = '';
        this.replaceOnNextDigit = true;
    };

    private readonly onKeyDown: EventListener = (rawEvent): void => {
        const event = rawEvent as KeyboardEvent;
        if (event.ctrlKey || event.metaKey || event.altKey) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
                this.replaceOnNextDigit = true;
            }
            return;
        }

        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.appendDigits(event.key);
            return;
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.removeDigit();
            return;
        }

        if (event.key === '.' || event.key === ',') {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    private readonly onNativeInput: EventListener = (event): void => {
        const inputEvent = event as InputEvent;
        if (inputEvent.data && /^\d+$/.test(inputEvent.data)) {
            this.appendDigits(inputEvent.data);
        } else if (inputEvent.inputType === 'deleteContentBackward' || inputEvent.inputType === 'deleteContentForward') {
            this.removeDigit();
        }
    };

    private readonly onPaste: EventListener = (rawEvent): void => {
        const event = rawEvent as ClipboardEvent;
        event.preventDefault();
        event.stopImmediatePropagation();

        const pastedDigits = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
        this.setDigits(this.replaceOnNextDigit ? pastedDigits : `${this.digits}${pastedDigits}`);
    };

    private appendDigits(value: string): void {
        this.setDigits(`${this.replaceOnNextDigit ? '' : this.digits}${value}`);
    }

    private removeDigit(): void {
        this.setDigits(this.replaceOnNextDigit ? '' : this.digits.slice(0, -1));
    }

    private setDigits(digits: string): void {
        this.digits = digits;
        this.replaceOnNextDigit = false;

        const control = this.ngControl.control;
        if (!control) {
            throw new Error('AutoDecimalInputDirective requires a form control.');
        }

        const value = parseAutoDecimalInput(digits, this.appAutoDecimalInput);
        this.zone.run(() => control.setValue(value));

        if (this.selectionTimer !== undefined) {
            window.clearTimeout(this.selectionTimer);
        }
        this.selectionTimer = window.setTimeout(() => {
            const end = this.inputElement.value.length;
            this.inputElement.setSelectionRange(end, end);
        });
    }

    private listen(eventName: string, handler: EventListener, capture = false): void {
        this.inputElement.addEventListener(eventName, handler, capture);
        this.listeners.push(() => this.inputElement.removeEventListener(eventName, handler, capture));
    }
}
