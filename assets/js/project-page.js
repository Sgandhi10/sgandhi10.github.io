/**
 * project-page.js
 * Shared loader for all project subpages.
 *
 * Usage: add data-project-id="<id>" to <body> on any project subpage.
 * Automatically populates the page header (title, category, role, tags)
 * and renders a gallery if gallery data exists in projects.json for that project.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const projectId = document.body.dataset.projectId;
    if (!projectId) return;

    try {
        const res = await fetch('projects.json');
        if (!res.ok) throw new Error('Failed to load projects.json');
        const projects = await res.json();
        const proj = projects.find(p => p.id === projectId);
        if (!proj) return;

        // --- Header ---
        document.title = `${proj.title} | Soham Gandhi`;

        const titleEl = document.getElementById('proj-title');
        const metaEl  = document.getElementById('proj-meta');
        const tagsEl  = document.getElementById('proj-tags');

        if (titleEl) titleEl.textContent = proj.title;
        if (metaEl)  metaEl.innerHTML = proj.category
            + (proj.role ? ` <span>| ${proj.role}</span>` : '');
        if (tagsEl)  tagsEl.innerHTML = proj.tags
            .map(t => `<span class="skill-tag">${t}</span>`)
            .join('');

        // --- Gallery (optional) ---
        const galleryEl = document.getElementById('dynamic-gallery');
        if (galleryEl && proj.gallery) {
            const { folder, images } = proj.gallery;
            const basePath = `../assets/img/${folder}/`;
            images.forEach(filename => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.style.cssText = 'border-radius:12px;overflow:hidden;border:1px solid var(--card-border);background:var(--card-bg);transition:transform 0.3s ease;';

                const img = document.createElement('img');
                img.src = basePath + filename;
                img.alt = `${proj.title} - ${filename.split('.')[0].replace(/-/g, ' ')}`;
                img.style.cssText = 'width:100%;height:100%;display:block;aspect-ratio:4/3;object-fit:cover;';

                item.appendChild(img);
                galleryEl.appendChild(item);
            });
        }
    } catch (e) {
        console.error('Error loading project data:', e);
    }
});
