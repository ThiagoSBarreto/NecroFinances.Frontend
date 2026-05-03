import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppTopBarComponent } from "../app.top.bar/app.top.bar.component";
import { AppMiddleComponent } from "../app.middle.view/app.middle.component";
import { SettingsModel } from "../../../models/settings.model";
import { GastosModel } from "../../../models/gasto.model";
import { SettingsService } from "../../../services/settings.service";
import { GastoService } from "../../../services/gasto.service";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { ToastModule } from "primeng/toast";
import { MesService } from "../../../services/mes.service";
import { MesModel } from "../../../models/month.model";
import { PatrimonioModel } from "../../../models/patrimonio.model";
import { PatrimonioService } from "../../../services/patrimonio.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DashboardModel } from "../../../models/main.data.model";
import { DashboardService } from "../../../services/dashboard.service";

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
        MessageService
    ]
})
export class AppMainViewComponent {
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
        private router: Router
    ) {

    }

    onNovaData(range: Date[]): void {
        this.range = range;
        this.buscarDados();
    }

    buscarDados(): void {
        forkJoin({
            mainData: this.dashboardService.getDashboard(this.range[0], this.range[1]),
            settings: this.settingsService.getSettingsByDate(this.range[0], this.range[1]),
            mes: this.mesService.getMesByDate(this.range[0], this.range[1]),
            patrimonio: this.patrimonioService.getPatrimonioByDate(this.range[0], this.range[1])
        }).subscribe({
            next: (result) => {
                const { mainData, settings, mes, patrimonio } = result;
                this.mainData = mainData;
                this.settings = settings;
                this.mes = mes;
                this.patrimonio = patrimonio;
            },
            error: (err) => {
                this.toast('error', 'Erro ao buscar dados do periodo');
            }
        })
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

    private toast(tipo: 'success' | 'error', mensagem: string): void {
        this.messageService.add({
            severity: tipo,
            summary: tipo === 'success' ? 'Sucesso' : 'Erro',
            detail: mensagem,
            life: 3000
        });
    }

    onLogOut(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
