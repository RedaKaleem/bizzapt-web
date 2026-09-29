// One source for capability relationships and the paths visitors can explore.
export const capabilities = {
  strategy: { label: 'Strategy', title: 'The right questions connect everything.', description: 'Understand the business and its customers. Use that direction to shape the brand, the experience and the technology behind it.', path: ['strategy', 'brand', 'experience', 'technology', 'data'] },
  brand: { label: 'Brand', title: 'A promise that carries through.', description: 'A clear position becomes a recognizable identity. The experience and website make that promise tangible for the people you serve.', path: ['strategy', 'brand', 'experience', 'web'] },
  experience: { label: 'Experience', title: 'Make every part work for people.', description: 'Connect what people need with the brand they meet, the website they use and the software that helps your team serve them.', path: ['strategy', 'brand', 'experience', 'web', 'software'] },
  web: { label: 'Web', title: 'A website is part of a bigger picture.', description: 'A clear strategy shapes the brand. Experience makes it usable. Data helps us understand what to improve.', path: ['strategy', 'brand', 'experience', 'web', 'data'] },
  software: { label: 'Software', title: 'Build around the way your business works.', description: 'Useful software connects the people, information and tools behind the work. Integrations keep the pieces working together.', path: ['strategy', 'experience', 'software', 'integrations', 'data'] },
  technology: { label: 'Technology', title: 'The tool follows the need.', description: 'Start with a clear direction. Choose the software and integrations that fit your constraints, then learn from the information they produce.', path: ['strategy', 'technology', 'software', 'integrations', 'data'] },
  data: { label: 'Data', title: 'Turn information into a useful next move.', description: 'Connect the questions that matter with reliable information. Bring that learning back into the experience and the work your team does.', path: ['strategy', 'data', 'experience', 'automation'] },
  integrations: { label: 'Integrations', title: 'Give your systems a shared language.', description: 'Connect software and data so information can move between tools. That creates a stronger foundation for useful automation.', path: ['technology', 'software', 'data', 'integrations', 'automation'] },
  automation: { label: 'Automation', title: 'Simplify the work. Then connect the tools.', description: 'Understand the process before automating it. Connect the data and systems, automate repeatable steps, and use AI only where it helps.', path: ['strategy', 'data', 'integrations', 'automation', 'ai'] },
  ai: { label: 'AI', title: 'Useful assistance. Human judgment.', description: 'Start with a clear purpose and trustworthy data. Connect AI to the workflow with appropriate boundaries, review and feedback.', path: ['strategy', 'data', 'integrations', 'ai', 'automation'] }
};

export const challengeAliases = { branding: 'launch', data: 'grow', 'web-design': 'optimize', 'web-development': 'scale' };
export const challenges = ['launch', 'grow', 'optimize', 'scale'];
export function resolveChallenge(hash) {
  const key = hash.replace(/^#/, '');
  return challenges.includes(key) ? key : challengeAliases[key] || 'launch';
}
export const accomplishmentByChallenge = {
  launch: 'Launch something new', grow: 'Grow the business', optimize: 'Fix inefficient operations',
  scale: 'Connect our systems', unsure: 'Not sure yet'
};
