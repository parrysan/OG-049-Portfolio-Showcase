/* OGANIKO Project footer — ods-project-footer v1.1.0 */
/* Select-only combobox (ARIA APG) built from the registry named by data-registry on
   .ods-project-footer__portals. Picking a portal goes straight to it. If the script or the
   registry fails, the plain link list in the markup stays. */
(() => {
  const root = document.querySelector('.ods-project-footer__portals')
  if (!root) return
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

  fetch(root.dataset.registry || '/_shared/project-portals.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json() })
    .then((d) => {
      const list = (Array.isArray(d) ? d : d.portals || []).filter((p) => p && p.name && p.url)
      if (list.length) build(list)
    })
    .catch(() => {})

  function build(list) {
    // The current portal is the longest registry URL this page sits under, else data-project.
    const here = location.href.split('#')[0]
    let cur = -1
    let best = 0
    list.forEach((p, i) => { if (here.startsWith(p.url) && p.url.length > best) { best = p.url.length; cur = i } })
    if (cur < 0 && root.dataset.project) cur = list.findIndex((p) => p.code === root.dataset.project)

    const id = 'ods-portals'
    const meta = (p) => esc(p.code || '') + (p.status === 'preview' ? (p.code ? ' · ' : '') + 'preview' : '')
    root.innerHTML = `<span class="ods-project-footer__portals-label" id="${id}-label">Project portals</span>
<div class="og-select__control"><div class="og-select__trigger" id="${id}-combo" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" aria-labelledby="${id}-label ${id}-combo">${esc(cur >= 0 ? list[cur].name : 'Choose a portal')}</div>
<span class="og-select__chevron" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 15.4 6 9.4 7.4 8l4.6 4.6L16.6 8 18 9.4z"/></svg></span>
<ul class="og-select__list" id="${id}-list" role="listbox" aria-labelledby="${id}-label" tabindex="-1" hidden>${list.map((p, i) => `<li class="og-select__option" id="${id}-opt-${i}" role="option" aria-selected="${i === cur}"><span>${esc(p.name)}</span><span class="ods-portals__meta">${meta(p)}</span></li>`).join('')}</ul></div>`
    root.classList.add('og-select', 'is-enhanced')

    const box = root.querySelector('[role=combobox]')
    const ul = root.querySelector('[role=listbox]')
    const opts = [...ul.children]
    let active = Math.max(cur, 0)
    let buf = ''
    let bufT

    const isOpen = () => !ul.hidden
    const paint = () => {
      opts.forEach((o, i) => o.classList.toggle('is-active', i === active))
      box.setAttribute('aria-activedescendant', opts[active].id)
      opts[active].scrollIntoView({ block: 'nearest' })
    }
    const open = () => {
      if (isOpen()) return
      // Open upward when there is not room for the list below and more room above.
      const r = box.getBoundingClientRect()
      root.classList.toggle('is-up', innerHeight - r.bottom < Math.min(360, innerHeight * 0.6) && r.top > innerHeight - r.bottom)
      ul.hidden = false
      box.setAttribute('aria-expanded', 'true')
      root.classList.add('is-open')
      paint()
    }
    const close = () => {
      buf = ''
      clearTimeout(bufT)
      ul.hidden = true
      box.setAttribute('aria-expanded', 'false')
      box.removeAttribute('aria-activedescendant')
      root.classList.remove('is-open')
    }
    const pick = (i) => {
      close()
      if (i === cur) return
      opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === i)))
      box.textContent = list[i].name
      location.href = list[i].url
    }
    const type = (ch) => {
      clearTimeout(bufT)
      bufT = setTimeout(() => { buf = '' }, 500)
      const same = buf.length && [...buf].every((c) => c === ch)
      buf += ch
      const q = same ? ch : buf
      const start = same || buf.length === 1 ? active + 1 : active
      for (let k = 0; k < opts.length; k++) {
        const i = (start + k) % opts.length
        if (list[i].name.toLowerCase().startsWith(q)) { active = i; break }
      }
    }

    box.addEventListener('keydown', (e) => {
      const k = e.key
      if (!isOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) { e.preventDefault(); active = Math.max(cur, 0); open() }
        else if (k === 'Home' || k === 'End') { e.preventDefault(); active = k === 'Home' ? 0 : opts.length - 1; open() }
        else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); open(); type(k.toLowerCase()); paint() }
        return
      }
      if (k === 'ArrowDown') { e.preventDefault(); if (e.altKey) return; active = Math.min(opts.length - 1, active + 1); paint() }
      else if (k === 'ArrowUp') { e.preventDefault(); if (e.altKey) { pick(active); return } active = Math.max(0, active - 1); paint() }
      else if (k === 'Home' || k === 'End') { e.preventDefault(); active = k === 'Home' ? 0 : opts.length - 1; paint() }
      else if (k === 'PageDown' || k === 'PageUp') { e.preventDefault(); active = Math.max(0, Math.min(opts.length - 1, active + (k === 'PageDown' ? 10 : -10))); paint() }
      else if (k === 'Enter' || (k === ' ' && !buf)) { e.preventDefault(); pick(active) }
      else if (k === 'Escape') { e.preventDefault(); close() }
      else if (k === 'Tab') { close() }
      else if (k.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); type(k.toLowerCase()); paint() }
    })
    box.addEventListener('click', () => { if (isOpen()) close(); else { active = Math.max(cur, 0); open() } })
    ul.addEventListener('mousedown', (e) => e.preventDefault())
    ul.addEventListener('click', (e) => { const o = e.target.closest('[role=option]'); if (o) pick(opts.indexOf(o)) })
    ul.addEventListener('mousemove', (e) => { const o = e.target.closest('[role=option]'); if (o && opts.indexOf(o) !== active) { active = opts.indexOf(o); paint() } })
    box.addEventListener('blur', () => setTimeout(() => { if (!root.contains(document.activeElement)) close() }, 0))
    document.addEventListener('click', (e) => { if (!root.contains(e.target)) close() })
  }
})()
