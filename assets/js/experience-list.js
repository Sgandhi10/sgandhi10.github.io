/**
 * experience-list.js
 * Loads and renders the full experience list on experience.html
 */

/**
 * @typedef {Object} ExperienceItem
 * @property {string} company
 * @property {string} role
 * @property {string} period
 * @property {string} location
 * @property {{title: string, period: string}[]} [roles]
 * @property {string[]} highlights
 * @property {string} [detailsLink]
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('experience/experience.json');
        if (!res.ok) {
            console.error('Failed to load experience.json');
            return;
        }

        const data = await res.json();
        const container = document.getElementById('full-experience-list');

        /** @type {ExperienceItem[]} */
        const expList = data.experience ? data.experience : data;

        expList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card resume-card';

            const bullets = item.highlights.map(h => `<li>${h}</li>`).join('');
            const rolesHTML = item.roles ? `
                <div class="resume-roles">
                    ${item.roles.map(role => `
                        <div class="resume-role-row">
                            <span class="resume-role-title">${role.title}</span>
                            <span class="resume-role-date">${role.period}</span>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="resume-header-row" style="margin-top:0.4rem;">
                    <span class="company" style="color:var(--accent);font-weight:bold;font-size:1.1rem;">${item.role}</span>
                    <span class="date" style="color:var(--text-muted);font-size:0.95rem;font-weight:500;">${item.period}</span>
                </div>
            `;

            const linkHTML = item.detailsLink ? `
                <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--card-border);">
                    <a href="${item.detailsLink}" class="read-more-link" style="color:var(--text-main);">
                        Read Full Breakdown
                    </a>
                </div>
            ` : '';

            card.innerHTML = `
                <div class="resume-header-row" style="margin-bottom:0.2rem;">
                    <h3 style="margin-bottom:0;">${item.company}</h3>
                    <span class="location" style="color:var(--text-muted);font-size:0.9rem;">${item.location}</span>
                </div>
                ${rolesHTML}
                <ul class="resume-bullets">${bullets}</ul>
                ${linkHTML}
            `;

            container.appendChild(card);
        });
    } catch (e) {
        console.error('Error loading experience data:', e);
        const container = document.getElementById('full-experience-list');
        if (container) container.innerHTML = `
            <div style="text-align:center;padding:3rem;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;">
                <p style="color:var(--text-muted);">Unable to load experience at this time.</p>
            </div>
        `;
    }
});
