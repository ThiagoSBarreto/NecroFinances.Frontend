import { CommonModule } from "@angular/common";
import { AfterViewChecked, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { SettingsModel } from "../../../../models/settings.model";
import { MesModel } from "../../../../models/month.model";
import { PatrimonioModel } from "../../../../models/patrimonio.model";

@Component({
    selector: 'dialog-editar-settings',
    templateUrl: './dialog.editar.settings.component.html',
    styleUrls: ['./dialog.editar.settings.component.scss'],
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        DialogModule, InputNumberModule, ButtonModule
    ]
})
export class DialogEditarSettingsComponent implements OnInit, AfterViewChecked {

    display: boolean = false;
    titulo: string = "Editar Configurações";

   
    settings!: SettingsModel;
    mes!: MesModel;
    patrimonio!: PatrimonioModel;

   
    formSettings!: FormGroup;
    formMonth!: FormGroup;
    formPatrimonio!: FormGroup;

    @Output() onSalvar = new EventEmitter<{ settings: SettingsModel, mes: MesModel, patrimonio: PatrimonioModel }>();

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {

        this.formSettings = this.fb.group({
            valorHora: [0, [Validators.required, Validators.min(0)]],
            salarioMinimo: [0, [Validators.required, Validators.min(0)]],
            percentagemTaxaINSS: [0, [Validators.required, Validators.min(0)]],
            percentagemTaxaCooperativa: [0, [Validators.required, Validators.min(0)]],
            valorPlanoDental: [0, [Validators.required, Validators.min(0)]],
            valorPlanoSaude: [0, [Validators.required, Validators.min(0)]],
            valorDesafioGastos: [0, [Validators.required, Validators.min(0)]]
        });

        this.formMonth = this.fb.group({
            diasUteis: [0, [Validators.required, Validators.min(0)]],
            horasUteis: [0, [Validators.required, Validators.min(0)]],
            horasExtras: [0, [Validators.required, Validators.min(0)]],
        });

        this.formPatrimonio = this.fb.group({
            moto: [0, [Validators.required, Validators.min(0)]],
            reservaEmergencia: [0, [Validators.required, Validators.min(0)]],
            reservaExtra: [0, [Validators.required, Validators.min(0)]],
            fiesThiago: [0, [Validators.required, Validators.min(0)]],
            fiesPri: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngAfterViewChecked() {
        const inputs = document.querySelectorAll('.p-inputnumber input');

        inputs.forEach(input => {
            if (!input.hasAttribute('data-select-ready')) {
                input.setAttribute('data-select-ready', 'true');

                input.addEventListener('focus', () => {
                    const htmlInput = input as HTMLInputElement;
                    setTimeout(() => htmlInput.select(), 0);
                });
            }
        });
    }



    abrir(settings: SettingsModel, mes: MesModel, patrimonio: PatrimonioModel): void {
        this.settings = settings;
        this.mes = mes;
        this.patrimonio = patrimonio;

        this.formSettings.patchValue({
            valorHora: settings.valorHora,
            salarioMinimo: settings.salarioMinimo,
            percentagemTaxaINSS: settings.percentagemTaxaINSS,
            percentagemTaxaCooperativa: settings.percentagemTaxaCooperativa,
            valorPlanoDental: settings.valorPlanoDental,
            valorPlanoSaude: settings.valorPlanoSaude,
            valorDesafioGastos: settings.desafioGastos
        });

        this.formMonth.patchValue({
            diasUteis: mes.diasUteis,
            horasUteis: mes.horasUteis,
            horasExtras: mes.horasExtras
        });

        this.display = true;
    }

    cancelar(): void {
        this.display = false;
    }

    salvar(): void {
        if (this.formSettings.invalid || this.formMonth.invalid) return;

        const settingsAtualizado: SettingsModel = {
            ...this.settings,
            ...this.formSettings.value
        };

        const monthAtualizado: MesModel = {
            ...this.mes,
            ...this.formMonth.value
        };

        const patrimonioAtualizado: PatrimonioModel = {
            ...this.patrimonio,
            ...this.formPatrimonio.value
        }

        this.onSalvar.emit({
            settings: settingsAtualizado,
            mes: monthAtualizado,
            patrimonio: patrimonioAtualizado
        });

        this.display = false;
    }
}