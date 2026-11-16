import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppTopBarComponent } from "../app.top.bar/app.top.bar.component";
import { AppMiddleComponent } from "../app.middle.view/app.middle.component";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { SettingsService } from "../../../services/settings.service";
import { GastoService } from "../../../services/gasto.service";
import { MessageService } from "primeng/api";
import { concatMap, defer, forkJoin } from "rxjs";
import { ToastModule } from "primeng/toast";
import { MesService } from "../../../services/mes.service";
import { MesModel } from "../../../models/month.model";
import { PatrimonioModel } from "../../../models/patrimonio.model";
import { PatrimonioService } from "../../../services/patrimonio.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DashboardModel } from "../../../models/main.data.model";
import { DashboardService } from "../../../services/dashboard.service";
import { DateUtils } from "../../../helpers/data.utils";
import { LoginService } from "../../../services/login.service";
import { ValueVisibilityService } from "../../../services/value-visibility.service";

@Component({
    selector: 'app-main-view-component',
    templateUrl: './app.main.view.component.html',
    styleUrls: ['./app.main.view.component.scss'],
    imports: [
        ToastModule, ConfirmDialogModule,
        AppTopBarComponent, AppMiddleComponent
    ],
    providers: [
        SettingsService, MesService, GastoService, PatrimonioService, DashboardService,
        MessageService, LoginService
    ]
})
export class AppMainViewComponent implements OnInit {
    isMobile = window.matchMedia("(max-width: 768px)").matches;

    settings: SettingsModel;
    mes: MesModel;
    patrimonio: PatrimonioModel;
    mainData: DashboardModel;

    range: Date[] = [];

    constructor(
        private settingsService: SettingsService,
        private mesService: MesService,
        private gastoService: GastoService,
        private patrimonioService: PatrimonioService,
        private messageService: MessageService,
        private dashboardService: DashboardService,
        private router: Router,
        private loginService: LoginService,
        private valueVisibilityService: ValueVisibilityService
    ) {

    }

    ngOnInit(): void {
        this.valueVisibilityService.load().subscribe({
            error: () => this.toast('error', 'Não foi possível carregar a preferência de privacidade.')
        });
    }

    onNovaData(range: Date[]): void {
        this.range = range;
        this.buscarDados();
    }

    buscarDados(): void {

        defer(() => this.dashboardService.getDashboard(DateUtils.toDateOnly(this.range[0]), DateUtils.toDateOnly(this.range[1]))).pipe(

            concatMap(mainData => {
                this.mainData = mainData;
                return defer(() => this.settingsService.getSettingsByDate(DateUtils.toDateOnly(this.range[0]), DateUtils.toDateOnly(this.range[1])));
            }),

            concatMap(settings => {
                this.settings = settings;
                return defer(() => this.mesService.getMesByDate(DateUtils.toDateOnly(this.range[0]), DateUtils.toDateOnly(this.range[1])));
            }),

            concatMap(mes => {
                this.mes = mes;
                return defer(() => this.patrimonioService.getPatrimonioByDate(DateUtils.toDateOnly(this.range[0]), DateUtils.toDateOnly(this.range[1])));
            })

        ).subscribe({
            next: (patrimonio) => {
                this.patrimonio = patrimonio;
            },
            error: () => {
                this.toast('error', 'Erro ao buscar dados do periodo');
            }
        });
    }

    onNovoGasto(gasto: GastosModel): void {
        this.gastoService.addGasto(gasto).subscribe({
            next: () => {
                this.toast('success', 'Gasto adicionado com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }


    editarGastos(item: GastosModel): void {
        this.gastoService.updateGasto(item).subscribe({
            next: () => {
                this.toast('success', 'Gasto atualizado com sucesso');
                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }


    removerGasto(gasto: GastosModel): void {
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
        forkJoin({
            settings: this.settingsService.updateSettings(event.settings),
            mes: this.mesService.updateMes(event.mes),
            patrimonio: this.patrimonioService.updatePatrimonio(event.patrimonio)
        }).subscribe({
            next: (result) => {
                this.toast('success', 'Configurações atualizadas com sucesso');
                const { settings, mes, patrimonio } = result;

                this.buscarDados();
            },
            error: (err) => {
                this.toast('error', err.error);
            }
        });
    }

    editarPatrimonio(event: PatrimonioModel): void {
        this.patrimonioService.updatePatrimonio(event).subscribe({
            next: ((patrimonio) => {
                this.toast('success', 'Patrimônio atualizado com sucesso!');
                this.buscarDados();
            }),
            error: (err) => {
                this.toast('error', err.error);
            }
        })
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
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            this.loginService.logout(refreshToken).subscribe({
                error: (error) => console.error('Falha ao revogar a sessão no servidor.', error)
            });
        }

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
    }
}
