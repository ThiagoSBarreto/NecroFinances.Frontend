import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { ToolbarModule } from "primeng/toolbar";
import { CommonModule } from "@angular/common";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { DialogNovoGastoComponent } from "../../ui/dialog/novo.gasto/dialog.novo.gasto.component";
import { DialogEditarSettingsComponent } from "../../ui/dialog/dialog.editar.valor.settings/dialog.editar.settings.component";
import { MesModel } from "../../../models/month.model";
import { PatrimonioModel } from "../../../models/patrimonio.model";
import { DialogEditarPatrimonioComponent } from "../../ui/dialog/dialog.editar.patrimonio/dialog.editar.patrimonio.component";
import { DashboardModel } from "../../../models/main.data.model";
import { GastoConsolidadoModel } from "../../../models/gasto.consolidado.model";
import { DialogGastosDiariosComponent } from "../../ui/dialog/dialog.gastos.diarios/dialog.gastos.diarios.component";
import { DiaGastoModel } from "../../../models/dia.gasto.model";

@Component({
    selector: 'app-top-bar-component',
    templateUrl: './app.top.bar.component.html',
    styleUrls: ['./app.top.bar.component.scss'],
    imports: [
        FormsModule, CommonModule,
        ButtonModule, DatePickerModule, ToolbarModule,
        DialogEditarSettingsComponent, DialogNovoGastoComponent, DialogGastosDiariosComponent,
        DialogEditarPatrimonioComponent,
    ]
})
export class AppTopBarComponent implements OnInit, OnChanges {

    @Input('settings') settings: SettingsModel;
    @Input('mes') mes: MesModel;
    @Input('patrimonio') patrimonio: PatrimonioModel;
    @Input('mainData') mainData: DashboardModel;

    @Output('onNovaData') onNovaData: EventEmitter<Date[]> = new EventEmitter<Date[]>();
    @Output('novoGasto') novoGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();
    @Output('onEditarSettings') onEditarSettings: EventEmitter<SettingsModel> = new EventEmitter<SettingsModel>();
    @Output('onLogout') onLogout: EventEmitter<void> = new EventEmitter<void>();
    @Output('onEditarPatrimonio') onEditarPatrimonio: EventEmitter<PatrimonioModel> = new EventEmitter<PatrimonioModel>();

    @ViewChild('dialogNovoGasto') dialogNovoGasto: DialogNovoGastoComponent;
    @ViewChild('dialogEditarSettings') dialogEditarSettings: DialogEditarSettingsComponent;
    @ViewChild('dialogEditarPatrimonio') dialogEditarPatrimonio: DialogEditarPatrimonioComponent;
    @ViewChild('dialogGastosDiarios') dialogGastosDiarios: DialogGastosDiariosComponent;

    rangeDates: Date[] = [];

    mesAtual: string = '';
    mesAnterior: string = '';
    proximoMes: string = '';

    gastoDiaAtual: number;
    diferencaGasto: number;

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['mes'] && this.mes) || (changes['settings'] && this.settings) || (changes['mainData'] && this.mainData)) {
            this.atualizarDados();
        }
    }

    ngOnInit(): void {
        this.setRangeDates();
    }

    setRangeDates(modifier: number = 0): void {
        const baseDay = 10;
        let start: Date;

        if (this.rangeDates && this.rangeDates.length === 2 && modifier !== 0) {
            const currentStart = this.rangeDates[0];
            start = new Date(
                currentStart.getFullYear(),
                currentStart.getMonth() + modifier,
                baseDay
            );
        } else {
            const today = new Date();
            const currentDay = today.getDate();
            let startMonth =
                currentDay >= baseDay ? today.getMonth() : today.getMonth() - 1;

            startMonth += modifier;

            start = new Date(today.getFullYear(), startMonth, baseDay);
        }

        const end = new Date(start);
        end.setDate(9);
        end.setMonth(start.getMonth() + 1);

        this.rangeDates = [start, end];
        this.atuaizaMesBase();
        this.onNovaData.emit(this.rangeDates);
    }

    prevMonth(): void {
        this.setRangeDates(-1);
    }

    nextMonth(): void {
        this.setRangeDates(1);
    }

    buscarDados(): void {
        this.setRangeDates();
    }

    atualizarDados(): void {
        if (!this.mainData) {
            return;
        }

        const listaParcelados: GastoConsolidadoModel[] = this.mainData.listaGastosParcelados;
        const listaAvulsos: GastoConsolidadoModel[] = this.mainData.listaGastosAvulsos;

        let gastoHoje: number = 0;
        let gastoOntem: number = 0;

        const hoje: Date = new Date();

        const ontem: Date = new Date();
        ontem.setDate(ontem.getDate() - 1);

        listaParcelados.forEach((item: GastoConsolidadoModel) => {
            item.origem?.forEach((gasto: GastosModel) => {
                const data: Date = new Date(gasto.dataGasto);

                if (this.isSameDay(data, hoje)) {
                    gastoHoje += gasto.valor;
                }

                if (this.isSameDay(data, ontem)) {
                    gastoOntem += gasto.valor;
                }
            });
        });

        listaAvulsos.forEach((item: GastoConsolidadoModel) => {
            item.origem?.forEach((gasto: GastosModel) => {
                const data: Date = new Date(gasto.dataGasto);

                if (this.isSameDay(data, hoje)) {
                    gastoHoje += gasto.valor;
                }

                if (this.isSameDay(data, ontem)) {
                    gastoOntem += gasto.valor;
                }
            });
        });



        this.gastoDiaAtual = gastoHoje;
        const diferenca: number = this.gastoDiaAtual - gastoOntem;
        this.diferencaGasto = diferenca;
    }

    isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    atuaizaMesBase(): void {
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril",
            "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const dia = this.rangeDates[0].getDate();
        let mesIndex = this.rangeDates[0].getMonth();

        if (dia <= 9) {
            mesIndex -= 1;

            if (mesIndex < 0) {
                mesIndex = 11;
            }
        }

        const prox: number = mesIndex == 11 ? 0 : mesIndex + 1;
        const ant: number = mesIndex == 0 ? 11 : mesIndex - 1;

        this.proximoMes = meses[prox];
        this.mesAnterior = meses[ant];
        this.mesAtual = meses[mesIndex];
    }

    getClassDiferenca(valor: number): string {
        if (valor <= 0) {
            return 'lime';
        } else {
            return 'tomato';
        }
    }

    getBordaDiferenca(valor: number): string {
        if (valor < 0) {
            return 'border: 1px solid lime';
        } else if (valor > 0) {
            return 'border: 1px solid tomato';
        }

        return 'border: 1px solid orange';
    }

    getIconValor(valor: number): string {
        if (valor >= 1000) {
            return 'pi pi-angle-double-up';
        } else if (valor > 0 && valor < 1000) {
            return 'pi pi-angle-up';
        } else if (valor <= 0 && valor >= -500) {
            return 'pi pi-angle-down';
        }
        return 'pi pi-angle-double-down';
    }

    historicoGastos(): void {
        if (!this.mainData) {
            return;
        }

        const listaParcelados = this.mainData.listaGastosParcelados;
        const listaAvulsos = this.mainData.listaGastosAvulsos;
        const totalmes: number = this.mainData.totalGastosAvulsos + this.mainData.totalGastosParcelados;

        let resultado: DiaGastoModel[] = [];

        listaAvulsos.forEach(avulso => { avulso.origem.forEach(gasto => {
            let dataGasto: Date = new Date(gasto.dataGasto);
            const diaGasto: DiaGastoModel | undefined = resultado.find(f => this.isSameDay(new Date(f.data), dataGasto));
            if (diaGasto == undefined) {
                resultado.push({ data: dataGasto, total: gasto.valor, percentagem: 0, diferenca: undefined, gastos: [gasto] });
            } else {
                diaGasto.total += gasto.valor;
                diaGasto.gastos.push(gasto);
            }
        })});

        listaParcelados.forEach(parcelado => { parcelado.origem.forEach(gasto => {
            let dataGasto: Date = new Date(gasto.dataGasto);
            const diaGasto: DiaGastoModel | undefined = resultado.find(f => this.isSameDay(new Date(f.data), dataGasto));
            if (diaGasto == undefined) {
                resultado.push({ data: dataGasto, total: gasto.valor, percentagem: 0, diferenca: undefined, gastos: [gasto] });
            } else {
                diaGasto.total += gasto.valor;
                diaGasto.gastos.push(gasto);
            }
        })});

        resultado = resultado.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        resultado.forEach((result: DiaGastoModel, index: number) => {
            if (index > 0) {
                result.diferenca = result.total - resultado[index - 1].total;
            }
            result.percentagem = (result.total / totalmes) / 0.3;
        });

        this.dialogGastosDiarios.open(resultado);
    }

    addNewEntry(): void {
        this.dialogNovoGasto.abrirParaAdicionar();
    }

    onAdicionar(gasto: GastosModel): void {
        this.novoGasto.emit(gasto);
    }

    editSettings(): void {
        this.dialogEditarSettings.abrir(this.settings, this.mes, this.patrimonio);
    }

    editPatrimonio(): void {
        this.dialogEditarPatrimonio.abrir(this.patrimonio);
    }

    salvarSettings(event: any): void {
        this.onEditarSettings.emit(event);
    }

    salvarPatrimonio(event: PatrimonioModel): void {
        this.onEditarPatrimonio.emit(event);
    }

    logout(): void {
        this.onLogout.emit();
    }
}
