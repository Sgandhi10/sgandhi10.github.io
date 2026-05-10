/**
 * projects-list.js
 * Loads and renders the full project archive on projects.html
 */

/**
 * @typedef {Object} Project
 * @property {string} title
 * @property {string} category
 * @property {string} description
 * @property {string[]} tags
 * @property {string} [date]
 * @property {string} detailsLink
 * @property {boolean} [isExternal]
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('projects/projects.json');
        if (!res.ok) {
            console.error('Failed to load projects.json');
            return;
        }

        /** @type {Project[] | { projects: Project[] }} */
        const data = await res.json();
        const container = document.getElementById('full-projects-list');
        const projectList = Array.isArray(data) ? data : data.projects;

        // Sort projects by date, newest first
        projectList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        projectList.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';

            const isExternal = proj.isExternal || proj.detailsLink.startsWith('http');
            const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
            const projectDate = proj.date
                ? new Date(proj.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                : '';

            card.innerHTML = `
                <h3>${proj.title}</h3>
                <span class="date" style="display:block;margin-bottom:0.5rem;color:var(--accent);font-weight:500;">
                    ${proj.category}${projectDate ? ` &bull; ${projectDate}` : ''}
                </span>
                <p style="margin-bottom:1.5rem;color:var(--text-muted);line-height:1.6;">
                    ${proj.description}
                </p>
                <div class="project-tags" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:auto;">
                    ${proj.tags.map(t => `<span class="skill-tag" style="font-size:0.75rem;background:var(--card-border);padding:4px 8px;border-radius:4px;">${t}</span>`).join('')}
                    <a href="${proj.detailsLink}" class="read-more-link" style="margin-left:auto;color:var(--text-main);" ${targetAttr}>
                        View ${isExternal ? 'Site' : 'Details'}
                    </a>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (e) {
        console.error('Error loading all projects:', e);
        const container = document.getElementById('full-projects-list');
        if (container) container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:3rem;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;">
                <p style="color:var(--text-muted);">Unable to load projects at this time.</p>
            </div>
        `;
    }
});
