import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

const { database } = config;

const createPool = (dbConfig) => {
  const pool = mysql;
};
