const api = `http://localhost:8080/api`;

export const environment = {
    production: false,

    loginContext: `${api}/auth/`,
    settingsContext: `${api}/settings/`,
    monthContext: `${api}/mes/`,
    gastosContext: `${api}/gastos/`,
    patrimonioContext: `${api}/patrimonio/`,
    dashboardContext: `${api}/dashboard/`
};
