import { GastoConsolidadoModel } from "./gasto.consolidado.model";
import { GastosModel } from "./gasto.model";
import { MesModel } from "./month.model";
import { PatrimonioModel } from "./patrimonio.model";
import { SettingsModel } from "./settings.model";

export class MainDataModel {
    totalBruto: number;
    diferencaBruto: number;

    totalDescontos: number;
    diferencaDescontos: number;

    totalLiquido: number;
    diferencaLiquido: number;

    totalRestante: number;
    diferencaRestante: number;

    fipeMoto: number;
    diferencaFipeMoto: number;
    fipeCarro: number;
    diferencaFipeCarro: number;

    reservaEmergencia: number;
    diferencaReservaEmergencia: number;
    reservaExtra: number;
    diferencaReservaExtra: number;

    economias: number;

    fiesThiago: number;
    diferencaFiesThiago: number;
    fiesPriscila: number;
    diferencaFiesPriscila: number;

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

    mes: MesModel;
    settings: SettingsModel;
    patrimonio: PatrimonioModel;
}