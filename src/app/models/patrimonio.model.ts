import { FinanciamentoModel } from "./financiamento.model";
import { InvestimentoModel } from "./investimento.model";
import { PropriedadeModel } from "./propriedade.model";

export class PatrimonioModel {
    id: number;
    propriedades: PropriedadeModel[];
    investimentos: InvestimentoModel[];
    financiamentos: FinanciamentoModel[];
    data: Date;
}