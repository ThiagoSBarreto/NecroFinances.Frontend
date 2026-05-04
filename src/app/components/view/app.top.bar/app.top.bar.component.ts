import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DrawerModule } from "primeng/drawer";
import { ToolbarModule } from "primeng/toolbar";
import { CommonModule } from "@angular/common";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { DialogNovoGastoComponent } from "../../ui/dialog/novo.gasto/dialog.novo.gasto.component";
import { DialogEditarSettingsComponent } from "../../ui/dialog/dialog.editar.valor.settings/dialog.editar.settings.component";
import { MesModel } from "../../../models/month.model";
import { PatrimonioModel } from "../../../models/patrimonio.model";

@Component({
    selector: 'app-top-bar-component',
    templateUrl: './app.top.bar.component.html',
    styleUrls: ['./app.top.bar.component.scss'],
    imports: [
        FormsModule, CommonModule,
        ButtonModule, DatePickerModule, DrawerModule, ToolbarModule,
        DialogEditarSettingsComponent, DialogNovoGastoComponent
    ]
})
export class AppTopBarComponent implements OnInit, OnChanges {

    @Input('settings') settings: SettingsModel;
    @Input('mes') mes: MesModel;
    @Input('gastos') gastos: GastosModel[];
    @Input('patrimonio') patrimonio: PatrimonioModel;

    @Output('onNovaData') onNovaData: EventEmitter<Date[]> = new EventEmitter<Date[]>();
    @Output('novoGasto') novoGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();
    @Output('onEditarSettings') onEditarSettings: EventEmitter<SettingsModel> = new EventEmitter<SettingsModel>();
    @Output('onLogout') onLogout: EventEmitter<void> = new EventEmitter<void>();
    @Output() onPagarCartao: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('dialogNovoGasto') dialogNovoGasto: DialogNovoGastoComponent;
    @ViewChild('dialogEditarSettings') dialogEditarSettings: DialogEditarSettingsComponent;

    rangeDates: Date[] = [];

    inss: number = 0;
    pspd: number = 0;
    taxa: number = 0;
    descontos: number = 0;
    liquido: number = 0;
    bruto: number = 0;
    restante: number = 0;
    dias: number = 0;
    horasUteis: number = 0;
    horasExtra: number = 0;
    valorHora: number = 0;
    gastosTotal: number = 0;
    infoDrawerVisible: boolean = false;

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['mes'] && this.mes) || (changes['settings'] && this.settings) || (changes['gastos'] && this.gastos)) {
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
        if (!this.settings || !this.mes) {
            return;
        }

        this.valorHora = this.settings.valorHora;
        this.dias = this.mes.diasUteis;
        this.horasUteis = this.mes.horasUteis;
        this.horasExtra = this.mes.horasExtras;
        this.bruto = (this.horasUteis * this.valorHora) + (this.horasExtra * this.valorHora);
        this.inss = this.settings.salarioMinimo * this.settings.percentagemTaxaINSS;
        this.taxa = this.bruto * this.settings.percentagemTaxaCooperativa;
        this.pspd = this.settings.valorPlanoSaude + this.settings.valorPlanoDental;
        this.descontos = this.inss + this.taxa + this.pspd;
        this.liquido = this.bruto - this.descontos;
        this.restante = this.liquido - this.gastosTotal;

        this.gastosTotal = 0;
        this.gastos?.forEach(gasto => {
            this.gastosTotal += gasto.valor;
        });

        this.restante = this.liquido - this.gastosTotal;
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
        
    }

    salvarSettings(event: any): void {
        this.onEditarSettings.emit(event);
    }

    logout(): void {
        this.onLogout.emit();
    }

    info(): void {
        this.infoDrawerVisible = true;
    }

    pargarCartao(): void {
        this.onPagarCartao.emit();
    }
}
