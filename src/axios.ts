// src/axios.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000', // 基础 URL
    withCredentials: true, // 关键配置
    timeout: 1000, // 请求超时时间
});

export default instance;
