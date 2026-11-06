/* OGANIKO Project header — ods-project-header v1.3.1 */
(function () {
  var COLLAPSE_Y = 40
  var EXPAND_Y = 8
  var pinY = 0

  function sync(header, scrolled) {
    header.classList.toggle('is-collapsed', scrolled)
    header.classList.toggle('is-stuck', scrolled)
  }

  function panelMode(nav) {
    return nav.hasAttribute('data-ods-tab-panels')
  }

  function holdScrollRange(y) {
    var vh = window.innerHeight || 0
    var need = Math.ceil((y || 0) + vh)
    if (need <= 0) return
    var root = document.documentElement
    var current = parseFloat(root.style.minHeight) || 0
    if (need > current) root.style.minHeight = need + 'px'
  }

  function releaseScrollHold() {
    document.documentElement.style.minHeight = ''
  }

  function pinScroll() {
    if ((window.scrollY || window.pageYOffset || 0) !== pinY) window.scrollTo(0, pinY)
  }

  function selectTab(nav, link) {
    nav.querySelectorAll('a').forEach(function (a) {
      if (a === link) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    })
    if (!panelMode(nav)) return
    pinY = window.scrollY || window.pageYOffset || 0
    // Panel hide/show can shrink scrollHeight below scrollY; the browser then clamps
    // to the top and scrollTo cannot restore past the new max. Hold height first.
    holdScrollRange(pinY)
    var hash = link.getAttribute('href') || ''
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute('href')
      var panel = document.getElementById((href || '').slice(1))
      if (!panel) return
      if (href === hash) panel.removeAttribute('hidden')
      else panel.setAttribute('hidden', '')
    })
    if (typeof history !== 'undefined' && history.replaceState && hash) {
      history.replaceState(null, '', hash)
    }
    pinScroll()
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(pinScroll)
  }

  function hashLink(nav, hash) {
    if (!hash || hash === '#') return null
    var links = nav.querySelectorAll('a[href^="#"]')
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === hash) return links[i]
    }
    return null
  }

  function bindTabs(header) {
    var nav = header.querySelector('.ods-project-header__tabs')
    if (!nav || nav.dataset.odsProjectTabsReady === 'true') return
    nav.dataset.odsProjectTabsReady = 'true'
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]')
      if (!link || !hashLink(nav, link.getAttribute('href'))) return
      if (!panelMode(nav)) {
        selectTab(nav, link)
        return
      }
      event.preventDefault()
      selectTab(nav, link)
      // Default focus-into-view of a transformed sticky tab scrolls the page to the top.
      if (typeof link.focus === 'function') {
        try { link.focus({ preventScroll: true }) }
        catch (err) { link.focus() }
      }
    })
    var initial = hashLink(nav, window.location.hash)
    if (initial) selectTab(nav, initial)
  }

  function init(header) {
    if (header.dataset.odsProjectHeaderReady === 'true') return
    header.dataset.odsProjectHeaderReady = 'true'
    var identity = header.querySelector('.ods-project-header__identity')
    var measure = function () {
      header.style.setProperty('--ods-project-identity-size', (identity ? identity.offsetHeight : 0) + 'px')
    }
    measure()
    if (identity && 'ResizeObserver' in window) new ResizeObserver(measure).observe(identity)
    else window.addEventListener('resize', measure)
    var collapsed = false
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset || 0
      if (!collapsed && y > COLLAPSE_Y) {
        collapsed = true
        sync(header, true)
      } else if (collapsed && y < EXPAND_Y) {
        collapsed = false
        sync(header, false)
        releaseScrollHold()
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    bindTabs(header)
  }

  function boot() {
    document.querySelectorAll('.ods-project-header').forEach(init)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
