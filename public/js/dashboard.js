document.addEventListener('DOMContentLoaded', () => {
    // === CHART.JS CONFIGURATION ===
    
    // 1. Line + Bar Chart (Tren Penumpang Bulanan)
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    
    // Gradient for Bar Chart
    const gradientBar = ctxTrend.createLinearGradient(0, 0, 0, 400);
    gradientBar.addColorStop(0, 'rgba(56, 189, 248, 0.8)'); // Light blue
    gradientBar.addColorStop(1, 'rgba(59, 130, 246, 0.2)'); // Blue transparent

    new Chart(ctxTrend, {
        type: 'bar',
        data: {
            labels: ['Nov 2023', 'Feb 2023', 'Mar 2023', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Apr 2024'],
            datasets: [
                {
                    type: 'line',
                    label: 'Total Load Factor (%)',
                    data: [65, 72, 78, 81, 85, 86, 85, 89],
                    borderColor: '#FACC15', // Yellow
                    borderWidth: 2,
                    pointBackgroundColor: '#FACC15',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    tension: 0.4,
                    yAxisID: 'y1'
                },
                {
                    type: 'bar',
                    label: 'Total Penumpang',
                    data: [35000, 42000, 48000, 52000, 55000, 58240, 57000, 62000],
                    backgroundColor: gradientBar,
                    borderRadius: 4,
                    barPercentage: 0.5,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false // Custom legend can be added in HTML
                },
                tooltip: {
                    backgroundColor: 'rgba(28, 30, 50, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#A0A0B0',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    usePointStyle: true,
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#A0A0B0', font: { size: 12 } }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: { 
                        color: '#A0A0B0',
                        callback: function(value) { return value / 1000 + 'K'; }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { display: false, drawBorder: false },
                    ticks: { 
                        color: '#A0A0B0',
                        callback: function(value) { return value + '%'; }
                    },
                    min: 50,
                    max: 100
                }
            },
            animation: {
                y: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        }
    });

    // 2. Donut Chart (Kedatangan vs Keberangkatan)
    const ctxDonut = document.getElementById('donutChart').getContext('2d');
    
    new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Kedatangan', 'Keberangkatan'],
            datasets: [{
                data: [50.1, 49.9],
                backgroundColor: [
                    '#8B5CF6', // Purple
                    '#FACC15'  // Yellow
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(28, 30, 50, 0.9)',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1500,
                easing: 'easeOutQuart'
            }
        },
        plugins: [{
            id: 'textCenter',
            beforeDraw: function(chart) {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;

                ctx.restore();
                var fontSize = (height / 114).toFixed(2);
                ctx.font = "bold " + fontSize + "em Outfit";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#FFFFFF";

                var text = "29,140",
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2 - 10;

                ctx.fillText(text, textX, textY);
                
                ctx.font = "normal " + (fontSize * 0.4) + "em Inter";
                ctx.fillStyle = "#A0A0B0";
                var subText = "50.1%",
                    subTextX = Math.round((width - ctx.measureText(subText).width) / 2),
                    subTextY = height / 2 + 15;
                    
                ctx.fillText(subText, subTextX, subTextY);
                ctx.save();
            }
        }]
    });

    // 3. Bar Chart (Waktu Tersibuk)
    const ctxTime = document.getElementById('timeChart').getContext('2d');
    
    // Gradient for Time Bar Chart
    const gradientTime = ctxTime.createLinearGradient(0, 0, 0, 150);
    gradientTime.addColorStop(0, '#FACC15'); // Yellow
    gradientTime.addColorStop(1, 'rgba(250, 204, 21, 0.1)'); // Yellow transparent

    new Chart(ctxTime, {
        type: 'bar',
        data: {
            labels: ['06:00', '10:00', '12:00', '17:00', '15:00', '16:00', '18:00'],
            datasets: [{
                data: [40, 120, 180, 260, 160, 110, 90],
                backgroundColor: gradientTime,
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(28, 30, 50, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#A0A0B0',
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return context.raw + ' Penumpang'; }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#A0A0B0', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: { color: '#A0A0B0', font: { size: 10 }, stepSize: 70 },
                    position: 'right'
                }
            },
            animation: {
                y: {
                    duration: 1500,
                    easing: 'easeOutQuart',
                    delay: (context) => context.dataIndex * 100
                }
            }
        }
    });

    // Add staggered animation classes sequentially
    const animatedElements = document.querySelectorAll('.glass-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0'; // Hide initially
        setTimeout(() => {
            el.classList.add('animated-element');
            el.style.opacity = '1';
        }, 100); // Give a slight delay before triggering CSS animations
    });
    
    // Filter button toggle
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
