import { GastosModel } from "./gasto.model";

export class DiaGastoModel {
    data: Date;
    total: number;
    diferenca?: number;
    percentagem: number;
    gastos: GastosModel[];
}