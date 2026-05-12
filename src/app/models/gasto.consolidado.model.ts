import { GastosModel } from "./gasto.model";

export class GastoConsolidadoModel {
    id: number;
    descricao: string;
    categoria: string;
    valor: number;
    percentagem: number;
    diferenca: number
    parcela: number;
    totalParcelas: number;
    origem: GastosModel[];
}