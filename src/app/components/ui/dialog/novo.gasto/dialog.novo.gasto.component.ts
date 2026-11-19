import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { IndicadorTipoGastoEnum, IndicadorTipoRecursoEnum } from "../../../../models/gasto.tipo.enum";
import { GastosModel } from "../../../../models/gasto.model";
import { IconesDescricao, IconesEnum } from "../../../../models/icones.enum";
import { ValueVisibilityService } from "../../../../services/value-visibility.service";
import { AutoDecimalInputDirective } from "../../../../directives/auto-decimal-input.directive";

@Component({
    selector: 'dialog-novo-gasto',
    templateUrl: './dialog.novo.gasto.component.html',
    styleUrls: ['./dialog.novo.gasto.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        DatePickerModule,
        ButtonModule,
        InputNumberModule,
        AutoDecimalInputDirective
    ]
})
export class DialogNovoGastoComponent implements OnInit {
    readonly valueVisibility = inject(ValueVisibilityService);
    display: boolean = false;
    titulo: string = 'Novo Gasto';
    modoEditar: boolean = false;

    IndicadorTipoGasto = IndicadorTipoGastoEnum;
    IndicadorTipoRecurso = IndicadorTipoRecursoEnum;
    IconesDescricao = IconesDescricao;
    icones = Object.values(IconesEnum);
    Object = Object;
    IconesEnum = IconesEnum;
    formGasto!: FormGroup;

    gasto: GastosModel;

    @Output() onNovoGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();

    @ViewChild('valorInput') valorInput: any;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.formGasto = this.fb.group({
            id: [null],
            dataGasto: [new Date(), Validators.required],
            valor: [0, Validators.required],
            icone: [IconesEnum.OTHER, Validators.required],
            tipoGasto: [IndicadorTipoGastoEnum.AVULSO, Validators.required],
            totalParcelas: [0],
            parcela: [0],
            descricao: [''],
            tipoRecurso: [IndicadorTipoRecursoEnum.CARTAO, Validators.required]
        });
    }

    abrirParaAdicionar(): void {
        this.titulo = 'Novo Gasto';

        this.formGasto.reset({
            dataGasto: new Date(),
            valor: 0,
            icone: IconesEnum.OTHER,
            parcela: 0,
            totalParcelas: 0,
            tipoGasto: this.IndicadorTipoGasto.AVULSO,
            tipoRecurso: this.IndicadorTipoRecurso.CARTAO
        });

        this.modoEditar = false;
        this.display = true;
    }

    abrirParaEditar(gasto: GastosModel): void {
        this.titulo = 'Editar Gasto';

        this.formGasto.patchValue({
            ...gasto,
            dataGasto: this.dateOnlyToDate(gasto.dataGasto),
            icone: this.determinarIcone(gasto.icone)
        });

        this.modoEditar = true;
        this.gasto = gasto;
        this.display = true;
    }

    selecionarTipo(tipo: IndicadorTipoGastoEnum): void {
        this.formGasto.patchValue({ tipoGasto: tipo });

        if (tipo !== IndicadorTipoGastoEnum.PARCELADO) {
            this.formGasto.patchValue({ parcela: 0 });
        }
    }

    selecionarTipoRecurso(recurso: IndicadorTipoRecursoEnum): void {
        this.formGasto.patchValue({ tipoRecurso: recurso });
    }

    selecionarValor(): void {
        const inputEl = this.valorInput.input.nativeElement;
        inputEl.select();
    }

    cancelar(): void {
        this.display = false;
    }

    adicionar(): void {
        if (this.formGasto.invalid) {
            return;
        }

        const formValue = this.formGasto.value;

        const gasto: GastosModel = {
            ...this.gasto,
            ...formValue,
            dataGasto: this.dateToDateOnly(formValue.dataGasto)
        };

        this.onNovoGasto.emit(gasto);

        this.display = false;
    }

    determinarIcone(icone: string): IconesEnum | undefined {
        return Object.values(IconesEnum).includes(icone as IconesEnum)
            ? icone as IconesEnum
            : undefined;
    }

    private dateOnlyToDate(dateOnly: string): Date {
        const [year, month, day] = dateOnly.split('-').map(Number);

        return new Date(year, month - 1, day);
    }

    private dateToDateOnly(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}