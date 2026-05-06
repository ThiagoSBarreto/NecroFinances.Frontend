import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'dialog-gastos-diarios',
    templateUrl: './dialog.gastos.diarios.component.html',
    styleUrls: ['./dialog.gastos.diarios.component.scss'],
    imports: [
        CommonModule, DialogModule, ButtonModule, FormsModule, CurrencyPipe
    ],
    providers: [
        ConfirmationService
    ]
})
export class DialogGastosDiariosComponent {
    visible: boolean = false;
    header: string = 'Gastos Diários';
    gastos: DiaGastoModel[];

    constructor (
        
    ) {

    }

    onVisibleChange(event: boolean) {
        this.visible = event;
    }

    open(gastos: DiaGastoModel[]): void {
        this.gastos = gastos;
        this.visible = true;
    }

    getBarColor(percentagem: number): string {
        if (percentagem >= 0.8) return '#ff4d4d';
        if (percentagem >= 0.5) return '#ffa500';
        return '#4caf50';
    }

    getClassValorDivida(diferenca?: number): string {
        if (!diferenca) return '';
        if (diferenca < 0) return 'texto-positivo';
        if (diferenca > 0) return 'texto-negativo';
        return '';
    }

    getBordaDiferenca(diferenca: number | undefined): string {
        if (!diferenca) return '';
        if (diferenca < 0) return 'borda-positiva';
        if (diferenca > 0) return 'borda-negativa';
        return '';
    }

    getIconValor(diferenca: number | undefined): string {
        if (!diferenca) return '';
        if (diferenca >= 1000) return 'pi pi-angle-double-up';
        if (diferenca >= 0) return 'pi pi-angle-up';
        if (diferenca >= -500) return 'pi pi-angle-down';
        return 'pi pi-angle-double-down';
    }
}
