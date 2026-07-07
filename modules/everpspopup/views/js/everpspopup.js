/**
 * 2019-2023 Team Ever
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 *  @author    Team Ever <https://www.team-ever.com/>
 *  @copyright 2019-2023 Team Ever
 *  @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

(function ($) {
    'use strict';

    function hideGucciPageLoader() {
        var loader = document.getElementById('gucci-page-loader');
        if (loader) {
            loader.classList.add('is-hidden');
        }
        document.documentElement.classList.remove('gucci-is-loading');
        if (document.body) {
            document.body.classList.remove('gucci-is-loading');
        }
    }

    window.hideGucciEverpopupPageLoader = hideGucciPageLoader;

 $(document).ready(function(){
    if (window.__gucciEverpopupBound) {
        return;
    }
    window.__gucciEverpopupBound = true;

    // Rimuove handler obsoleti dal bundle CCC (vecchio Fancybox)
    $(document).off('submit', '#ever_subscription_form');
    $(document).off('click', '.gucci-everpopup__close');
    $(document).off('click', '#gucci-everpopup-overlay');
    $(document).off('keydown.gucciEverpopup');

    var cookie_time = $('#everpspopup_block_center').data('expire')?$('#everpspopup_block_center').data('expire'):0; //set cookie on 1day1hour1minute if not set in config
    var adult_mode = $('#everpspopup_block_center').data('adult');
    var delay = parseInt($('#everpspopup_block_center').data('delay'));
    var cookie_suffix = $('#everpspopup_block_center').data('cookiesuffix');

    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // CommonJS
            factory(require('jquery'));
        } else {
            // Browser globals
            factory(jQuery);
        }
    }(function ($) {

        var pluses = /\+/g;

        function encode(s) {
            return config.raw ? s : encodeURIComponent(s);
        }

        function decode(s) {
            return config.raw ? s : decodeURIComponent(s);
        }

        function stringifyCookieValue(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        }

        function parseCookieValue(s) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                s = decodeURIComponent(s.replace(pluses, ' '));
                return config.json ? JSON.parse(s) : s;
            } catch(e) {}
        }

        function read(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return $.isFunction(converter) ? converter(value) : value;
        }

        var config = $.cookie = function (key, value, options) {

            // Write

            if (value !== undefined && !$.isFunction(value)) {
                options = $.extend({}, config.defaults, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setTime(+t + days * 864e+5);
                }

                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path    ? '; path=' + options.path : '',
                    options.domain  ? '; domain=' + options.domain : '',
                    options.secure  ? '; secure' : ''
                ].join(''));
            }

            // Read

            var result = key ? undefined : {};

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
            var cookies = document.cookie ? document.cookie.split('; ') : [];

            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                var name = decode(parts.shift());
                var cookie = parts.join('=');

                if (key && key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        };

        config.defaults = {};

        $.removeCookie = function (key, options) {
            if ($.cookie(key) === undefined) {
                return false;
            }

            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return !$.cookie(key);
        };

    }));

    if (cookie_time == 0) {
        var popcontent = 0;
    } else {
        var popcontent = 1;
    }

    var gucciPopupStrict = false;

    function isGucciCheckoutOrCartPage() {
        var bodyId = document.body && document.body.id;
        return bodyId === 'cart' || bodyId === 'checkout';
    }

    // Pulizia eventuale Fancybox residuo (non usato più per questo popup)
    $('.fancybox-container').remove();
    $('html, body').removeClass('fancybox-active compensate-for-scrollbar');

    function markPopupAsSeen() {
        $.cookie('everpspopup' + cookie_suffix, popcontent, { expires: cookie_time });
    }

    function openGucciPopup(strict) {
        gucciPopupStrict = !!strict;
        var $overlay = $('#gucci-everpopup-overlay');
        $overlay.removeAttr('hidden').attr('aria-hidden', 'false').addClass('is-open').css('display', 'flex');
        $('body').addClass('gucci-everpopup-open');
    }

    function closeGucciPopupSafely(force) {
        if (gucciPopupStrict && !force) {
            return;
        }
        markPopupAsSeen();
        gucciPopupStrict = false;
        var overlay = document.getElementById('gucci-everpopup-overlay');
        if (overlay) {
            overlay.setAttribute('hidden', '');
            overlay.setAttribute('aria-hidden', 'true');
            overlay.classList.remove('is-open');
            overlay.style.display = 'none';
        }
        $('body').removeClass('gucci-everpopup-open');
        resetSubscribeForm();
        hideGucciPageLoader();
    }

    function resetSubscribeForm() {
        var $form = $('#ever_subscription_form');
        if (!$form.length) {
            return;
        }
        $form.find('#everpspopupEmail, .gucci-everpopup__gdpr, .gucci-everpopup__submit').show();
        $form.find('.gucci-everpopup__submit').prop('disabled', false);
        $('#everpspopup_success_msg').hide().text('');
        $('#everpspopupEmail').val('');
        $('#everpspopupGdpr').prop('checked', false);
    }

    function handleSubscribeSuccess(message) {
        markPopupAsSeen();
        hideGucciPageLoader();
        var $form = $('#ever_subscription_form');
        $form.find('.gucci-everpopup__submit').hide();
        $('#everpspopup_success_msg').text(message).show();
        setTimeout(function() {
            closeGucciPopupSafely(true);
        }, 1600);
    }

    function hidePopupFeedback() {
        $('#everpspopup_confirm, #everpspopup_error').stop(true, true).hide().empty();
    }

    function showPopupFeedback(type, message) {
        var $ok = $('#everpspopup_confirm');
        var $err = $('#everpspopup_error');
        if (type === 'ok') {
            $err.hide();
            $ok.stop(true, true).html(message).slideDown();
            return;
        }
        $ok.hide();
        $err.stop(true, true).html(message).slideDown();
    }

    function parsePopupAjaxResponse(data, xhr) {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                return null;
            }
        }
        if (data && typeof data === 'object') {
            return data;
        }
        if (xhr && xhr.responseText) {
            try {
                return JSON.parse(xhr.responseText);
            } catch (e2) {
                return null;
            }
        }
        return null;
    }

    if ($('#everpspopup_block_center').length && $('#everpspopup_block_center').data('carrier')) {
        var id_carrier = $('#everpspopup_block_center').data('carrier');
        if (!isGucciCheckoutOrCartPage() && $('input[value="'+id_carrier+',"], input[value="'+id_carrier+'"]').is(':checked')) {
            openGucciPopup(false);
        }
        $(document).on('click', 'input[value="'+id_carrier+',"], input[value="'+id_carrier+'"]', function() {
            if (!isGucciCheckoutOrCartPage()) {
                openGucciPopup(false);
            }
        });
    }

    $(document).on('click', '.gucci-everpopup__close', function() {
        closeGucciPopupSafely(true);
    });

    $(document).on('click', '#gucci-everpopup-overlay', function(e) {
        if (e.target === this) {
            closeGucciPopupSafely(true);
        }
    });

    $(document).on('keydown.gucciEverpopup', function(e) {
        if (e.key === 'Escape' && $('#gucci-everpopup-overlay').hasClass('is-open')) {
            closeGucciPopupSafely(false);
        }
    });

    $(document).on('change', '#everpspopupGdpr', function() {
        if (!$(this).prop('checked')) {
            return;
        }
        var gdprMsg = ($('#ever_subscription_form').data('msg-gdpr') || '').trim();
        var $err = $('#everpspopup_error');
        if ($err.is(':visible') && $err.text().trim() === gdprMsg) {
            hidePopupFeedback();
        }
    });

    $(document).on('input', '#everpspopupEmail', function() {
        var emailMsg = ($('#ever_subscription_form').data('msg-email') || '').trim();
        var $err = $('#everpspopup_error');
        if ($err.is(':visible') && $err.text().trim() === emailMsg) {
            hidePopupFeedback();
        }
    });

    var processAdultModeSubmit = null;

    if ($('#everpspopup_block_center').length >= 1) {
        if (isGucciCheckoutOrCartPage()) {
            $('#gucci-everpopup-overlay').remove();
            hideGucciPageLoader();
        } else {
        setTimeout(function() {
            if ($.cookie('everpspopup' + cookie_suffix) != popcontent) {
                openGucciPopup(!!adult_mode);
            }
        }, delay);
        $(window).on('beforeunload.everpspopup', function() {
            if ($('#gucci-everpopup-overlay').hasClass('is-open') && !gucciPopupStrict) {
                markPopupAsSeen();
            }
        });
        if (adult_mode) {
            processAdultModeSubmit = function() {
                hideGucciPageLoader();
                $.ajax({
                    type: 'POST',
                    url: $('#everpspopup_new_adult_url').val(),
                    cache: false,
                    dataType: 'json',
                    data: {
                        action: 'CheckAge',
                        ajax: true,
                        ever_birthday: $('#ever_birthday').val()
                    },
                    success: function(data, textStatus, xhr) {
                        data = parsePopupAjaxResponse(data, xhr);
                        if (data && data.return) {
                            $.cookie('everpspopup' + cookie_suffix, popcontent, { expires: cookie_time});
                            showPopupFeedback('ok', data.message);
                            setTimeout(function() { location.reload(); }, 2000);
                        } else {
                            showPopupFeedback('error', (data && data.error) ? data.error : 'Error');
                        }
                    },
                    error: function() {
                        showPopupFeedback('error', 'Error');
                    }
                });
            };
        }
        }
    }

    function processEverSubscriptionSubmit() {
        hideGucciPageLoader();
        var $form = $('#ever_subscription_form');
        var email = $.trim($('#everpspopupEmail').val() || '');
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
            showPopupFeedback('error', $form.data('msg-email') || 'Please enter a valid email address');
            return;
        }
        if (!$('#everpspopupGdpr').prop('checked')) {
            showPopupFeedback('error', $form.data('msg-gdpr') || 'GDPR consent.');
            return;
        }
        var $submit = $form.find('.gucci-everpopup__submit');
        $submit.prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: $('#everpspopup_new_subscribe_url').val(),
            cache: false,
            dataType: 'json',
            timeout: 20000,
            data: {
                action: 'NewSubscribe',
                ajax: true,
                everpspopupEmail: email,
                everpspopupGdpr: 1
            },
            success: function(data, textStatus, xhr) {
                data = parsePopupAjaxResponse(data, xhr);
                if (!data) {
                    showPopupFeedback('error', $form.data('msg-network') || 'Connection failed. Please try again.');
                    $submit.prop('disabled', false);
                    return;
                }
                if (data.return) {
                    handleSubscribeSuccess(data.message);
                } else {
                    showPopupFeedback('error', data.error || $form.data('msg-network'));
                    $submit.prop('disabled', false);
                }
            },
            error: function(jqXHR) {
                hideGucciPageLoader();
                var data = parsePopupAjaxResponse(null, jqXHR);
                showPopupFeedback('error', (data && data.error) ? data.error : ($form.data('msg-network') || 'Connection failed. Please try again.'));
                $submit.prop('disabled', false);
            },
            complete: function() {
                hideGucciPageLoader();
            }
        });
    }

    // Capture: blocca submit nativo + page loader del tema, esegue AJAX inline
    document.addEventListener('submit', function(e) {
        var form = e.target;
        if (!form || !form.id) {
            return;
        }
        if (form.id === 'ever_subscription_form') {
            e.preventDefault();
            e.stopImmediatePropagation();
            processEverSubscriptionSubmit();
            return;
        }
        if (form.id === 'adult_mode_form' && processAdultModeSubmit) {
            e.preventDefault();
            e.stopImmediatePropagation();
            processAdultModeSubmit();
        }
    }, true);
});
})(jQuery);