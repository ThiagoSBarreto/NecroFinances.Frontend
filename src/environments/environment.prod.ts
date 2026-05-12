const api = `http://192.168.70.6:8080/api`;

export const environment = {
    production: false,

    loginContext: `${api}/auth/`,
    settingsContext: `${api}/settings/`,
    monthContext: `${api}/mes/`,
    gastosContext: `${api}/gastos/`,
    patrimonioContext: `${api}/patrimonio/`,
    dashboardContext: `${api}/dashboard/`
};