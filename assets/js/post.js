/**
 * post.js
 * Loads and renders an individual blog post on post.html.
 * Reads the post ID from the URL query parameter ?id=<post-id>
 * Requires: marked.js and MathJax (loaded via CDN in post.html)
 */

/**
 * @typedef {Object} PostMeta
 * @property {string} id
 * @property {string} title
 * @property {string} date
 * @property {string} [last_edited]
 * @property {string} [tag]
 */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        document.getElementById('post-title').innerText = 'Post Not Found';
        document.getElementById('markdown-content').innerHTML = '<p>Invalid post ID. Please return to the blog and select a valid article.</p>';
        return;
    }

    /** @type {PostMeta | null} */
    let globalPostMeta = null;

    fetch('blogs/posts.json')
        .then(response => response.json())
        .then(posts => {
            globalPostMeta = posts.find(p => p.id === postId);
            if (globalPostMeta) {
                document.getElementById('post-title').innerText = globalPostMeta.title;
                document.title = `${globalPostMeta.title} | Soham Gandhi`;
            }
        })
        .catch(err => console.error('Error fetching post metadata:', err));

    fetch(`blogs/${postId}.md`)
        .then(response => {
            if (!response.ok) throw new Error('Markdown file not found');
            return response.text();
        })
        .then(markdown => {
            const wordCount = markdown.split(/\s+/).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            if (globalPostMeta) {
                const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                let metaHTML = `<span class="meta-item">Published: ${formatDate(globalPostMeta.date)}</span>`;

                if (globalPostMeta.last_edited && globalPostMeta.last_edited !== globalPostMeta.date) {
                    metaHTML += `
                        <span class="meta-separator">|</span>
                        <span class="meta-item">Updated: ${formatDate(globalPostMeta.last_edited)}</span>
                    `;
                }

                metaHTML += `
                    <span class="meta-separator">|</span>
                    <span class="meta-item">${readTime} min read</span>
                    <span class="meta-separator">|</span>
                    <span class="meta-item" style="color:var(--accent);font-weight:bold;">${globalPostMeta.tag || 'Article'}</span>
                `;

                document.getElementById('post-meta').innerHTML = metaHTML;
            }

            const contentDiv = document.getElementById('markdown-content');

            // Configure marked to preserve line breaks
            marked.setOptions({ breaks: true, gfm: true });

            // Protect math blocks from being mangled by the Markdown parser
            const mathBlocks = [];
            const protectedMarkdown = markdown
                .replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
                    mathBlocks.push(match);
                    return `@@MATH_BLOCK_${mathBlocks.length - 1}@@`;
                })
                .replace(/\$([^\$\n]+?)\$/g, (match) => {
                    mathBlocks.push(match);
                    return `@@MATH_BLOCK_${mathBlocks.length - 1}@@`;
                });

            // Parse the protected markdown
            let htmlContent = marked.parse(protectedMarkdown);

            // Restore math blocks exactly as they were
            htmlContent = htmlContent.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, index) => {
                return mathBlocks[parseInt(index)];
            });

            contentDiv.innerHTML = htmlContent;

            contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                heading.id = heading.textContent
                    .toLowerCase()
                    .replace(/\W+/g, '-')
                    .replace(/^-+|-+$/g, '');
            });

            // Trigger MathJax to process the newly added content
            const renderMath = () => {
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([contentDiv]).catch(err => console.error('MathJax error:', err));
                }
            };

            if (window.MathJax && window.MathJax.typesetPromise) {
                renderMath();
            } else {
                document.getElementById('MathJax-script').addEventListener('load', renderMath);
            }
        })
        .catch(err => {
            document.getElementById('post-title').innerText = 'Error Loading Article';
            document.getElementById('markdown-content').innerHTML = `
                <div style="text-align:center;padding:3rem;">
                    <p style="color:var(--text-muted);margin-bottom:2rem;">Sorry, the content for this post could not be loaded. Please ensure the Markdown file exists at blogs/${postId}.md</p>
                </div>
            `;
        });
});
