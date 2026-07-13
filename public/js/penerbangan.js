/* ========================================================
   BANDARA TARDAMU — Halaman Penerbangan JavaScript
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFlightPage();
});

/* ── Mock flight data ────────────────────────────────── */
function getFlightData() {
  const today = new Date();
  const todayStr = formatDateISO(today);
  const tomorrowStr = formatDateISO(new Date(today.getTime() + 86400000));

  return {
    kedatangan: [
      {
        airline: 'Wings Air',
        airlineKey: 'wings',
        code: 'IW-1831',
        origin: 'Kupang (KOE)',
        sta: '08:30',
        eta: '08:25',
        status: 'landed',
        statusLabel: 'Landed',
        date: todayStr
      },
      {
        airline: 'Citilink',
        airlineKey: 'citilink',
        code: 'QG-212',
        origin: 'Denpasar (DPS)',
        sta: '10:50',
        eta: '10:50',
        status: 'ontime',
        statusLabel: 'On Time',
        date: todayStr
      },
      {
        airline: 'NAM Air',
        airlineKey: 'nam',
        code: 'IN-271',
        origin: 'Waingapu (WGP)',
        sta: '12:20',
        eta: '12:35',
        status: 'delayed',
        statusLabel: 'Delayed',
        date: todayStr
      },
      {
        airline: 'TransNusa',
        airlineKey: 'transnusa',
        code: 'M8-630',
        origin: 'Kupang (KOE)',
        sta: '14:10',
        eta: '14:10',
        status: 'ontime',
        statusLabel: 'On Time',
        date: todayStr
      },
      {
        airline: 'Susi Air',
        airlineKey: 'susi',
        code: 'SI-8721',
        origin: 'Kupang (KOE)',
        sta: '15:30',
        eta: '15:30',
        status: 'ontime',
        statusLabel: 'On Time',
        date: todayStr
      },
      {
        airline: 'Wings Air',
        airlineKey: 'wings',
        code: 'IW-1835',
        origin: 'Kupang (KOE)',
        sta: '16:45',
        eta: '--:--',
        status: 'cancelled',
        statusLabel: 'Cancelled',
        date: todayStr
      },
      // Tomorrow flights
      {
        airline: 'Wings Air',
        airlineKey: 'wings',
        code: 'IW-1831',
        origin: 'Kupang (KOE)',
        sta: '08:30',
        eta: '08:30',
        status: 'ontime',
        statusLabel: 'On Time',
        date: tomorrowStr
      },
      {
        airline: 'Citilink',
        airlineKey: 'citilink',
        code: 'QG-212',
        origin: 'Denpasar (DPS)',
        sta: '10:50',
        eta: '10:50',
        status: 'ontime',
        statusLabel: 'On Time',
        date: tomorrowStr
      },
      {
        airline: 'NAM Air',
        airlineKey: 'nam',
        code: 'IN-271',
        origin: 'Waingapu (WGP)',
        sta: '12:20',
        eta: '12:20',
        status: 'ontime',
        statusLabel: 'On Time',
        date: tomorrowStr
      },
    ],
    keberangkatan: [
      {
        airline: 'Wings Air',
        airlineKey: 'wings',
        code: 'IW-1832',
        destination: 'Kupang (KOE)',
        std: '09:15',
        etd: '09:10',
        status: 'landed',
        statusLabel: 'Departed',
        date: todayStr
      },
      {
        airline: 'Citilink',
        airlineKey: 'citilink',
        code: 'QG-213',
        destination: 'Denpasar (DPS)',
        std: '11:40',
        etd: '11:40',
        status: 'boarding',
        statusLabel: 'Boarding',
        date: todayStr
      },
      {
        airline: 'NAM Air',
        airlineKey: 'nam',
        code: 'IN-272',
        destination: 'Waingapu (WGP)',
        std: '13:00',
        etd: '13:15',
        status: 'delayed',
        statusLabel: 'Delayed',
        date: todayStr
      },
      {
        airline: 'TransNusa',
        airlineKey: 'transnusa',
        code: 'M8-631',
        destination: 'Kupang (KOE)',
        std: '15:00',
        etd: '15:00',
        status: 'ontime',
        statusLabel: 'On Time',
        date: todayStr
      },
      {
        airline: 'Susi Air',
        airlineKey: 'susi',
        code: 'SI-8722',
        destination: 'Kupang (KOE)',
        std: '16:15',
        etd: '16:15',
        status: 'ontime',
        statusLabel: 'On Time',
        date: todayStr
      },
      {
        airline: 'Wings Air',
        airlineKey: 'wings',
        code: 'IW-1836',
        destination: 'Kupang (KOE)',
        std: '17:30',
        etd: '--:--',
        status: 'cancelled',
        statusLabel: 'Cancelled',
        date: todayStr
      },
      // Tomorrow
      {
        airline: 'Wings Air',
        airlineKey: 'wings',
        code: 'IW-1832',
        destination: 'Kupang (KOE)',
        std: '09:15',
        etd: '09:15',
        status: 'ontime',
        statusLabel: 'On Time',
        date: tomorrowStr
      },
      {
        airline: 'Citilink',
        airlineKey: 'citilink',
        code: 'QG-213',
        destination: 'Denpasar (DPS)',
        std: '11:40',
        etd: '11:40',
        status: 'ontime',
        statusLabel: 'On Time',
        date: tomorrowStr
      },
    ]
  };
}

/* ── Status → CSS class mapping ──────────────────────── */
function statusClass(status) {
  const map = {
    ontime: 'status--landed',
    landed: 'status--landed',
    delayed: 'status--delayed',
    cancelled: 'status--cancelled',
    boarding: 'status--boarding',
  };
  return map[status] || 'status--scheduled';
}

/* --- Airline → icon shorthand --- */
function airlineIcon(key) {
  const logos = {
    susi: '/assets/images/logo-susiair.webp'
  };
  return logos[key] || 'fa-solid fa-plane';
}

/* ── Date helpers ────────────────────────────────────── */
function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('id-ID', options);
}

/* ── Main init ───────────────────────────────────────── */
function initFlightPage() {
  const tabKedatangan = document.getElementById('tabKedatangan');
  const tabKeberangkatan = document.getElementById('tabKeberangkatan');
  const filterDate = document.getElementById('filterDate');
  const filterAirline = document.getElementById('filterAirline');
  const filterStatus = document.getElementById('filterStatus');
  const filterReset = document.getElementById('filterReset');

  if (!tabKedatangan) return; // Not on flight page

  const today = new Date();
  filterDate.value = formatDateISO(today);

  let currentTab = 'kedatangan';

  // Set display date
  updateDisplayDate(filterDate.value);

  // Initial render
  renderFlights(currentTab);

  // Tab switching
  tabKedatangan.addEventListener('click', () => {
    currentTab = 'kedatangan';
    setActiveTab(tabKedatangan, tabKeberangkatan);
    showPanel('kedatangan');
    renderFlights(currentTab);
  });

  tabKeberangkatan.addEventListener('click', () => {
    currentTab = 'keberangkatan';
    setActiveTab(tabKeberangkatan, tabKedatangan);
    showPanel('keberangkatan');
    renderFlights(currentTab);
  });

  // Filter events
  filterDate.addEventListener('change', () => {
    updateDisplayDate(filterDate.value);
    renderFlights(currentTab);
  });

  filterAirline.addEventListener('change', () => renderFlights(currentTab));
  filterStatus.addEventListener('change', () => renderFlights(currentTab));

  // Reset
  filterReset.addEventListener('click', () => {
    filterDate.value = formatDateISO(today);
    filterAirline.value = 'all';
    filterStatus.value = 'all';
    updateDisplayDate(filterDate.value);
    renderFlights(currentTab);
  });
}

/* ── Tab active state ────────────────────────────────── */
function setActiveTab(active, inactive) {
  active.classList.add('flight-tabs__btn--active');
  inactive.classList.remove('flight-tabs__btn--active');
}

/* ── Show/hide panels ────────────────────────────────── */
function showPanel(tab) {
  const panelK = document.getElementById('panelKedatangan');
  const panelD = document.getElementById('panelKeberangkatan');
  if (tab === 'kedatangan') {
    panelK.style.display = '';
    panelD.style.display = 'none';
  } else {
    panelK.style.display = 'none';
    panelD.style.display = '';
  }
}

/* ── Update display date ─────────────────────────────── */
function updateDisplayDate(dateStr) {
  const el = document.getElementById('displayDate');
  if (el && dateStr) {
    el.textContent = formatDateDisplay(dateStr);
  }
}

/* ── Render flight rows ──────────────────────────────── */
function renderFlights(tab) {
  const data = getFlightData();
  const flights = data[tab] || [];

  const filterDate = document.getElementById('filterDate').value;
  // Apply filters
  const filtered = flights.filter(f => {
    // Biarkan baris tanggal tetap ada agar filter tanggal masih berfungsi
    if (filterDate && f.date !== filterDate) return false;

    // Hapus atau beri komentar (//) pada dua baris di bawah ini:
    // if (filterAirline !== 'all' && f.airlineKey !== filterAirline) return false;
    // if (filterStatus !== 'all' && f.status !== filterStatus) return false;

    return true;
  });

  const tbodyId = tab === 'kedatangan' ? 'tbodyKedatangan' : 'tbodyKeberangkatan';
  const emptyId = tab === 'kedatangan' ? 'emptyKedatangan' : 'emptyKeberangkatan';
  const tableId = tab === 'kedatangan' ? 'tableKedatangan' : 'tableKeberangkatan';

  const tbody = document.getElementById(tbodyId);
  const emptyEl = document.getElementById(emptyId);
  const tableEl = document.getElementById(tableId);

  // Update count
  const countEl = document.getElementById('flightCount');
  if (countEl) {
    countEl.innerHTML = `Menampilkan <strong>${filtered.length}</strong> penerbangan`;
  }

  // No results
  if (filtered.length === 0) {
    tableEl.style.display = 'none';
    emptyEl.style.display = '';
    return;
  }

  tableEl.style.display = '';
  emptyEl.style.display = 'none';

  // Build rows
  let html = '';
  filtered.forEach(f => {
    const isKedatangan = tab === 'kedatangan';
    const place = isKedatangan ? f.origin : f.destination;
    const timeLabel1 = isKedatangan ? f.sta : f.std;
    const timeLabel2 = isKedatangan ? f.eta : f.etd;

    const iconVal = airlineIcon(f.airlineKey);
    const displayIcon = /\.(webp|png|jpe?g)$/i.test(iconVal) ? `<img src="${iconVal}" alt="${f.airline}" style="max-height: 20px;">` : `<i class="${iconVal}"></i>`;

    html += `
    <tr>
        <td>
            <div class="airline-cell">
                <div class="airline-cell__logo">
                    ${displayIcon}
                </div>
                <span class="airline-cell__name">${f.airline}</span>
            </div>
        </td>
        <td><strong>${f.code}</strong></td>
        <td>${place}</td>
        <td class="time-cell">${timeLabel1}</td>
        <td class="time-cell time-cell--estimate">${timeLabel2}</td>
        <td>
            <span class="status-badge ${statusClass(f.status)}">
                <i class="fa-solid fa-circle"></i> ${f.statusLabel}
            </span>
        </td>
    </tr>
`;
  });

  tbody.innerHTML = html;
}
