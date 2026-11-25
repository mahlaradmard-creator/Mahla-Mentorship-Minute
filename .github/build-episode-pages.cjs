const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const directory = process.argv[2];
const base = new URL(process.argv[3].replace(/\/?$/, '/'));
const template = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
const episodeScript = fs.readFileSync(path.join(directory, 'episodes.js'), 'utf8');
const episodes = vm.runInNewContext(episodeScript + '\n;EPISODES').slice().sort((a, b) => b.number - a.number);
const marker = '<!-- Episode share metadata -->';

if (!template.includes(marker) || !episodes.length) {
  throw new Error('Expected the episode preview marker in index.html and an episode list in episodes.js.');
}

const escape = value => String(value).replace(/[&<>"']/g, ch =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

function savePage(filename, episode) {
  const title = 'Mentorship Minute with ' + episode.mentor;
  const canonical = new URL(filename || './', base).href;
  const meta = (attr, key, value) => '<meta ' + attr + '="' + key + '" content="' + escape(value) + '">';
  const tags = [
    '<link rel="canonical" href="' + escape(canonical) + '">',
    meta('property', 'og:url', canonical),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', 'Mahla’s Mentorship Minute'),
    meta('property', 'og:title', title),
    meta('property', 'og:description', episode.question),
    meta('name', 'twitter:card', episode.poster ? 'summary_large_image' : 'summary'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', episode.question),
  ];
  if (episode.poster) {
    const image = new URL(episode.poster, base).href;
    const alt = 'Mentorship Minute, Episode ' + episode.number + ' with ' + episode.mentor;
    tags.push(meta('property', 'og:image', image), meta('name', 'twitter:image', image),
      meta('property', 'og:image:alt', alt), meta('name', 'twitter:image:alt', alt));
  }
  fs.writeFileSync(path.join(directory, filename || 'index.html'), template.replace(marker, () => tags.join('\n')));
}

for (const episode of episodes) {
  if (!Number.isSafeInteger(episode.number) || episode.number < 1) throw new Error('Invalid episode number.');
  savePage('episode-' + episode.number + '.html', episode);
}
savePage('', episodes[0]);
