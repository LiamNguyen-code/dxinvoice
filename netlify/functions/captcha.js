const https = require('https');

exports.handler = async function (event, context) {
    const cookieHeader = event.headers['cookie'] || '';

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

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                const responseHeaders = { 'Content-Type': 'application/json' };

                const setCookie = res.headers['set-cookie'];
                if (setCookie) {
                    responseHeaders['set-cookie'] = setCookie;
                }

                resolve({
                    statusCode: res.statusCode,
                    headers: responseHeaders,
                    body: body
                });
            });
        });

        req.on('error', (err) => {
            resolve({
                statusCode: 502,
                body: JSON.stringify({ error: err.message })
            });
        });

        req.end();
    });
};
