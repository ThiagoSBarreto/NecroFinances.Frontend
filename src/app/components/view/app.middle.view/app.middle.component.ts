import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { CardModule } from "primeng/card";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { IconesDescricao, IconesEnum } from "../../../models/icones.enum";
import { GastoConsolidadoModel } from "../../../models/gasto.consolidado.model";
import { DialogVisualizarOrigemComponent } from "../../ui/dialog/dialog.visualizar.origem/dialog.visualizar.origem.component";
import { GastosModel } from "../../../models/gasto.model";
import { DashboardModel } from "../../../models/main.data.model";
import { IndicadorTipoRecursoEnum } from "../../../models/gasto.tipo.enum";
import { DialogNovoGastoComponent } from "../../ui/dialog/novo.gasto/dialog.novo.gasto.component";
import { DiaGastoModel } from "../../../models/dia.gasto.model";
import { DateUtils } from "../../../helpers/data.utils";

@Component({
    selector: 'app-middle-component',
    templateUrl: './app.middle.component.html',
    styleUrls: ['./app.middle.component.scss'],
    imports: [
        CommonModule, FormsModule, CurrencyPipe,
        CardModule, TableModule, ButtonModule,
        DialogVisualizarOrigemComponent, DialogNovoGastoComponent, ConfirmDialogModule
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
    @Output() onNovoGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();

    @ViewChild('dialogOrigem') dialogOrigem: DialogVisualizarOrigemComponent;
    @ViewChild('dialogNovoGasto') dialogNovoGasto: DialogNovoGastoComponent;

    Math: Math;
    abaMobile: 'resumo' | 'gastos' = 'resumo';
    gastosPorDia: DiaGastoModel[] = [];
    private diaExpandido: string | null = null;

    constructor(
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.atualizarGastosPorDia();
        }
    }

    private atualizarGastosPorDia(): void {
        const grupos = new Map<string, DiaGastoModel>();
        const gastos = [
            ...(this.data?.listaGastosAvulsos ?? []),
            ...(this.data?.listaGastosParcelados ?? [])
        ].flatMap(item => item.origem ?? []);

        gastos.forEach(gasto => {
            const dia = DateUtils.parseLocalDate(gasto.dataGasto);
            const chave = gasto.dataGasto;
            const grupo = grupos.get(chave);

            if (grupo) {
                grupo.total += gasto.valor;
                grupo.gastos.push(gasto);
            } else {
                grupos.set(chave, {
                    data: dia,
                    total: gasto.valor,
                    percentagem: 0,
                    gastos: [gasto]
                });
            }
        });

        this.gastosPorDia = Array.from(grupos.values())
            .sort((a, b) => a.data.getTime() - b.data.getTime());

        const total = this.gastosPorDia.reduce((valor, dia) => valor + dia.total, 0);
        this.gastosPorDia.forEach((dia, index) => {
            dia.percentagem = total ? dia.total / total : 0;
            if (index > 0) {
                dia.diferenca = dia.total - this.gastosPorDia[index - 1].total;
            }
        });
    }

    adicionarGasto(): void {
        this.dialogNovoGasto.abrirParaAdicionar();
    }

    onAdicionarGasto(gasto: GastosModel): void {
        this.onNovoGasto.emit(gasto);
    }

    alternarDia(dia: DiaGastoModel): void {
        const chave = this.chaveDia(dia);
        this.diaExpandido = this.diaExpandido === chave ? null : chave;
    }

    isDiaExpandido(dia: DiaGastoModel): boolean {
        return this.diaExpandido === this.chaveDia(dia);
    }

    editarGastoMobile(gasto: GastosModel): void {
        this.dialogNovoGasto.abrirParaEditar(gasto);
    }

    confirmarRemocaoMobile(gasto: GastosModel): void {
        this.confirmationService.confirm({
            header: 'Remover gasto',
            message: `Confirmar remoção do gasto [${gasto.descricao}]?`,
            acceptButtonStyleClass: 'p-button-danger',
            acceptIcon: 'pi pi-trash',
            acceptLabel: 'Remover Gasto',
            rejectButtonStyleClass: 'p-button-secondary',
            rejectLabel: 'Cancelar',
            accept: () => this.removerGasto(gasto)
        });
    }

    private chaveDia(dia: DiaGastoModel): string {
        return `${dia.data.getFullYear()}-${dia.data.getMonth()}-${dia.data.getDate()}`;
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

    obtemClassPosicaoFinanceira(): string {
        if (this.data.totalPatrimonio > 0) {
            return 'card-posicao-financeira-good';
        }
        return 'card-posicao-financeira-bad';
    }

    abrirOrigem(item: GastoConsolidadoModel): void {
        this.gastoConsolidado = item;
        this.dialogOrigem.open(item);
    }

    getDescricao(categoria: string): string {
        return IconesDescricao[categoria as IconesEnum];
    }

    get gastosParceladosCredito(): GastoConsolidadoModel[] {
        return this.data.listaGastosParcelados?.filter(item => item.tipoRecurso === IndicadorTipoRecursoEnum.CARTAO) ?? [];
    }

    editarGasto(item: GastosModel): void {
        this.onEditarGastos.emit(item);
    }

    removerGasto(item: GastosModel): void {
        this.onRemoverGastos.emit(item);
    }
}
