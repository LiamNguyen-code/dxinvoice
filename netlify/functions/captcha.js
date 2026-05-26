exports.handler = async function (event, context) {
    const response = await fetch('https://hoadondientu.gdt.gov.vn:30000/captcha');

    if (!response.ok) {
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: 'Failed to fetch captcha' })
        };
    }

    const data = await response.json();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
};
