import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { GastosModel } from '../../../../models/gasto.model';
import { GastoConsolidadoModel } from '../../../../models/gasto.consolidado.model';
import { DialogNovoGastoComponent } from '../novo.gasto/dialog.novo.gasto.component';
import { IconesDescricao, IconesEnum } from '../../../../models/icones.enum';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-dialog-visualizar-origem',
    standalone: true,
    templateUrl: './dialog.visualizar.origem.component.html',
    styleUrls: ['./dialog.visualizar.origem.component.scss'],
    imports: [
        CommonModule, DialogModule, ButtonModule, FormsModule, DialogNovoGastoComponent, CurrencyPipe, ConfirmDialogModule
    ],
    providers: [
        ConfirmationService
    ]
})
export class DialogVisualizarOrigemComponent {
    visible: boolean = false;
    header: string = 'Gastos que compões a categoria';
    gastoConsolidado: GastoConsolidadoModel;

    @Output() onEditarGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();
    @Output() onRemoverGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();

    @ViewChild('dialogNovoGasto') dialogNovoGasto: DialogNovoGastoComponent;

    constructor (
        private confirmationService: ConfirmationService
    ) {

    }

    onVisibleChange(event: boolean) {
        this.visible = event;
    }

    open(item: GastoConsolidadoModel): void {
        this.header = `Gastos da categoria [ ${IconesDescricao[item.categoria as IconesEnum]} ]`;
        this.gastoConsolidado = item;
        this.visible = true;
    }

    onEdit(item: GastosModel): void {
        this.dialogNovoGasto.abrirParaEditar(item);
    }

    getBarColor(percentagem: number): string {
        if (percentagem >= 0.8) return '#ff4d4d';
        if (percentagem >= 0.5) return '#ffa500';
        return '#4caf50';
    }

    getClassValorDivida(diferenca: number): string {
        if (diferenca > 0) return 'texto-positivo';
        if (diferenca < 0) return 'texto-negativo';
        return '';
    }

    getBordaDiferenca(diferenca: number): string {
        if (diferenca > 0) return 'borda-positiva';
        if (diferenca < 0) return 'borda-negativa';
        return '';
    }

    getIconValor(diferenca: number): string {
        if (diferenca > 0) return 'pi pi-arrow-up';
        if (diferenca < 0) return 'pi pi-arrow-down';
        return 'pi pi-minus';
    }

    novoGasto(item: GastosModel): void {
        if (this.gastoConsolidado.origem) {
            const index = this.gastoConsolidado.origem.findIndex(g => g.id === item.id);
            if (index >= 0) {
                this.gastoConsolidado.origem[index] = item;
            }
        }
        this.onEditarGasto.emit(item);
    }

    onDelete(item: GastosModel): void {
        this.confirmationService.confirm({
            header: 'Remover gasto',
            message: `Confirmar remoção do gasto [${item.descricao}] da cateogira [${IconesDescricao[item.icone as IconesEnum]}]?`,
            acceptButtonStyleClass: 'p-button-danger',
            acceptIcon: 'pi pi-trash',
            acceptLabel: 'Remover Gasto',
            accept: () => {
                const index = this.gastoConsolidado.origem.findIndex(g => g.id === item.id);
                if (index >= 0) {
                    this.gastoConsolidado.origem.splice(index, 1);
                }
                this.onRemoverGasto.emit(item);
            },
            rejectButtonStyleClass: 'p-button-secondary',
            rejectLabel: 'Cancelar',
            reject: () => {

            }
        });
    }
}