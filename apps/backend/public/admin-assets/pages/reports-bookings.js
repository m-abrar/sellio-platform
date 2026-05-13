/**
 * Analytical Reporting: Booking Velocity Analytics Orchestration
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const chartElement = document.getElementById('bookingTrendChart');
        if (!chartElement) return;

        const ctx = chartElement.getContext('2d');
        const config = JSON.parse(chartElement.dataset.chartConfig || '{}');

        // Create Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(70, 165, 172, 0.4)');
        gradient.addColorStop(1, 'rgba(70, 165, 172, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: config.labels || [],
                datasets: [{
                    label: 'Bookings Count',
                    data: config.data || [],
                    backgroundColor: gradient,
                    borderColor: '#46a5ac',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#46a5ac",
                    pointBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    xAxes: [{
                        gridLines: { display: false, drawBorder: false },
                        ticks: { fontColor: '#94a3b8', fontStyle: '600' }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#94a3b8',
                            fontStyle: '600',
                            padding: 10,
                            callback: function(value) {
                                if (Number.isInteger(value)) return value;
                            }
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, 0.03)",
                            zeroLineColor: "rgba(0, 0, 0, 0.03)",
                            drawBorder: false
                        }
                    }]
                },
                tooltips: {
                    backgroundColor: "#1e293b",
                    titleFontColor: "#fff",
                    bodyFontColor: "#fff",
                    cornerRadius: 8,
                    xPadding: 12,
                    yPadding: 12,
                    displayColors: false,
                }
            }
        });
    });
})(jQuery);
