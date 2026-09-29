import { blogPosts } from './blog-posts.mjs?v=3';
const dialog = document.querySelector('#blog-dialog');
if (dialog) {
  let opener;
  const external = dialog.querySelector('[data-blog-external]');
  document.querySelectorAll('[data-blog-open]').forEach(button => {
    button.addEventListener('click', () => {
      const post = blogPosts[button.dataset.blogOpen];
      if (!post) return;
      opener = button;
      let url;
      try { const candidate = new URL(post.externalUrl); if (candidate.protocol === 'https:') url = candidate.href; } catch {}
      dialog.querySelector('[data-blog-category]').textContent = post.category;
      dialog.querySelector('#blog-dialog-title').textContent = post.title;
      const author = dialog.querySelector('[data-blog-author]');
      author.textContent = post.author ? `By ${post.author}` : '';
      author.hidden = !post.author;
      dialog.querySelector('[data-blog-description]').textContent = post.description;
      const preview = dialog.querySelector('[data-blog-preview]');
      preview.textContent = post.preview || '';
      preview.hidden = !post.preview;
      const content = dialog.querySelector('[data-blog-content]');
      content.replaceChildren();
      const template = post.contentTemplate && document.getElementById(post.contentTemplate);
      if (template) content.append(template.content.cloneNode(true));
      external.hidden = !url;
      if (url) external.href = url; else external.removeAttribute('href');
      dialog.querySelector('[data-blog-pending]').hidden = !!url || !!post.contentTemplate;
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  dialog.querySelector('[data-blog-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
}
