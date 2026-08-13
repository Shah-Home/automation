// Hemma breakpoints
// ============================================================================
// Single source of truth for the JS-side responsive checks button-card
// templates use throughout the dashboard (window.matchMedia(...) calls used
// to be duplicated inline dozens of times across templates — see refactor
// plan §4.7 / §7 Phase 3). Each function here matches an EXACT query string
// already in use somewhere in the codebase; nothing here changes behavior,
// it only gives every template one shared place to call into.
//
// Call sites should use optional chaining with the original inline query as
// a fallback, in case this resource hasn't loaded yet on first paint:
//   window.hemmaMM?.isMobile?.() ?? window.matchMedia('(max-width: 767px), (max-height: 600px)').matches
// ============================================================================
(function () {
  'use strict';

  function mq(query) {
    return window.matchMedia ? window.matchMedia(query).matches : false;
  }

  window.hemmaMM = {
    // The dashboard's primary "small screen" check — used for sizing,
    // spacing, and layout decisions across nearly every template.
    isMobile: function () {
      return mq('(max-width: 767px), (max-height: 600px)');
    },

    // A handful of older call sites only ever checked width, without the
    // max-height companion clause above — preserved as its own function
    // rather than folded into isMobile() to avoid a behavior change.
    isMobileWidthOnly: function () {
      return mq('(max-width: 767px)');
    },

    // Portrait phone specifically (as opposed to mobile-landscape/short
    // viewports, which isMobile() also catches).
    isMobilePortrait: function () {
      return mq('(max-width: 767px) and (orientation: portrait)');
    },

    // Touch-input portrait phone — the (pointer:coarse || hover:none) +
    // 767px + portrait combination used for hero layout switching.
    isPhonePortraitTouch: function () {
      return (mq('(pointer: coarse)') || mq('(hover: none)')) &&
        mq('(max-width: 767px)') &&
        mq('(orientation: portrait)');
    },

    // Tablet band, gated on NOT mobile at call sites (e.g. weather widget
    // icon sizing: mobile / tablet / desktop tiers).
    isTablet: function () {
      return mq('(max-width: 1024px)');
    },

    prefersDark: function () {
      return mq('(prefers-color-scheme: dark)');
    }
  };
})();
