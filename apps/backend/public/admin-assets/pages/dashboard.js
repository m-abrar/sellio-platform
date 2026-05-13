/**
 * Administrative Command Center Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        if (!window.dashboardData) return;
        const data = window.dashboardData;

        // Dashboard Clock
        function updateClock() {
            const clockEl = document.getElementById('dashboard-clock');
            if (clockEl) {
                const now = new Date();
                clockEl.textContent = now.toLocaleTimeString();
            }
        }
        setInterval(updateClock, 1000);
        updateClock();

        // 1. Chart.js Global Config
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    display: true, 
                    position: 'bottom', 
                    labels: { 
                        usePointStyle: true, 
                        padding: 20, 
                        font: { family: "'Outfit', sans-serif", size: 11 } 
                    } 
                } 
            }
        };

        // 2. Revenue Analytics
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx && data.revenue_chart) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: data.revenue_chart.labels,
                    datasets: [
                        { 
                            label: 'Gross Revenue', 
                            data: data.revenue_chart.gross_earnings, 
                            borderColor: '#46a5ac', 
                            backgroundColor: 'rgba(70, 165, 172, 0.1)', 
                            fill: true, 
                            tension: 0.4, 
                            borderWidth: 3, 
                            pointRadius: 4, 
                            pointBackgroundColor: '#fff', 
                            pointBorderColor: '#46a5ac', 
                            pointBorderWidth: 2 
                        },
                        { 
                            label: 'Platform Outflow', 
                            data: data.revenue_chart.total_payouts, 
                            borderColor: '#1e293b', 
                            borderDash: [5, 5], 
                            fill: false, 
                            tension: 0.4, 
                            borderWidth: 2 
                        }
                    ]
                },
                options: baseOptions
            });
        }

        // 3. Distribution Pie
        const typeCtx = document.getElementById('propertyTypeChart');
        if (typeCtx && data.type_chart) {
            new Chart(typeCtx, {
                type: 'doughnut',
                data: {
                    labels: data.type_chart.labels,
                    datasets: [{ 
                        data: data.type_chart.data, 
                        backgroundColor: ['#46a5ac', '#1e293b', '#64748b', '#94a3b8', '#cbd5e1'], 
                        borderWidth: 0, 
                        hoverOffset: 15 
                    }]
                },
                options: { 
                    ...baseOptions, 
                    cutout: '70%', 
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    } 
                }
            });
        }

        // 4. Operational Calendar
        const calendarEl = document.getElementById('master-calendar');
        if (calendarEl && typeof FullCalendar !== 'undefined') {
            new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                themeSystem: 'bootstrap',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
                events: data.calendar_events || [],
                height: 'auto',
                eventColor: '#46a5ac'
            }).render();
        }

        // 5. Geospatial Heatmap
        const mapEl = document.getElementById('heatmap');
        if (mapEl && typeof L !== 'undefined') {
            const map = L.map('heatmap', { scrollWheelZoom: false }).setView([30.3753, 69.3451], 5);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
            if (L.heatLayer && data.heatmap_data) {
                L.heatLayer(data.heatmap_data, { 
                    radius: 25, 
                    blur: 15, 
                    gradient: {0.4: '#46a5ac', 0.65: '#1e293b', 1: '#000'} 
                }).addTo(map);
            }
        }
    });
})(jQuery);
