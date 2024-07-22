import dotenv from 'dotenv';

// 현재 접속가능한 버전
export const CLIENT_VERSION = ['1.0.0', '1.0.1', '1.1.0'];

export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
