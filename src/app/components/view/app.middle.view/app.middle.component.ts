import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { CardModule } from "primeng/card";
import { IconesDescricao, IconesEnum } from "../../../models/icones.enum";
import { GastoConsolidadoModel } from "../../../models/gasto.consolidado.model";
import { DialogVisualizarOrigemComponent } from "../../ui/dialog/dialog.visualizar.origem/dialog.visualizar.origem.component";
import { GastosModel } from "../../../models/gasto.model";
import { DashboardModel } from "../../../models/main.data.model";

@Component({
    selector: 'app-middle-component',
    templateUrl: './app.middle.component.html',
    styleUrls: ['./app.middle.component.scss'],
    imports: [
        CommonModule, FormsModule, CurrencyPipe,
        CardModule, TableModule, ButtonModule,
        DialogVisualizarOrigemComponent
    ],
    providers: [
        ConfirmationService
    ]
})
export class AppMiddleComponent implements OnChanges {

    gastoConsolidado: GastoConsolidadoModel;

    @Input() data: DashboardModel = new DashboardModel();

    @Output() onEditarGastos: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();
    @Output() onRemoverGastos: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();

    @ViewChild('dialogOrigem') dialogOrigem: DialogVisualizarOrigemComponent;

    constructor(
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {

        }
    }

    getClassValor(valor: number): string {
        if (!valor) return '';

        if (valor < 0) {
            return 'valor-negativo';
        } else if (valor == 0) {
            return 'valor-zerado';
        } else {
            return 'valor-positivo';
        }
    }

    getClassValorDivida(valor: number): string {
        if (!valor) return '';

        if (valor < 0) {
            return 'valor-positivo';
        } else if (valor == 0) {
            return 'valor-zerado';
        } else {
            return 'valor-negativo';
        }
    }

    getIconValor(valor: number): string {
        if (!valor) return '';

        if (valor == 0) {
            return '';
        }

        if (valor >= 1000) {
            return 'pi pi-angle-double-up';
        } else if (valor > 0) {
            return 'pi pi-angle-up';
        } else if (valor > -1000) {
            return 'pi pi-angle-down';
        } else {
            return 'pi pi-angle-double-down'
        }
    }

    getIconValorDivida(valor: number): string {
        if (!valor) return '';

        if (valor == 0) {
            return '';
        }

        if (valor >= 1000) {
            return 'pi pi-angle-double-down';
        } else if (valor > 0) {
            return 'pi pi-angle-down';
        } else if (valor > -1000) {
            return 'pi pi-angle-up';
        } else {
            return 'pi pi-angle-double-up';
        }
    }

    getClassRestante(valor: number): string {
        if (valor >= 1000) {
            return 'card-restante-excelente';
        }

        if (valor >= 500) {
            return 'card-restante-bom';
        }

        if (valor > 0) {
            return 'card-restante-alerta';
        }

        return 'card-restante-negativo';
    }

    getIconRestante(valor: number): string {
        if (valor >= 1000) {
            return 'pi pi-star';
        }

        if (valor >= 500) {
            return 'pi pi-thumbs-up';
        }

        if (valor > 0) {
            return 'pi pi-minus-circle';
        }

        return 'pi pi-thumbs-down';
    }

    getBarColor(valor: number): string {
        if (!valor) return '';

        const clamped = Math.max(0, Math.min(1, valor));
        const normalized = Math.min(1, clamped / 0.2);
        const hue = 120 - (120 * normalized);

        return `hsl(${hue}, 70%, 50%)`;
    }

    getCorAvaliacaoMes(): string {
        if (this.data.totalRestante >= 500) {
            return 'lime';
        } else if (this.data.totalRestante > 0 && this.data.totalRestante < 500) {
            return 'orange';
        } else {
            return 'tomato';
        }
    }

    getBordaDiferenca(valor: number) {
        if (valor < 0) {
            //return 'border-lime';
        }

        if (valor > 0) {
            //return 'border-tomato';
        }

        return '';
    }

    getBordaDiferencaDivida(valor: number) {
        if (valor < 0) {
            //return 'border-tomato';
        }

        if (valor > 0) {
            //return 'border-lime';
        }

        return '';
    }

    abrirOrigem(item: GastoConsolidadoModel): void {
        this.gastoConsolidado = item;
        this.dialogOrigem.open(item);
    }

    getDescricao(categoria: string): string {
        return IconesDescricao[categoria as IconesEnum];
    }

    editarGasto(item: GastosModel): void {
        this.onEditarGastos.emit(item);
    }

    removerGasto(item: GastosModel): void {
        this.onRemoverGastos.emit(item);
    }
}
