/**
 * app.js - Logika Utama Aplikasi & Manipulasi DOM
 */

const App = {
    // Inisialisasi Aplikasi
    init: () => {
        if (Auth.checkAuth()) {
            const session = Auth.getSession();
            
            // Set Info User di UI
            document.getElementById('user-role').innerText = `(${session.role} - ${session.school})`;
            
            // Load data awal
            App.loadPeserta();
        }
    },

    // Mengambil data peserta dari GAS
    loadPeserta: async () => {
        const session = Auth.getSession();
        const tbody = document.getElementById('table-body');
        const statPeserta = document.getElementById('stat-peserta');

        // Tampilkan placeholder loading di tabel
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">Mengambil data...</td></tr>';

        const res = await callAPI('getPeserta', { 
            token: session.token, 
            npsn: session.npsn 
        });

        if (res && res.status) {
            statPeserta.innerText = res.data.length;
            
            if (res.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Belum ada data peserta.</td></tr>';
                return;
            }

            tbody.innerHTML = res.data.map(p => `
                <tr class="hover:bg-gray-50 border-b">
                    <td class="p-4 font-mono text-xs text-blue-600">${p.PesId}</td>
                    <td class="p-4">
                        <div class="font-bold">${p.NamaPeserta}</div>
                        <div class="text-xs text-gray-500">NISN: ${p.NISN}</div>
                    </td>
                    <td class="p-4 text-sm">${p.LombaId}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded-full text-xs ${App.getStatusClass(p.StatusVerifikasi)}">
                            ${p.StatusVerifikasi}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
    },

    // Helper warna status
    getStatusClass: (status) => {
        switch (status?.toLowerCase()) {
            case 'disetujui': return 'bg-green-100 text-green-700';
            case 'ditolak': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700'; // Pending
        }
    }
};

// Event Listeners Global
window.handleLogin = () => {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    Auth.login(u, p);
};

window.handleLogout = () => {
    if(confirm("Apakah Anda ingin logout?")) Auth.logout();
};

window.loadPeserta = () => App.loadPeserta();

// Jalankan aplikasi saat dokumen siap
document.addEventListener('DOMContentLoaded', App.init);