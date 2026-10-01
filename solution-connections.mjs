export const solutionConnections = {
  ai: { name: 'AI', path: ['systems','ai','dashboards'], example: 'AI sorts and drafts repetitive work. A person reviews anything important, with the result visible in one dashboard.' },
  software: { name: 'Software', path: ['apps','software','systems','dashboards'], example: 'A mobile app sends a customer request to software. Your CRM tracks the work and a dashboard shows its progress.' },
  websites: { name: 'Website', path: ['websites','systems','ai','dashboards'], example: 'A customer fills in your website form. The enquiry lands in your CRM with an owner assigned. If nobody replies within a day, a reminder goes out. Your team sees every open enquiry on one screen. Four tools, one system, nothing missed.' },
  branding: { name: 'Brand', path: ['branding','websites','presence'], example: 'Your brand shapes the message and visual identity. Your website and online presence carry that same promise to customers.' },
  systems: { name: 'CRM & business systems', path: ['websites','systems','software','ai'], example: 'Website enquiries flow into a shared CRM. Software supports your team’s workflow, with AI assisting on repeatable steps.' },
  dashboards: { name: 'Dashboards', path: ['systems','software','dashboards'], example: 'Information from business systems and software comes together in a dashboard, helping your team see what needs attention.' },
  apps: { name: 'Mobile app', path: ['branding','apps','software','systems'], example: 'A mobile app connects customers to your software and business systems, keeping requests and updates in sync.' },
  presence: { name: 'Online presence', path: ['branding','presence','websites','systems'], example: 'Consistent branding across online channels helps people find your website. Enquiries then enter your CRM for follow-up.' },
};
const section = typeof document !== 'undefined' && document.querySelector('.solution-puzzle');
if (section) {
  const buttons = [...section.querySelectorAll('[data-piece]')];
  function select(key) {
    const entry = solutionConnections[key];
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.piece === key));
      button.classList.toggle('is-connected', entry.path.includes(button.dataset.piece));
    });
    section.querySelector('[data-connection-label]').textContent = entry.name;
    section.querySelector('[data-connection-example]').textContent = entry.example;
    section.querySelector('[data-connection-path]').replaceChildren(...entry.path.map(id => {
      const item = document.createElement('li'); item.textContent = solutionConnections[id].name; return item;
    }));
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.piece)));
  select('websites');
}
