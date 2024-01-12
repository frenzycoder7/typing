declare global { 
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            DATABASE: string;
            SERVER_ENV: string;
            SERVER_ID: string; 
        }
    }

}