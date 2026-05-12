import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { GastosModel } from '../../../../models/gasto.model';

@Component({
    selector: 'dialog-lista-gastos',
    templateUrl: './dialog.lista.gastos.component.html',
    styleUrls: ['./dialog.lista.gastos.component.scss'],
    imports: [
        CommonModule, DialogModule, ButtonModule, FormsModule, CurrencyPipe
    ],
    providers: [
        ConfirmationService, DatePipe, CurrencyPipe
    ]
})
export class DialogListaGastoComponent {
    visible: boolean = false;
    header: string = '';
    gastos: GastosModel[];
    total: number;

    constructor (
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe
    ) {

    }

    onVisibleChange(event: boolean) {
        this.visible = event;
    }

    open(total: number, gastos: GastosModel[]): void {
        this.header = `${this.datePipe.transform(gastos[0].dataGasto, 'dd/MM/yyyy')} | ${this.currencyPipe.transform(total, 'BRL', 'symbol', '1.2-2', 'pt-BR' )}`;
        this.total = total;
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
