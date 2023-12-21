export const isDevelopmentEnvironment = import.meta.env.VITE_APP_ENVIRONMENT as string === "development";

export const BASEURL = isDevelopmentEnvironment ? import.meta.env.VITE_DEVELOPMENT_BASEURL as string : import.meta.env.VITE_PRODUCTION_BASEURL as string;

export const ORIGIN = isDevelopmentEnvironment ? 'http://localhost:5173' : 'https://brandkettledashboard.web.app';
