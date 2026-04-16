function handleError(errorMessage) {
    document.getElementById('errorModalBody').innerHTML = errorMessage;
    $('#errorModal').modal('show');
}

function closeError(){
    $('#errorModal').modal('hide');
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captcha = document.getElementById('captcha').value;
    const ckey = localStorage.getItem('ckey');

    const body = {
        username: username,
        password: password,
        cvalue: captcha,
        ckey: ckey
    };

    try {
        const response = await fetch('https://hoadondientu.gdt.gov.vn:30000/security-taxpayer/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('tokeExpired', Date.now());
            localStorage.setItem('username', username);
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            location.reload();
        } else {
            handleError("Đăng nhập không thành công, vui lòng kiểm tra lại thông tin đăng nhập!");
        }
    } catch (error) {
        handleError("Đăng nhập không thành công, vui lòng kiểm tra lại thông tin đăng nhập!");
    }
});

function checkTokenExpired() {
    const token = localStorage.getItem('token');
    const tokenExpired = localStorage.getItem('tokeExpired');
    const twentyFourHoursLater = tokenExpired + (24 * 60 * 60 * 1000);
    if (token && tokenExpired && Date.now() < twentyFourHoursLater) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('btnLogout').style.display = 'block';
    }
    else {
        document.getElementById('btnPurchasedInvoices').disabled = true;
        document.getElementById('btndownloadpurchasedexcel').disabled = true;
        document.getElementById('btnSoldInvoices').disabled = true;
        document.getElementById('btndownloadSaledexcel').disabled = true;
        document.getElementById('spRequiredLoginPurchase').style.display = 'block';
        document.getElementById('spRequiredLoginSale').style.display = 'block';
    }
}

checkTokenExpired();
