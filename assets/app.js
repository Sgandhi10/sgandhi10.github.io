document.addEventListener('DOMContentLoaded', () => {
    loadRecentBlogs();
    loadExperience();
    loadFeaturedProjects();
    typeEffect();
    initScrollAnimations();
});

function loadRecentBlogs() {
    const container = document.getElementById('recent-blog-posts');
    if (!container) return;
    
    fetch('blogs/posts.json')
        .then(response => response.json())
        .then(posts => {
            posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const topTwo = posts.slice(0, 2);
            topTwo.forEach(post => {
                container.insertAdjacentHTML('beforeend', `
                    <div class="card">
                        <h3>${post.title}</h3>
                        <p class="card-summary">${post.summary}</p>
                        <a href="post.html?id=${post.id}">Read Article &rarr;</a>
                    </div>
                `);
            });
        })
        .catch(e => console.error("Error loading blogs:", e));
}

async function loadExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;
    
    try {
        const response = await fetch('experience/experience.json');
        const data = await response.json();

        data.slice(0, 2).forEach(item => {
            const card = `
            <div class="card">
                <h3>${item.company}</h3>
                <span class="company">${item.role}</span>
                <span class="date">${item.period} | ${item.location}</span>
                <ul>
                    ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
                <div class="project-tags mt-1">
                    <a href="${item.detailsLink}" class="read-more-link">Read Full Breakdown</a>
                </div>
            </div>
        `;
            container.insertAdjacentHTML('beforeend', card);
        });
    } catch (e) {
        console.error("Error loading experience:", e);
    }
}

async function loadFeaturedProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    try {
        const res = await fetch('projects/projects.json');
        const data = await res.json();

        const featured = data.filter(proj => proj.featured === true);

        featured.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'card';

            const isExternal = proj.isExternal || proj.detailsLink.startsWith('http');
            const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
            const projectDate = proj.date ? new Date(proj.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

            card.innerHTML = `
            <h3>${proj.title}</h3>
            <span class="date featured-date">
                ${proj.category} ${projectDate ? `&bull; ${projectDate}` : ''}
            </span>
            <p class="card-description">
                ${proj.description}
            </p>
            <div class="project-tags tag-flex">
                ${(proj.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('')}
                <a href="${proj.detailsLink}" class="read-more-link ml-auto" ${targetAttr}>
                    View ${isExternal ? 'Site' : 'Details'}
                </a>
            </div>
        `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading featured projects:", e);
    }
}

const words = ["Developer.", "Creator.", "Tinkerer.", "Computer Engineer.", "Robotics Enthusiast."];
let i = 0, charIndex = 0, isDeleting = false;
function typeEffect() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    let currentWord = words[i];
    el.innerHTML = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
    let typeSpeed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; i = (i + 1) % words.length; typeSpeed = 400; }
    setTimeout(typeEffect, typeSpeed);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach((el) => {
        observer.observe(el);
    });
}
