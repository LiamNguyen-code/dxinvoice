const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

exports.handler = async function (event, context) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'hoadondientu.gdt.gov.vn',
            port: 30000,
            path: '/captcha',
            method: 'GET',
            agent: agent
        };

        https.request(options, (res) => {
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
        }).end();
    });
};
