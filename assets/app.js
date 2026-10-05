'use strict';

const byId = (id) => document.getElementById(id);
const list = (value) => Array.isArray(value) ? value : [];
const text = (value) => typeof value === 'string' ? value : '';
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let themeIsExplicit = false;
try { themeIsExplicit = ['light', 'dark'].includes(localStorage.getItem('portfolio-theme')); } catch {}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  byId('theme-toggle').setAttribute('aria-pressed', String(theme === 'dark'));
  byId('theme-toggle').title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#333333' : '#dfdfdf';
}
applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
byId('theme-toggle').addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  themeIsExplicit = true;
  applyTheme(theme);
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});
systemTheme.addEventListener('change', (event) => {
  if (!themeIsExplicit) applyTheme(event.matches ? 'dark' : 'light');
});
function node(tag, content, className) {
  const element = document.createElement(tag);
  if (content !== undefined) element.textContent = text(content);
  if (className) element.className = className;
  return element;
}
function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function tags(items) {
  const ul = node('ul', undefined, 'tags');
  list(items).forEach((item) => ul.append(node('li', item)));
  return ul;
}
function dateLabel(value) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return '';
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}
function section(id, items, renderItem, navLabel) {
  byId(id).hidden = items.length === 0;
  items.forEach(renderItem);
  if (items.length && navLabel) {
    const anchor = node('a', navLabel);
    anchor.href = `#${id}`;
    byId('navigation').append(anchor);
  }
}
function render(data) {
  ['name', 'title', 'summary'].forEach((key) => { byId(key).textContent = text(data[key]); });
  byId('brand').textContent = text(data.name);
  byId('footer-name').textContent = text(data.name);
  document.title = `${text(data.name)} | ${text(data.title)}`;
  document.querySelector('meta[name="description"]').content = text(data.summary);
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = text(data.summary);
  const projects = list(data.projects).filter((item) => item.featured !== false);
  section('projects', projects, (item) => {
    const url = safeUrl(item.url);
    const project = node(url ? 'a' : 'article', undefined, 'project');
    if (url) project.href = url;
    project.append(node('h3', item.name), node('p', item.description), tags(item.stack));
    byId('project-list').append(project);
  }, 'Projects');
  section('skills', list(data.skills), (item) => {
    const group = node('div', undefined, 'skill-group');
    group.append(node('h3', item.group), tags(item.items));
    byId('skill-list').append(group);
  }, 'Skills');
  const experience = [...list(data.experience)].sort((a, b) => text(b.start).localeCompare(text(a.start)));
  section('experience', experience, (item) => {
    const entry = node('article', undefined, 'entry');
    const dates = node('p', `${dateLabel(item.start)} — ${item.end === null ? 'Present' : dateLabel(item.end)}`, 'date');
    if (item.end === null) {
      entry.classList.add('is-current');
      dates.append(node('span', 'Current', 'current'));
    }
    entry.append(node('h3', item.role), node('p', item.org, 'organization'), dates);
    if (list(item.points).length) {
      const points = node('ul');
      item.points.forEach((point) => points.append(node('li', point)));
      entry.append(points);
    }
    byId('experience-list').append(entry);
  }, 'Experience');
  section('education', list(data.education), (item) => {
    const entry = node('article', undefined, 'entry');
    entry.append(node('h3', item.degree), node('p', item.org, 'organization'), node('p', item.period, 'date'));
    byId('education-list').append(entry);
  });
  const links = list(data.links).filter((item) => safeUrl(item.url));
  const email = text(data.email).trim();
  byId('contact').hidden = !email && !links.length;
  byId('email').hidden = !email;
  if (email) {
    byId('email').textContent = email;
    byId('email').href = `mailto:${encodeURIComponent(email)}`;
  }
  links.forEach((item) => {
    const anchor = node('a', item.label);
    anchor.href = safeUrl(item.url);
    byId('contact-links').append(anchor);
  });
  if (email || links.length) {
    const anchor = node('a', 'Contact');
    anchor.href = '#contact';
    byId('navigation').append(anchor);
  }
  byId('portfolio').hidden = false;
  byId('load-status').hidden = true;
}

async function loadPortfolio() {
  try {
    const response = await fetch('./data/data.json');
    if (!response.ok) throw new Error('Data request failed');
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid data');
    render(data);
  } catch {
    byId('portfolio').hidden = true;
    byId('load-status').hidden = false;
    byId('load-status').textContent = 'Unable to load the portfolio. Check that data/data.json exists and contains valid JSON.\nFor local preview, run: python -m http.server 8000\nThen open http://localhost:8000.';
  }
}
loadPortfolio();
