import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../../services/login.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
    selector: 'login-component',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        CardModule
    ],
    providers: [
        LoginService,
        MessageService
    ]
})
export class LoginComponent {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    username = '';
    password = '';
    loading = false;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private messageService: MessageService
    ) { }

    onSubmit(form: NgForm) {
        if (form.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos obrigatórios',
                detail: 'Preencha usuário e senha'
            });
            return;
        }

        this.loading = true;

        this.loginService.login(this.username, this.password).subscribe({
            next: (token) => {
                this.loading = false;

                localStorage.setItem('token', token.accessToken);
                localStorage.setItem('refreshToken', token.refreshToken);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Bem-vindo',
                    detail: 'Login realizado com sucesso'
                });

                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.loading = false;

                console.error(err);

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao entrar',
                    detail: err.error || 'Usuário ou senha inválidos'
                });
            }
        });
    }

    registrar() {
        if (!this.username || !this.password) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos obrigatórios',
                detail: 'Informe usuário e senha para registrar'
            });
            return;
        }

        this.loading = true;

        this.loginService.registrar(this.username, this.password).subscribe({
            next: () => {
                this.loading = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuário registrado com sucesso'
                });

                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.loading = false;

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao registrar',
                    detail: err.error || 'Não foi possível registrar'
                });
            }
        });
    }
}
