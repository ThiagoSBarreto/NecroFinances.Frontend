import { GastosModel } from "./gasto.model";
import { IndicadorTipoGastoEnum } from "./gasto.tipo.enum";

export class GrupoAvulsoModel {
    isGroup: true;
    tipoGasto: IndicadorTipoGastoEnum;
    icone: string;
    descricao: string;
    total: number;
    itens: GastosModel[];
    latestDate: Date | null;
    pago: boolean;
}