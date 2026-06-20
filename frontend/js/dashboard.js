// frontend/js/dashboard.js
const API_URL = 'http://localhost:3000/api';

// Sidebar toggle para móvil
document.getElementById('sidebarToggle')?.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('show');
});

// Cargar datos del dashboard
async function cargarDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        const data = await response.json();
        
        if (data.success) {
            const d = data.data;
            document.getElementById('totalEstudiantes').textContent = d.total_estudiantes;
            document.getElementById('estudiantesActivos').textContent = d.activos;
            document.getElementById('estudiantesRiesgo').textContent = d.en_riesgo;
            document.getElementById('abandonados').textContent = d.abandonaron;
            
            // Actualizar gráficos
            actualizarGraficos(d);
            actualizarActividades();
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos del dashboard'
        });
    }
}

// Gráficos
let permanenciaChart, riesgoChart;

function actualizarGraficos(data) {
    // Gráfico de permanencia
    const ctx1 = document.getElementById('permanenciaChart').getContext('2d');
    
    if (permanenciaChart) permanenciaChart.destroy();
    
    permanenciaChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Tasa de Permanencia',
                data: [82, 84, 87, 85, 88, 89],
                borderColor: '#1a237e',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1a237e',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
    
    // Gráfico de riesgo
    const ctx2 = document.getElementById('riesgoChart').getContext('2d');
    
    if (riesgoChart) riesgoChart.destroy();
    
    riesgoChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Bajo Riesgo', 'Riesgo Medio', 'Alto Riesgo'],
            datasets: [{
                data: [
                    data.predicciones?.bajo_riesgo || 720,
                    data.predicciones?.riesgo_medio || 285,
                    data.predicciones?.alto_riesgo || 95
                ],
                backgroundColor: ['#00c853', '#ffab00', '#d50000'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

// Últimas actividades
async function actualizarActividades() {
    const table = document.getElementById('actividadesTable');
    
    const actividades = [
        { estudiante: 'Renzo Quispe', accion: 'Consultó IA sobre derivadas', fecha: 'Hace 5 min', estado: 'activo' },
        { estudiante: 'María Ccorahua', accion: 'Riesgo detectado: 65%', fecha: 'Hace 15 min', estado: 'riesgo' },
        { estudiante: 'Carlos Huamaní', accion: 'Completó módulo de Física', fecha: 'Hace 1 hora', estado: 'activo' },
        { estudiante: 'Ana Huamán', accion: 'Postuló a Beca 18', fecha: 'Hace 2 horas', estado: 'activo' },
        { estudiante: 'Luis Chávez', accion: 'Abandono detectado', fecha: 'Hace 3 horas', estado: 'abandono' }
    ];
    
    table.innerHTML = actividades.map(a => `
        <tr>
            <td><strong>${a.estudiante}</strong></td>
            <td>${a.accion}</td>
            <td>${a.fecha}</td>
            <td><span class="status-badge ${a.estado}">${a.estado}</span></td>
        </tr>
    `).join('');
}

// Actualizar cada 30 segundos
setInterval(cargarDashboard, 30000);

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarDashboard);