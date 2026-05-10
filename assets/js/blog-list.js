/**
 * blog-list.js
 * Loads and renders all blog posts on blog.html
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string} date
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('blog-posts-container');
    const loadingText = document.getElementById('loading-text');

    fetch('blogs/posts.json')
        .then(response => {
            if (!response.ok) {
                console.error('Could not load posts.json');
                return null;
            }
            return response.json();
        })
        .then(posts => {
            if (!posts) return;

            container.innerHTML = '';

            // Sort posts: Newest first
            posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            if (posts.length === 0) {
                container.innerHTML = '<p style="color:var(--text-muted);">No posts found yet. Check back soon!</p>';
                return;
            }

            posts.forEach(post => {
                const dateObj = new Date(post.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                });

                const postCard = `
                    <article class="card">
                        <h3>${post.title}</h3>
                        <span class="date" style="display:block;margin-bottom:1rem;font-size:0.85rem;color:var(--accent);">
                            ${formattedDate}
                        </span>
                        <p style="color:var(--text-muted);margin-bottom:1.5rem;line-height:1.6;">
                            ${post.summary}
                        </p>
                        <div class="project-tags">
                            <a href="post.html?id=${post.id}" class="read-more" style="font-weight:bold;font-size:0.9rem;">
                                Read Article &rarr;
                            </a>
                        </div>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', postCard);
            });
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            if (loadingText) {
                loadingText.innerHTML = 'Error loading articles. Please ensure blogs/posts.json exists and is formatted correctly.';
            }
        });
});
