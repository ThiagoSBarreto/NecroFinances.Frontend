import { IndicadorTipoGastoEnum } from "./gasto.tipo.enum";

export class GastosModel {
    id: number;
    dataGasto: Date;
    tipoGasto: IndicadorTipoGastoEnum;
    valor: number;
    icone: string;
    descricao: string;
    parcela: number;
    totalParcelas: number;
    pago: Boolean;
}