/* ==========================================
   Dashboard Engine v2.0
   CGG HSE Digital Ecosystem
   Frontend + Live KPI
   ========================================== */

/* ---------- Dashboard State ---------- */

window.DashboardState = window.DashboardState || {

    inspection:0,
    finding:0,
    pica:0,
    hazard:0,
    incident:0,
    notification:0

};

const Dashboard={

    contractors:[
        {
            name:"PT Vendoura Inti Perkasa",
            code:"VIP",
            score:100
        },
        {
            name:"PT Sentosa Laju Sejahtera",
            code:"SLS",
            score:100
        }
    ],

    activities:[
        {
            time:"Hari ini",
            text:"Sistem Dashboard berhasil diinisialisasi."
        }
    ]

};

/* ---------- Hero ---------- */

function renderHero(){

    const hero=document.getElementById("hero");

    if(!hero) return;

    hero.innerHTML=`

        <div class="hero-card slide-up">

            <span class="badge badge-success">
                System Online
            </span>

            <h1 class="hero-title">
                Executive Dashboard
            </h1>

            <div id="hero-inspection" class="hero-number">
                0
            </div>

            <p class="hero-subtitle">
                Inspeksi Hari Ini
            </p>

        </div>

    `;

}

/* ---------- KPI ---------- */

function renderKPI(){

    const kpi=document.getElementById("kpi-section");

    if(!kpi) return;

    kpi.innerHTML=`

        <div class="kpi-card hover-lift">
            <span class="kpi-label">Inspection</span>
            <span id="kpi-inspection" class="kpi-value">0</span>
        </div>

        <div class="kpi-card hover-lift">
            <span class="kpi-label">Finding</span>
            <span id="kpi-finding" class="kpi-value">0</span>
        </div>

        <div class="kpi-card hover-lift">
            <span class="kpi-label">PICA</span>
            <span id="kpi-pica" class="kpi-value">0</span>
        </div>

        <div class="kpi-card hover-lift">
            <span class="kpi-label">Hazard</span>
            <span id="kpi-hazard" class="kpi-value">0</span>
        </div>

        <div class="kpi-card hover-lift">
            <span class="kpi-label">Incident</span>
            <span id="kpi-incident" class="kpi-value">0</span>
        </div>

        <div class="kpi-card hover-lift">
            <span class="kpi-label">Notification</span>
            <span id="notif-count" class="kpi-value">0</span>
        </div>

    `;

}

/* ---------- Dashboard Content ---------- */

function renderDashboardHome(){

    return`

        <div class="slide-up">

            <div class="section-header">

                <h2 class="section-title">
                    Ringkasan Operasional
                </h2>

                <span class="badge badge-info">
                    Prototype
                </span>

            </div>

            <div class="glass" style="padding:24px;margin-bottom:24px;">

                <h3 style="margin-bottom:16px;">
                    Aktivitas Terbaru
                </h3>

                ${Dashboard.activities.map(item=>`

                    <div style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08);">

                        <strong>${item.time}</strong>

                        <p style="margin-top:6px;color:var(--text-secondary);">
                            ${item.text}
                        </p>

                    </div>

                `).join("")}

            </div>

            <div class="glass" style="padding:24px;">

                <h3 style="margin-bottom:18px;">
                    Ringkasan Kontraktor
                </h3>

                ${Dashboard.contractors.map(c=>`

                    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08);">

                        <div>

                            <strong>${c.code}</strong>

                            <p style="color:var(--text-secondary);">
                                ${c.name}
                            </p>

                        </div>

                        <span class="badge badge-success">
                            ${c.score}
                        </span>

                    </div>

                `).join("")}

            </div>

        </div>

    `;

}

/* ---------- Init ---------- */

function initializeDashboard(){

    renderHero();
    renderKPI();

}
