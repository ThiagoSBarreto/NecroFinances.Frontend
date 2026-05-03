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
        if (!valor) return '';

        if (valor > 0) {
            return 'card-restante-positivo';
        }

        return 'card-restante-negativo';
    }

    getBarColor(valor: number): string {
        if (!valor) return '';

        const clamped = Math.max(0, Math.min(1, valor));
        const normalized = Math.min(1, clamped / 0.2);
        const hue = 120 - (120 * normalized);

        return `hsl(${hue}, 70%, 50%)`;
    }

    getClassAvaliacaoMes(): string {
        const v = this.data.totalRestante;

        if (v >= 1500) {
            return 'pi pi-star-fill icone-avaliacao valor-positivo-forte';
        }
        else if (v >= 1000) {
            return 'pi pi-trophy icone-avaliacao valor-positivo-forte';
        }
        else if (v >= 700) {
            return 'pi pi-thumbs-up icone-avaliacao valor-positivo';
        }
        else if (v >= 500) {
            return 'pi pi-check-circle icone-avaliacao valor-positivo';
        }
        else if (v >= 300) {
            return 'pi pi-arrow-up icone-avaliacao valor-positivo-leve';
        }
        else if (v >= 100) {
            return 'pi pi-plus-circle icone-avaliacao valor-positivo-leve';
        }
        else if (v > 0) {
            return 'pi pi-minus-circle icone-avaliacao valor-neutro';
        }
        else if (v >= -100) {
            return 'pi pi-exclamation-circle icone-avaliacao valor-alerta';
        }
        else if (v >= -300) {
            return 'pi pi-exclamation-triangle icone-avaliacao valor-alerta';
        }
        else if (v >= -500) {
            return 'pi pi-arrow-down icone-avaliacao valor-negativo';
        }
        else if (v >= -1000) {
            return 'pi pi-times-circle icone-avaliacao valor-negativo';
        }
        else {
            return 'pi pi-ban icone-avaliacao valor-negativo-forte';
        }
    }

    getTextoAvaliacaoDoMes(): string {
        const v = this.data.totalRestante;

        if (v >= 1500) {
            return 'Resultado excelente! Sobra muito consistente — você já está em nível de otimização financeira.';
        }
        else if (v >= 1000) {
            return 'Ótimo mês! Sobra acima de R$1.000 — excelente controle.';
        }
        else if (v >= 700) {
            return 'Muito bom! Resultado forte e consistente.';
        }
        else if (v >= 500) {
            return 'Bom resultado! Você está mantendo um padrão positivo.';
        }
        else if (v >= 300) {
            return 'Positivo 👍 Dá para melhorar, mas já está no caminho certo.';
        }
        else if (v >= 100) {
            return 'Levemente positivo. Pequenos ajustes já fazem diferença aqui.';
        }
        else if (v > 0) {
            return 'Quase neutro, mas ainda positivo. Atenção aos pequenos gastos.';
        }
        else if (v >= -100) {
            return 'Quase equilibrado. Um pequeno ajuste já vira o jogo.';
        }
        else if (v >= -300) {
            return 'Leve negativo. Vale revisar alguns gastos do mês.';
        }
        else if (v >= -500) {
            return 'Negativo moderado. Hora de ajustar prioridades.';
        }
        else if (v >= -1000) {
            return 'Mês difícil. Importante revisar o que pesou mais.';
        }
        else {
            return 'Resultado crítico. Vale uma revisão mais profunda para recuperar o controle.';
        }
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
            return 'border-lime';
        }

        if (valor > 0) {
            return 'border-tomato';
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
