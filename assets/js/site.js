(function () {
  'use strict';

  // mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // property map: a pin or legend button shows that spot's placard
  var chart = document.querySelector('[data-chart]');
  if (chart) {
    var zones = chart.querySelectorAll('.zone');
    var buttons = chart.querySelectorAll('.legend button');
    var cards = chart.querySelectorAll('.placard');
    var select = function (id) {
      zones.forEach(function (z) { z.classList.toggle('is-active', z.dataset.zone === id); });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.zone === id ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = c.dataset.zone !== id; });
    };
    zones.forEach(function (z) {
      z.addEventListener('click', function () { select(z.dataset.zone); });
      z.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(z.dataset.zone); }
      });
    });
    buttons.forEach(function (b) { b.addEventListener('click', function () { select(b.dataset.zone); }); });
    select(chart.dataset.chart || 'sheds');
  }

  // inquiry forms
  document.querySelectorAll('form[data-inquiry]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var button = form.querySelector('button[type="submit"]');
    var say = function (msg, isError) {
      status.textContent = msg;
      status.classList.toggle('is-error', !!isError);
      status.hidden = false;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fallback = form.dataset.email;
      if (form.querySelector('.hp').value) { say(form.dataset.thanks); return; }   // bots get a quiet success
      if (!form.getAttribute('action')) {
        say('This form is not switched on yet. Email ' + fallback + ' and we will get right back to you.', true);
        return;
      }
      var label = button.textContent;
      button.disabled = true; button.textContent = 'Sending';
      fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (res) {
          if (!res.ok) { throw new Error('bad response'); }
          form.reset(); say(form.dataset.thanks);
        })
        .catch(function () {
          say('That did not send. Please try again, or email ' + fallback + '.', true);
        })
        .then(function () { button.disabled = false; button.textContent = label; });
    });
  });
})();
