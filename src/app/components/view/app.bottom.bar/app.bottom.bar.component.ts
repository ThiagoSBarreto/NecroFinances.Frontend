import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { IconesEnum } from "../../../models/icones.enum";
import { MesModel } from "../../../models/month.model";
import { IndicadorTipoGastoEnum } from "../../../models/gasto.tipo.enum";
import { PatrimonioModel } from "../../../models/patrimonio.model";

@Component({
    selector: 'app-bottom-bar-component',
    templateUrl: './app.bottom.bar.component.html',
    styleUrls: ['./app.bottom.bar.component.scss'],
    imports: [
        CommonModule, FormsModule, CurrencyPipe,
        ButtonModule, ToolbarModule
    ]
})
export class AppBottomBarComponent implements OnChanges {

    totaisPorIcone: any[] = [];

    valorMoto: number = 0;
    valorFundoEmergencia: number = 0;
    valorFundoExtra: number = 0;
    fiesThiago: number = 0;
    fiesPri: number = 0;
    desafioGastos: number = 0;

    @Input('settings') settings: SettingsModel;
    @Input('mes') mes: MesModel;
    @Input('gastos') gastos: GastosModel[];
    @Input('patrimonio') patrimonio: PatrimonioModel;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['gastos'] || changes['settings']) {
            this.atualizarTotaisPorIcone();
        }

        if (changes['patrimonio']) {
            this.atualizarPatrimonio();
        }
    }

    private atualizarTotaisPorIcone(): void {
        const totais = Object.values(IconesEnum).map(icone => {
            const total = this.gastos
                ?.filter(g => g.icone === icone)
                .reduce((acc, g) => acc + g.valor, 0) || 0;

            return { icone, total, topGasto: false };
        });

        const ordenados = [...totais].sort((a, b) => b.total - a.total);

        ordenados.slice(0, 3).forEach(item => {
            const original = totais.find(t => t.icone === item.icone);
            if (original) original.topGasto = true;
        });

        this.totaisPorIcone = totais;
        this.desafioGastos = this.settings?.desafioGastos || 0;
    }

    private atualizarPatrimonio(): void {
        this.valorMoto = this.patrimonio?.moto;
        this.valorFundoEmergencia = this.patrimonio?.reservaEmergencia;
        this.valorFundoExtra = this.patrimonio?.reservaExtra;
        this.fiesThiago = this.patrimonio?.fiesThiago;
        this.fiesPri = this.patrimonio?.fiesPri;
    }

    getTotalFixo(): number {
        if (!this.gastos) {
            return 0;
        }

        return this.gastos
            .filter(g => g.tipoGasto === 0)
            .reduce((total, g) => total + g.valor, 0);
    }


    getTotalAvulsoParcelado(): number {
        if (!this.gastos) {
            return 0;
        }

        return this.gastos
            .filter(g => g.tipoGasto === 1 || g.tipoGasto === 2)
            .reduce((total, g) => total + g.valor, 0);
    }

    getIndicadorClasse(box?: boolean): string {
        if (!this.gastos) {
            return '';
        }

        let totalGastos = this.gastos
            .filter(g => g.tipoGasto !== IndicadorTipoGastoEnum.FIXO)
            .reduce((soma, g) => soma + g.valor, 0);
        totalGastos = this.settings.desafioGastos - totalGastos;

        if (totalGastos < -1000) {
            if (box) return 'card-tomato';
            return 'red';
        } else if (totalGastos >= -1000 && totalGastos < 0) {
            if (box) return 'card-tomato';
            return 'tomato';
        } else if (totalGastos >= 0 && totalGastos < 1000) {
            if (box) return 'card-lime';
            return 'lime';
        } else {
            if (box) return 'card-lime';
            return 'green'
        }
    }

    getIndicadorIcone(): string {
        if (!this.gastos) {
            return '';
        }
        let totalGastos = this.gastos
            .filter(g => g.tipoGasto !== IndicadorTipoGastoEnum.FIXO)
            .reduce((soma, g) => soma + g.valor, 0);
        totalGastos = this.settings.desafioGastos - totalGastos;

        if (totalGastos < -1000) {
            return 'pi pi-angle-double-down';
        } else if (totalGastos >= -1000 && totalGastos < 0) {
            return 'pi pi-angle-down';
        } else if (totalGastos >= 0 && totalGastos < 1000) {
            return 'pi pi-angle-up';
        } else {
            return 'pi pi-angle-double-up'
        }
    }

    getIndicadorVariacao(): number {
        if (!this.gastos) {
            return 0;
        }

        let totalGastos = this.gastos
            .filter(g => g.tipoGasto !== IndicadorTipoGastoEnum.FIXO)
            .reduce((soma, g) => soma + g.valor, 0);

        return (this.settings.desafioGastos - totalGastos);
    }

    getEconomias(): number {
        return (this.valorFundoEmergencia + this.valorFundoExtra);
    }

    getPatrimonio(): number {
        return (this.valorMoto + this.valorFundoEmergencia + this.valorFundoExtra) - (this.fiesThiago + this.fiesPri);
    }

}
