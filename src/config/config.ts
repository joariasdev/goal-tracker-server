import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
};

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.Node_ENV || 'development'
};

export default config;