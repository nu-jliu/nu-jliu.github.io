/*
    Forty by HTML5 UP - Modified for Jekyll
*/

(function($) {

    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $banner = $('#banner');

    // Breakpoints
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });

    /**
     * Applies parallax scrolling to an element's background image
     */
    $.fn._parallax = function(intensity) {

        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0)
            return $this;

        if (this.length > 1) {
            for (var i=0; i < this.length; i++)
                $(this[i])._parallax(intensity);
            return $this;
        }

        if (!intensity)
            intensity = 0.25;

        $this.each(function() {

            var $t = $(this),
                on, off;

            on = function() {
                $t.css('background-position', 'center 0px');
                $window.on('scroll._parallax', function() {
                    var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);
                    $t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');
                });
            };

            off = function() {
                $t.css('background-position', '');
                $window.off('scroll._parallax');
            };

            skel.on('change', function() {
                if (skel.breakpoint('medium').active)
                    off();
                else
                    on();
            });

        });

        $window.off('load._parallax').on('load._parallax', function() {
            $window.trigger('scroll');
        });

        return $this;

    };

    // Page load
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-loading');
        }, 100);
    });

    // Fix: Placeholder polyfill
    $('form').placeholder();

    // Prioritize "important" elements on medium
    skel.on('+medium -medium', function() {
        $.prioritize(
            '.important\\28teleportation\\29',
            skel.breakpoint('medium').active
        );
    });

    // Scrolly
    $('.scrolly').scrolly({
        offset: function() {
            return $header.height() - 2;
        }
    });

    // Tiles
    var $tiles = $('.tiles > article');

    $tiles.each(function() {

        var $this = $(this),
            $image = $this.find('.image'),
            $img = $image.find('img'),
            $link = $this.find('.link');

        // Set background
        $this.css('background-image', 'url(' + $img.attr('src') + ')');

        // Set background position
        if ($image.data('position'))
            $this.css('background-position', $image.data('position'));

        // Clickable
        if ($link.length > 0) {
            $x = $link.clone()
                .text('')
                .addClass('primary');

            $this.append($x);
        }

    });

    // Header
    if ($banner.length > 0 && $header.hasClass('alt')) {

        $window.on('resize', function() {
            $window.trigger('scroll');
        });

        $window.on('load', function() {

            $banner.scrollex({
                bottom: $header.height() + 10,
                terminate: function() {
                    $header.removeClass('alt');
                },
                enter: function() {
                    $header.addClass('alt');
                },
                leave: function() {
                    $header.removeClass('alt');
                    $header.addClass('reveal');
                }
            });

            window.setTimeout(function() {
                $window.triggerHandler('scroll');
            }, 100);

        });

    }

    // Banner
    $banner._parallax(0.275);

    // Menu
    var $menu = $('#menu'),
        $menuInner;

    $menu.wrapInner('<div class="inner"></div>');
    $menuInner = $menu.children('.inner');
    $menu._locked = false;

    $menu._lock = function() {
        if ($menu._locked)
            return false;

        $menu._locked = true;

        window.setTimeout(function() {
            $menu._locked = false;
        }, 350);

        return true;
    };

    $menu._show = function() {
        if ($menu._lock())
            $body.addClass('is-menu-visible');
    };

    $menu._hide = function() {
        if ($menu._lock())
            $body.removeClass('is-menu-visible');
    };

    $menu._toggle = function() {
        if ($menu._lock())
            $body.toggleClass('is-menu-visible');
    };

    $menuInner
        .on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', 'a', function(event) {
            var href = $(this).attr('href');
            event.preventDefault();
            event.stopPropagation();

            // Hide menu
            $menu._hide();

            // Redirect
            window.setTimeout(function() {
                window.location.href = href;
            }, 250);
        });

    $menu
        .appendTo($body)
        .on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            $body.removeClass('is-menu-visible');
        })
        .append('<a class="close" href="#menu">Close</a>');

    $body
        .on('click', 'a[href="#menu"]', function(event) {
            event.stopPropagation();
            event.preventDefault();
            $menu._toggle();
        })
        .on('click', function(event) {
            $menu._hide();
        })
        .on('keydown', function(event) {
            if (event.keyCode == 27)
                $menu._hide();
        });

})(jQuery);
