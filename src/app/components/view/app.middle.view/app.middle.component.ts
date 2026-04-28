import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { IndicadorTipoGastoEnum } from "../../../models/gasto.tipo.enum";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { DialogNovoGastoComponent } from "../../ui/dialog/novo.gasto/dialog.novo.gasto.component";
import { MesModel } from "../../../models/month.model";
import { PatrimonioModel } from "../../../models/patrimonio.model";
import { GrupoAvulsoModel } from "../../../models/grupo.avulso.model";

@Component({
    selector: 'app-middle-component',
    templateUrl: './app.middle.component.html',
    styleUrls: ['./app.middle.component.scss'],
    imports: [
        FormsModule, DatePipe, CurrencyPipe,
        TableModule, CommonModule, ButtonModule, ConfirmDialogModule,
        DialogNovoGastoComponent
    ],
    providers: [
        ConfirmationService
    ]
})
export class AppMiddleComponent implements OnChanges {

    @Input('settings') settings: SettingsModel;
    @Input('mes') mes: MesModel;
    @Input('gastos') gastos: GastosModel[];
    @Input('patrimonio') patrimonio: PatrimonioModel;

    @Output('onEditarGasto') onEditarGasto = new EventEmitter<GastosModel>();
    @Output('onRemoverGasto') onRemoverGasto = new EventEmitter<GastosModel>();
    @Output('onMarcarGasto') onMarcarGasto = new EventEmitter<GastosModel>();

    @ViewChild('dialogNovoGasto') dialogNovoGasto: DialogNovoGastoComponent;

    TipoGastoEnum = IndicadorTipoGastoEnum;

    listaGastos: any[] = [];
    expandedGroups: { [key: string]: boolean } = {};

    constructor(private confirmationService: ConfirmationService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['gastos']) {
            this.montarDados();
        }
    }

    montarDados(): void {
        if (!this.gastos) return;

        const fixos = this.gastos.filter(g => g.tipoGasto === this.TipoGastoEnum.FIXO);
        const parcelados = this.gastos.filter(g => g.tipoGasto === this.TipoGastoEnum.PARCELADO);
        const avulsos = this.gastos.filter(g => g.tipoGasto === this.TipoGastoEnum.AVULSO);

        const gruposAvulsos: GrupoAvulsoModel[] = Object.values(
            avulsos.reduce((acc: Record<string, GrupoAvulsoModel>, gasto) => {
                if (!acc[gasto.icone]) {
                    acc[gasto.icone] = {
                        isGroup: true,
                        tipoGasto: this.TipoGastoEnum.AVULSO,
                        icone: gasto.icone,
                        descricao: `Grupo ${gasto.icone}`,
                        total: 0,
                        itens: [],
                        latestDate: null,
                        pago: avulsos.some(s => s.pago == true)
                    };
                }

                acc[gasto.icone].total += gasto.valor;
                acc[gasto.icone].itens.push(gasto);

                const atual = acc[gasto.icone].latestDate;

                if (!atual || gasto.dataGasto > atual) {
                    acc[gasto.icone].latestDate = gasto.dataGasto;
                }


                return acc;
            }, {})
        );
        gruposAvulsos.sort((a, b) => b.total - a.total);

        this.listaGastos = [
            ...fixos,
            ...parcelados,
            ...gruposAvulsos
        ];
    }
    toggleGroup(icone: string): void {
        this.expandedGroups[icone] = !this.expandedGroups[icone];
    }

    editarGasto(gasto: GastosModel): void {
        this.dialogNovoGasto.abrirParaEditar(gasto);
    }

    removerGasto(gasto: GastosModel): void {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja remover o gasto "${gasto.descricao}"?`,
            header: 'Confirmação de Remoção',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Confirmar',
            acceptButtonStyleClass: 'p-button-success',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => this.onRemoverGasto.emit(gasto)
        });
    }

    onFinalizarEdicao(gasto: GastosModel): void {
        this.onEditarGasto.emit(gasto);
    }

    marcarGasto(gasto: GastosModel): void {
        this.onMarcarGasto.emit(gasto);
    }
}
