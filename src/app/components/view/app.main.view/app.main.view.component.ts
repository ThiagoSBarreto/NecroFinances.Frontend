import { ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppTopBarComponent } from "../app.top.bar/app.top.bar.component";
import { AppBottomBarComponent } from "../app.bottom.bar/app.bottom.bar.component";
import { AppMiddleComponent } from "../app.middle.view/app.middle.component";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { SettingsService } from "../../../services/settings.service";
import { GastoService } from "../../../services/gasto.service";
import { IndicadorTipoGastoEnum } from "../../../models/gasto.tipo.enum";
import { ConfirmationService, MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { ToastModule } from "primeng/toast";
import { MesService } from "../../../services/mes.service";
import { MesModel } from "../../../models/month.model";
import { PatrimonioModel } from "../../../models/patrimonio.model";
import { PatrimonioService } from "../../../services/patrimonio.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
    selector: 'app-main-view-component',
    templateUrl: './app.main.view.component.html',
    styleUrls: ['./app.main.view.component.scss'],
    imports: [
        ToastModule, ConfirmDialogModule,
        AppTopBarComponent, AppBottomBarComponent, AppMiddleComponent
    ],
    providers: [
        SettingsService, MesService, GastoService, PatrimonioService,
        MessageService, ConfirmationService
    ]
})
export class AppMainViewComponent {

    settings: SettingsModel;
    mes: MesModel;
    gastos: GastosModel[];
    patrimonio: PatrimonioModel;

    range: Date[] = [];

    constructor(
        private settingsService: SettingsService,
        private mesService: MesService,
        private gastoService: GastoService,
        private patrimonioService: PatrimonioService,
        private cdr: ChangeDetectorRef,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {

    }

    onNovaData(range: Date[]): void {
        this.range = range;
        this.buscarDados();
    }

    buscarDados(): void {
        this.settingsService.getSettingsByDate(this.range[0]).subscribe({
            next: (settings) => {
                setTimeout(() => {
                    this.settings = settings;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });

        this.mesService.getMonthAtual(this.range[0]).subscribe({
            next: (mes) => {
                setTimeout(() => {
                    this.mes = mes;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });

        this.patrimonioService.getPatrimonio().subscribe({
            next: (patrimonio) => {
                setTimeout(() => {
                    this.patrimonio = patrimonio;
                    this.cdr.detectChanges();
                })
            },
            error: (err) => {
                this.patrimonio = new PatrimonioModel()
                this.patrimonio.moto = 0;
                this.patrimonio.reservaEmergencia = 0;
                this.patrimonio.reservaExtra = 0;
                this.patrimonio.fiesThiago = 0;
                this.patrimonio.fiesPri = 0;

                this.toast('error', err.error);
            }
        })

        this.buscarGastos();
    }

    buscarGastos(): void {
        this.gastoService.getGastoByRange(this.range[0], this.range[1]).subscribe({
            next: (gastos) => {
                setTimeout(() => {
                    this.gastos = gastos
                        .sort((a, b) => {

                            const ordemTipo = {
                                [IndicadorTipoGastoEnum.FIXO]: 1,
                                [IndicadorTipoGastoEnum.PARCELADO]: 2,
                                [IndicadorTipoGastoEnum.AVULSO]: 3
                            };

                            const tipoA = ordemTipo[a.tipoGasto];
                            const tipoB = ordemTipo[b.tipoGasto];

                            if (tipoA !== tipoB) {
                                return tipoA - tipoB;
                            }

                            return new Date(a.dataGasto).getTime() - new Date(b.dataGasto).getTime();
                        });

                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }

    onNovoGasto(gasto: GastosModel): void {
        this.gastoService.addNewGasto(gasto).subscribe({
            next: () => {
                this.toast('success', 'Gasto adicionado com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }


    onEditarGasto(gasto: GastosModel): void {
        this.gastoService.updateGasto(gasto).subscribe({
            next: () => {
                this.toast('success', 'Gasto atualizado com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }


    onRemoverGasto(gasto: GastosModel): void {
        this.gastoService.deleteGasto(gasto.id).subscribe({
            next: () => {
                this.toast('success', 'Gasto removido com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }


    onEditarSettings(event: any): void {
        forkJoin([
            this.settingsService.updateSetting(event.settings),
            this.mesService.updateMonth(event.mes),
            this.patrimonioService.adicionarPatrimonio(event.patrimonio)
        ]).subscribe({
            next: () => {
                this.toast('success', 'Configurações atualizadas com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }

    onMarcarGasto(event: any): void {
        this.gastoService.maskAsPaid(event.id).subscribe({
            next: () => {
                this.toast('success', 'Gasto atualizado com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        })
    }

    onPagarCartao(): void {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja marcar todos os gastos PARCELADOS e AVULSOS como pago?`,
            header: 'Confirmar ação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Confirmar',
            acceptButtonStyleClass: 'p-button-success',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.gastoService.pagarCartao(this.range[0], this.range[1]).subscribe({
                    next: () => {
                        this.toast('success', 'Gastos atualizados com sucesso');
                        this.buscarDados();
                    },
                    error: (err) => {
                        this.toast('error', err.error);
                    }
                })
            }
        });
    }

    private toast(tipo: 'success' | 'error', mensagem: string): void {
        this.messageService.add({
            severity: tipo,
            summary: tipo === 'success' ? 'Sucesso' : 'Erro',
            detail: mensagem,
            life: 3000
        });
    }

    onLogOut(): void {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Deslogado com sucesso' });
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
