import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

import { PatrimonioModel } from "../../../../models/patrimonio.model";
import { PropriedadeModel } from "../../../../models/propriedade.model";
import { InvestimentoModel } from "../../../../models/investimento.model";
import { FinanciamentoModel } from "../../../../models/financiamento.model";

@Component({
    selector: 'dialog-editar-patrimonio',
    standalone: true,
    templateUrl: './dialog.editar.patrimonio.component.html',
    styleUrls: ['./dialog.editar.patrimonio.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        InputNumberModule,
        ButtonModule,
        InputTextModule
    ]
})
export class DialogEditarPatrimonioComponent {

    display = false;

    patrimonio!: PatrimonioModel;

    form!: FormGroup;

    @Output() onSalvar = new EventEmitter<PatrimonioModel>();

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            propriedades: this.fb.array([]),
            investimentos: this.fb.array([]),
            financiamentos: this.fb.array([])
        });
    }

    get propriedades(): FormArray<FormGroup> {
        return this.form.get('propriedades') as FormArray<FormGroup>;
    }

    get investimentos(): FormArray<FormGroup> {
        return this.form.get('investimentos') as FormArray<FormGroup>;
    }

    get financiamentos(): FormArray<FormGroup> {
        return this.form.get('financiamentos') as FormArray<FormGroup>;
    }

    abrir(patrimonio: PatrimonioModel) {
        this.patrimonio = patrimonio;

        this.propriedades.clear();
        this.investimentos.clear();
        this.financiamentos.clear();

        patrimonio.propriedades.forEach(p => this.propriedades.push(this.criarPropriedade(p)));
        patrimonio.investimentos.forEach(i => this.investimentos.push(this.criarInvestimento(i)));
        patrimonio.financiamentos.forEach(f => this.financiamentos.push(this.criarFinanciamento(f)));

        this.display = true;
    }

    criarPropriedade(p?: PropriedadeModel) {
        return this.fb.group({
            id: [p?.id ?? 0],
            nomePropriedade: [
                p?.nomePropriedade ?? '',
                [Validators.required, Validators.minLength(2)]
            ],
            valorPropriedade: [
                p?.valorPropriedade ?? 0,
                [Validators.required, Validators.min(0.01)]
            ],
            status: ['original'],
            original: [p ? { ...p } : null]
        });
    }

    criarInvestimento(i?: InvestimentoModel) {
        return this.fb.group({
            id: [i?.id ?? 0],
            nomeInvestimento: [i?.nomeInvestimento ?? '', [Validators.required, Validators.minLength(2)]],
            valorInvestimento: [i?.valorInvestimento ?? 0, [Validators.required, Validators.min(0.01)]],
            status: ['original'],
            original: [i ? { ...i } : null]
        });
    }

    criarFinanciamento(f?: FinanciamentoModel) {
        return this.fb.group({
            id: [f?.id ?? 0],
            nomeFinanciamento: [f?.nomeFinanciamento ?? '', [Validators.required, Validators.minLength(2)]],
            valorFinanciamento: [f?.valorFinanciamento ?? 0, [Validators.required, Validators.min(0.01)]],
            diferenca: [f?.diferenca ?? 0],
            status: ['original'],
            original: [f ? { ...f } : null]
        });
    }

    adicionar(tipo: 'propriedade' | 'investimento' | 'financiamento') {
        const control =
            tipo === 'propriedade' ? this.propriedades :
                tipo === 'investimento' ? this.investimentos :
                    this.financiamentos;

        const novo =
            tipo === 'propriedade' ? this.criarPropriedade() :
                tipo === 'investimento' ? this.criarInvestimento() :
                    this.criarFinanciamento();

        novo.patchValue({ status: 'added' });

        control.push(novo);
    }

    remover(item: FormGroup) {
        if (item.value.status === 'added') {
            const array = item.parent as FormArray;
            array.removeAt(array.controls.indexOf(item));
        } else {
            item.patchValue({ status: 'removed' });
        }
    }

    reverter(item: FormGroup, tipo: 'propriedade' | 'investimento' | 'financiamento') {

        const status = item.value.status;
        const original = item.value.original;

        const array =
            tipo === 'propriedade' ? this.propriedades :
                tipo === 'investimento' ? this.investimentos :
                    this.financiamentos;

        if (status === 'added') {
            const index = array.controls.indexOf(item);
            array.removeAt(index);
            return;
        }

        if (status === 'removed') {
            item.patchValue({ status: 'original' });
            return;
        }

        if (status === 'edited' && original) {
            item.patchValue({
                ...original,
                status: 'original'
            });
        }
    }

    marcarEdicao(item: FormGroup) {
        if (item.value.status === 'original') {
            item.patchValue({ status: 'edited' });
        }
    }

    getClass(status: string) {
        return {
            'row-added': status === 'added',
            'row-edited': status === 'edited',
            'row-removed': status === 'removed'
        };
    }

    private isListaValida(array: FormArray<FormGroup>, campos: string[]): boolean {
        return array.controls
            .filter(c => c.value.status !== 'removed')
            .every(c => {
                return campos.every(campo => {
                    const valor = c.get(campo)?.value;

                    if (typeof valor === 'string') {
                        return valor && valor.trim().length > 0;
                    }

                    if (typeof valor === 'number') {
                        return valor > 0;
                    }

                    return true;
                });
            });
    }

    formValido(): boolean {
        return this.isListaValida(this.propriedades, ['nomePropriedade', 'valorPropriedade']) &&
            this.isListaValida(this.investimentos, ['nomeInvestimento', 'valorInvestimento']) &&
            this.isListaValida(this.financiamentos, ['nomeFinanciamento', 'valorFinanciamento']);
    }

    salvar() {

        const propriedades = this.propriedades.value
            .filter((c: any) => c.status !== 'removed')
            .map((c: any) => ({
                id: c.status === 'added' ? 0 : c.id,
                patrimonioId: this.patrimonio.id,
                nomePropriedade: c.nomePropriedade,
                valorPropriedade: c.valorPropriedade,
                diferenca: c.diferenca
            }));

        const investimentos = this.investimentos.value
            .filter((c: any) => c.status !== 'removed')
            .map((c: any) => ({
                id: c.status === 'added' ? 0 : c.id,
                patrimonioId: this.patrimonio.id,
                nomeInvestimento: c.nomeInvestimento,
                valorInvestimento: c.valorInvestimento,
                diferenca: c.diferenca
            }));

        const financiamentos = this.financiamentos.value
            .filter((c: any) => c.status !== 'removed')
            .map((c: any) => ({
                id: c.status === 'added' ? 0 : c.id,
                patrimonioId: this.patrimonio.id,
                nomeFinanciamento: c.nomeFinanciamento,
                valorFinanciamento: c.valorFinanciamento,
                diferenca: c.diferenca
            }));

        const result: PatrimonioModel = {
            ...this.patrimonio,
            propriedades,
            investimentos,
            financiamentos,
            data: this.patrimonio.data
        };

        this.onSalvar.emit(result);
        this.display = false;
    }

    cancelar() {
        this.display = false;
    }
}