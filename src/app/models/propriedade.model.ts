import { PatrimonioModel } from "./patrimonio.model";

export class PropriedadeModel {
    id: number;
    patrimonioId: number;
    nomePropriedade: string;
    valorPropriedade: number;
    diferenca: number;
}