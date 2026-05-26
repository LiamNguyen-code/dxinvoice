const https = require('https');

exports.handler = async function (event, context) {
    return new Promise((resolve) => {
        https.get('https://hoadondientu.gdt.gov.vn/api/captcha', (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                    body: body
                });
            });
        }).on('error', (err) => {
            resolve({
                statusCode: 502,
                body: JSON.stringify({ error: err.message })
            });
        });
    });
};
