import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { IndicadorTipoGastoEnum } from "../../../../models/gasto.tipo.enum";
import { GastosModel } from "../../../../models/gasto.model";
import { IconesDescricao, IconesEnum } from "../../../../models/icones.enum";

@Component({
    selector: 'dialog-novo-gasto',
    templateUrl: './dialog.novo.gasto.component.html',
    styleUrls: ['./dialog.novo.gasto.component.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        DialogModule, DatePickerModule, ButtonModule, InputNumberModule
    ]
})
export class DialogNovoGastoComponent implements OnInit {

    display: boolean = false;
    titulo: string = 'Novo Gasto';
    modoEditar: boolean = false;

    IndicadorTipoGasto = IndicadorTipoGastoEnum;
    IconesDescricao = IconesDescricao;
    icones = Object.values(IconesEnum);
    Object = Object;
    IconesEnum = IconesEnum;


    formGasto!: FormGroup;

    @Output() onNovoGasto: EventEmitter<GastosModel> = new EventEmitter<GastosModel>();

    @ViewChild('valorInput') valorInput: any;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.formGasto = this.fb.group({
            id: [null],
            dataGasto: [new Date(), Validators.required],
            valor: [0, Validators.required],
            icone: [IconesEnum.OTHER, Validators.required],
            tipoGasto: [IndicadorTipoGastoEnum.AVULSO, Validators.required],
            totalParcelas: [0],
            parcela: [0],
            descricao: ['']
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
            tipoGasto: this.IndicadorTipoGasto.AVULSO
        });
        this.modoEditar = false;
        this.display = true;
    }

    abrirParaEditar(gasto: GastosModel): void {
        this.titulo = 'Editar Gasto';
        this.formGasto.patchValue(gasto);
        this.formGasto.patchValue({ dataGasto: new Date(gasto.dataGasto) });
        this.formGasto.patchValue({ icone: this.determinarIcone(gasto.icone) });
        this.modoEditar = true;
        this.display = true;
    }

    selecionarTipo(tipo: IndicadorTipoGastoEnum): void {
        this.formGasto.patchValue({ tipoGasto: tipo });
        if (tipo !== IndicadorTipoGastoEnum.PARCELADO) {
            this.formGasto.patchValue({ parcela: 0 });
        }
    }

    selecionarValor() {
        const inputEl = this.valorInput.input.nativeElement;
        inputEl.select();
    }

    cancelar(): void {
        this.display = false;
    }

    adicionar(): void {
        if (this.formGasto.invalid) return;

        const gasto = this.formGasto.value as GastosModel;
        this.onNovoGasto.emit(gasto);

        this.display = false;
    }

    determinarIcone(icone: string): IconesEnum | undefined{
        return Object.values(IconesEnum).includes(icone as IconesEnum)
        ? icone as IconesEnum
        : undefined;
    }
}
