const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8888;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
};

function proxyCaptcha(req, res) {
    const cookieHeader = req.headers['cookie'] || '';

    const options = {
        hostname: 'hoadondientu.gdt.gov.vn',
        path: '/api/captcha',
        method: 'GET',
        headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,ja;q=0.8,vi;q=0.7',
            'action': '',
            'cache-control': 'no-cache',
            'end-point': '/',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': 'https://hoadondientu.gdt.gov.vn/',
            'sec-ch-ua': '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
            ...(cookieHeader ? { 'cookie': cookieHeader } : {})
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        const chunks = [];
        proxyRes.on('data', (chunk) => chunks.push(chunk));
        proxyRes.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(body);
        });
    });

    proxyReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.end();
}

function serveStatic(req, res) {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    if (req.url === '/.netlify/functions/captcha') {
        proxyCaptcha(req, res);
    } else {
        serveStatic(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
