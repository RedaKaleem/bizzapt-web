export const solutionConnections = {
  ai: { name: 'AI Automation', path: ['systems','ai','dashboards'], example: 'A request enters your business system. Automation prepares the next step, and your dashboard flags anything that needs human review.' },
  software: { name: 'Custom Software', path: ['apps','software','systems','dashboards'], example: 'A mobile app sends a customer request to custom software. Your business system tracks the work and your dashboard shows its progress.' },
  websites: { name: 'Websites', path: ['websites','systems','ai','dashboards'], example: 'An enquiry comes through your website, enters your business system, triggers a follow-up and appears on your dashboard.' },
  branding: { name: 'Branding', path: ['branding','websites','presence'], example: 'Your brand shapes the message and visual identity. Your website and digital channels carry that same promise to customers.' },
  systems: { name: 'Business Systems', path: ['websites','systems','software','ai'], example: 'Website enquiries flow into a shared business system. Custom software supports your team’s workflow, with automation handling repeatable steps.' },
  dashboards: { name: 'Internal Dashboards', path: ['systems','software','dashboards'], example: 'Information from business systems and custom software comes together in a dashboard, helping your team see what needs attention.' },
  apps: { name: 'Mobile Apps', path: ['branding','apps','software','systems'], example: 'A branded mobile experience connects customers to your software and business systems, keeping requests and updates in sync.' },
  presence: { name: 'Digital Presence', path: ['branding','presence','websites','systems'], example: 'Consistent branding across digital channels helps people find your website. Enquiries then enter your business system for follow-up.' },
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
