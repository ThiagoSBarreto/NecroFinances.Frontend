import { FinanciamentoModel } from "./financiamento.model";
import { GastoConsolidadoModel } from "./gasto.consolidado.model";
import { GastosModel } from "./gasto.model";
import { InvestimentoModel } from "./investimento.model";
import { MesModel } from "./month.model";
import { PatrimonioModel } from "./patrimonio.model";
import { PropriedadeModel } from "./propriedade.model";
import { SettingsModel } from "./settings.model";

export class DashboardModel {
    totalBruto: number;
    diferencaBruto: number;

    totalDescontos: number;
    diferencaDescontos: number;

    totalLiquido: number;
    diferencaLiquido: number;

    totalRestante: number;
    diferencaRestante: number;

    propriedades: PropriedadeModel[];
    investimentos: InvestimentoModel[];
    financiamentos: FinanciamentoModel[];

    economias: number;
    totalPatrimonio: number;

    totalGastosFixos: number;
    diferencaGastosFixos: number;
    totalGastosParcelados: number;
    diferencaGastosParcelados: number;
    totalGastosAvulsos: number;
    diferencaGastosAvulsos: number;

    diferencaMeta: number;

    listaGastosFixos: GastoConsolidadoModel[];
    listaGastosParcelados: GastoConsolidadoModel[];
    listaGastosAvulsos: GastoConsolidadoModel[];
}