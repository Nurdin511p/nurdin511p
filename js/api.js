const GAS_URL = "URL_WEB_APP_GAS_ANDA"; // GANTI DENGAN URL DEPLOYMENT GAS

async function callAPI(action, data = {}) {
    const loading = document.getElementById('loading-overlay');
    if(loading) loading.classList.remove('hidden');

    // Karena GAS tidak mendukung header JSON standar pada POST lintas asal,
    // kita gunakan URLSearchParams untuk mengirim action dan data
    const formData = new URLSearchParams();
    formData.append('action', action);
    formData.append('data', JSON.stringify(data));

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const result = await response.json();
        if (!result.status) throw new Error(result.message);
        return result;
    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
        return { status: false, message: error.message };
    } finally {
        if(loading) loading.classList.add('hidden');
    }
}