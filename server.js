const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8091;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy mantendo a estrutura /hls e alterando cabeçalhos
app.use('/hls', createProxyMiddleware({
    target: 'http://200.144.30.103:8084/hls',
    changeOrigin: true,
    pathRewrite: {
        '^/hls': '' // Remove a duplicidade já que o /hls foi para o target
    },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Host', '200.144.30.103:8084');
        proxyReq.setHeader('Referer', 'http://200.144.30.103:8084/');
        proxyReq.setHeader('Origin', 'http://200.144.30.103:8084');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    }
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Mosaico ativo na porta ${PORT}`);
});