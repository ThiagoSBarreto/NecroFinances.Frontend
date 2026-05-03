const api = `192.168.70.6:8080`;

export const environment = {
    production: false,

    loginContext: `${api}auth/`,
    settingsContext: `${api}settings/`,
    monthContext: `${api}mes/`,
    gastosContext: `${api}gastos/`,
    patrimonioContext: `${api}patrimonio/`,
    dashboardContext: `${api}dashboard/`
};