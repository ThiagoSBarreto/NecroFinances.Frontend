import { GastosModel } from "./gasto.model";

export class DiaGastoModel {
    data: Date;
    total: number;
    diferenca?: number;
    gastos: GastosModel[];
}