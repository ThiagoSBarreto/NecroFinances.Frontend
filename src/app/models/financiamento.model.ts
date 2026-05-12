export class FinanciamentoModel {
    id: number;
    patrimonioId: number;
    nomeFinanciamento: string;
    valorFinanciamento: number;
    diferenca: number;
    status?: 'original' | 'added' | 'edited' | 'removed';
}