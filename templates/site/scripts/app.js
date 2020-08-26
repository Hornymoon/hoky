//
// App scripts
// --------------------------------------------------

// Accordion toggle
// -------------------------

function accordionToggle() {
    $('.js-accordion-toggle').on('click', function() {
        $(this).toggleClass('active').next('.accordion-inner').slideToggle();
    });
}


// Header dropdowns toggle
// -------------------------

function animateDropdownClose(element) {
    if (element.parent().hasClass('active')) {
        element.parent().addClass('closing');
        
        setTimeout(function() {
            element.parent().removeClass('closing');

            element
                .removeClass('active')
                .parent().removeClass('active');
        }, 200);
    } else {
        element.parent().siblings('.active').addClass('closing');

        setTimeout( function() {
            element
                .parent().siblings().removeClass('closing').removeClass('active')
                .find('> .active').removeClass('active');
        }, 200)
    }
}

function headerDropdownsToggle(selector) {
    selector.off('click').on('click', function() {
        animateDropdownClose($(this));

        $(this)
            .addClass('active')
            .parent().addClass('active')
            .siblings().removeClass('active')
            .find('> .active').removeClass('active');
    });

    $('.site-header-nav.primary').off('click').on('click', function() {
        animateDropdownClose($('.site-header-nav.secondary .dropdown-container.active, .site-header-nav.secondary .dropdown-container.active .btn-toggle.active'));
    });

    $('.site-header-nav.secondary').off('click').on('click', function() {
        animateDropdownClose($('.site-header-nav.primary .active'));
    });
}

function mainNavDropdowns() {
    if ($(window).width() >= 992) {
        headerDropdownsToggle($('.site-header-nav.primary .dropdown-container > a'));
        $('.site-header-nav.primary .submenu-title').off('click');
        
        $('.site-header-nav .active').removeClass('active');
        $('.site-header-nav .dropdown-menu, .site-header-nav .dropdown-submenu').css('display', '');
    } else {
        $('.site-header-nav.primary .dropdown-container > a').off('click').on('click', function() {
            $(this)
                .toggleClass('active')
                .parent().toggleClass('active')
                .siblings().removeClass('active')
                .find('> .active').removeClass('active')
                .next('.dropdown-menu').slideUp(200);

            $(this)
                .next('.dropdown').slideToggle(200);
        });

        $('.site-header-nav.primary .dropdown-parent .submenu-title').off('click').on('click', function(e) {
            e.preventDefault();

            $(this)
                .next('.dropdown-submenu').slideToggle(200)
                .parent().siblings().find('.dropdown-submenu').slideUp(200);
            
            $(this)
                .parents().eq(2).siblings().find('.dropdown-submenu .dropdown-submenu').slideUp(200);
        })
    }
}



// Site main nav
// -------------------------

function appendOverlay() {
    if (!$('.nav-overlay').length) {
        var overlay = '<div class="nav-overlay"></div>';
        $('body').append(overlay);
    }
}

function closeMainNav(nav) {
    if (nav.hasClass('active')) {
        $('body').removeClass('overlay-active nav-active');
        nav.addClass('closing');
        $('.nav-overlay').fadeOut(200);
        $('.btn-nav-toggle').removeClass('active').parent().removeClass('active');

        setTimeout(function() {
            $('.nav-overlay').remove();

            nav.removeClass('active').removeClass('closing');
        }, 200);
    }
}

function openMainNav(nav) {
    if (!nav.hasClass('active')) {
        appendOverlay();
        $('.nav-overlay').fadeIn(200);

        nav.addClass('opening');

        setTimeout(function() {
            $('body').addClass('overlay-active nav-active');
            nav.addClass('active').removeClass('opening');
        }, 200);
    }
}

function mainNavToggle() {
    if ($(window).width() < 992) {
        $('.btn-nav-toggle').on('click', function() {
            var siteNav = $('.site-header-nav.primary');

            $(this)
                .addClass('active')
                .parent().addClass('active')
                .siblings().removeClass('active')
                .find('> .active').removeClass('active')
                .next('.dropdown-menu').slideUp(200);

            openMainNav(siteNav);
            closeMainNav(siteNav);
        });
    } else {
        $('.btn-nav-toggle').off('click');
        $('.site-header-nav.primary').css('display', '');
        $('.nav-overlay').remove();
        $('body').removeClass('nav-active');
        $('.site-header-nav.primary').removeClass('active')
    }
}



// Hotels map custom scrollbar
// -------------------------

function hotelCustomScrollbar() {
    if ($(window).width() > 660) {
        var mapHotelHeaderHeight = ($('.map-hotel-header').length ? $('.map-hotel-header').outerHeight() : 0),
            mapHotelImageHeight = ($('.section-map .hotel-image').length ? $('.section-map .hotel-image').outerHeight() : 0),
            // mapRemainingSpace = $('.section-map').outerHeight() - $('.section-map-title').outerHeight() - $('.section-map-hotel-details').outerHeight(),
            hotelInfoContentMaxHeight = $('.section-map').outerHeight() - $('.section-map-title').outerHeight() - mapHotelHeaderHeight - mapHotelImageHeight;

        $('.map-hotel-info-content').css('height', hotelInfoContentMaxHeight);

        $('.map-hotel-info-content').mCustomScrollbar({
            theme: 'fpi'
        });
    } else {
        if ($('.map-hotel-info-content').length === 1) {
            $('.map-hotel-info-content').mCustomScrollbar('destroy');
        }
    }
}



// Hotels map custom scrollbar
// -------------------------

function reservationsFormCustomScrollbar() {
    if ($(window).width() >= 768) {
        $('.reservations-box-content .room-row').each(function(index) {
            if (index >= 2) {
                $(this).css('opacity', .35);
            }
        });

        $('.reservations-custom-scrollbar').mCustomScrollbar({
            callbacks:{
                onInit: function() {
                    $('.reservations-custom-scrollbar .scroll-icon').prependTo('.reservations-custom-scrollbar');
                },
                onScrollStart: function() {
                    $('.reservations-box-content .room-row').each(function(index) {
                        if (index >= 2) {
                            $(this).css('opacity', '');
                        }
                    });
                },
                onTotalScroll: function() {
                    $('.reservations-custom-scrollbar').addClass('scrolled-max');
                },
                onTotalScrollOffset: 50
            }
        });
    } else {
        if ($('.reservations-custom-scrollbar').length === 1) {
            $('.reservations-custom-scrollbar').mCustomScrollbar('destroy');
        }
    }
}



// Sidebar nav
// -------------------------

function closeSidebarNav(element) {
    if (element.hasClass('active')) {
        $('body').removeClass('sidebar-nav-active');
        $('.nav-overlay').fadeOut(200);
        element.slideUp(200);

        setTimeout(function() {
            $('.nav-overlay').remove();

            element.removeClass('active').parent().removeClass('active');
        }, 200);
    }
}

function openSidebarNav(element) {
    if (!element.hasClass('active')) {
        appendOverlay();
        element.slideDown(200);
        $('.nav-overlay').fadeIn(200);

        setTimeout(function() {
            $('body').addClass('sidebar-nav-active');
            element.addClass('active');
        }, 200);
    }
}

function sidebarNavMobileToggle() {
    $('.btn-sidebar-nav-toggle').on('click', function(e) {
        e.preventDefault();

        var sidebarNav = $('.sidebar-nav-mobile');
        $(this).toggleClass('active').parent().addClass('active');

        openSidebarNav(sidebarNav);
        closeSidebarNav(sidebarNav);

        $('body').off('click').on('click', function(e) {
            var target = $(e.target);

            if ( !target.closest('.sidebar-nav-mobile, .btn-sidebar-nav-toggle').length ) {
                closeSidebarNav(sidebarNav);

                $('.btn-sidebar-nav-toggle').removeClass('active');
            }
        });
    });
}

function sidebarNavMobilePosition() {
    var sidebarNavClone = $('.sidebar-nav').clone(true);

    if ($(window).width() < 768) {
        if (!$('.sidebar-nav-mobile-container .sidebar-nav').length) {
            $('.sidebar-nav').remove();
            $('.sidebar-nav-mobile-container').append('<div class="sidebar-nav-mobile"></div>');
            $('.sidebar-nav-mobile').append(sidebarNavClone);
        }
    } else {
        $('.sidebar-nav-mobile-container').removeClass('active').find('.active').removeClass('active');
        $('body').removeClass('sidebar-nav-active');
        // $('.nav-overlay').remove();

        if ($('.sidebar-nav-mobile-container .sidebar-nav').length) {

            $('.sidebar-nav-mobile-container .sidebar-nav-mobile').remove();
            $('.page-sidebar').prepend(sidebarNavClone);
        }
    }
}



// Filters toggle
// -------------------------

/*function filtersToggle() {
    if ($(window).width() < 768) {
        $('body').on('click', '.btn-toggle-filters', function() {
            $(this).toggleClass('active');
            appendOverlay();

            $('body').toggleClass('overlay-active');
            $('.nav-overlay').fadeToggle(200);
            $('.search-filters-form').toggleClass('active').slideToggle();
        });
    } else {
        $('.search-filters-form').css('display', '');
        $('.btn-toggle-filters, .search-filters-form').removeClass('active');
    }
}*/



// Office contacts scrollbar
// -------------------------

function contactsScrollbar() {
        $('.office-map-overflow').mCustomScrollbar({
            updateOnContentResize: true
        });
}


$(window).on('resize', function() {
    mainNavDropdowns();
    mainNavToggle();
    
    reservationsFormCustomScrollbar();
    sidebarNavMobilePosition();
    
    //filtersToggle();
    hotelCustomScrollbar();
    
});



$(document).ready(function() {
    svg4everybody();

    accordionToggle();

    headerDropdownsToggle($('.site-header-nav.secondary .dropdown-container > .btn-toggle'));
    mainNavDropdowns();
    mainNavToggle();
    sidebarNavMobileToggle();

    reservationsFormCustomScrollbar();
    sidebarNavMobilePosition();

    filtersToggle();
    contactsScrollbar();
    hotelCustomScrollbar();
    eventsCalendar();


    // Close navs on click outside of them
    // -------------------------
    
    $('body').on('click', function(e) {
        var target = $(e.target);
        var siteNav = $('.site-header-nav.primary');

        if ( !target.closest('.dropdown-container, .site-header-nav').length ) {
            animateDropdownClose($('.site-header .active:not(.btn-nav-toggle)'));
            closeMainNav(siteNav);
        }
    });



    // Smooth scrolling
    // -------------------------

    $('a.smooth-scroll[href*=\\#]:not([href=\\#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });



    // Reservations box tabs
    // -------------------------

    $('.reservations-box--tabs a').on('click', function(e) {
        e.preventDefault()

        $(this).tab('show');
    })



    // Form inputs
    // -------------------------

    /*$('.material-input input, .material-input textarea, .material-input select')
        .on('focus', function() {
            $(this).addClass('focused');
        })
        .on('blur', function() {
            if ( !$(this).val() ) {
                $(this).removeClass('focused');
            }
        });

    $('.material-input input, .material-input textarea').each(function() {
        if ($(this).val()) {
            $(this).addClass('focused');
        }
    });*/



    // Multiselect inputs
    // -------------------------

    /*$('.input-multiselect .form-control').select2();

    $('.input-multiselect .form-control').on('select2:open', function() {
            $(this).addClass('focused');
            $(this).parent().find('.select2-search__field').attr('readonly', 'readonly');
    }).on('select2:close', function() {
            if ($(this).val().length) {
                $(this).addClass('focused');
            } else {
                $(this).removeClass('focused');
            }
    })*/



    // Datepickers
    // -------------------------

    $('.datepicker .form-control').datepicker({
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        onSelect: function() {
            $(this).addClass('focused');
        }
    });

    $('.timepicker .form-control').timepicker({
        timeFormat: 'H:i',
        step: 15,
        scrollDefault: 'now'
    });



    // Home slider
    // -------------------------

    var pageHeaderSliderSpeed            = 4000,
        pageHeaderSliderAnimationSpeed   = 500,
        pageHeaderSliderProgressBarSpeed = pageHeaderSliderSpeed - pageHeaderSliderAnimationSpeed;

    $('.page-header-slider').flexslider({
        pauseOnHover: false,
        controlNav: true,
        directionNav: false,
        slideshowSpeed: pageHeaderSliderSpeed,
        animationSpeed: 500,
        animation: 'fade',
        controlsContainer: '.page-header-control-nav',
        start: function(slider) {
            $(slider).find('.slides > li').css({
                'z-index': ''
            })

            var slides = slider.slides,
                index      = slider.animatingTo,
                $slide     = $(slides[index]),
                current    = index,
                nextSlide  = current + 1,
                prevSlide  = current - 1;

            $(slider).find('.lazy:eq(' + current + '), .lazy:eq(' + prevSlide + '), .lazy:eq(' + nextSlide + ')').each(function() {
                var src = $(this).data('image');

                $(this).css('background-image', 'url("' + src + '")').removeAttr('data-image');
            });

            $('.page-slider-progress-inner').addClass('animate').attr('style', 'animation-duration: ' + pageHeaderSliderProgressBarSpeed + 'ms');

            if ($(slider).find('.slides > li').length === 1) {
                $('.flex-direction-nav').remove();
            } else {
                $('.flex-direction-nav').css('opacity', 1);
            }
        },
        before: function(slider) {
            var slides = slider.slides,
            index      = slider.animatingTo,
            $slide     = $(slides[index]),
            current    = index,
            nextSlide  = current + 1,
            prevSlide  = current - 1;

            $(slider).find('.lazy:eq(' + current + '), .lazy:eq(' + prevSlide + '), .lazy:eq(' + nextSlide + ')')
                .each(function() {
                    var src = $(this).data('image');

                    $(this).css('background-image', 'url("' + src + '")').removeAttr('data-image');
            });

            var progressBar = $('.page-slider-progress-inner');
            progressBar.replaceWith(progressBar.clone(true));
        },
        after: function(slider) {
            $(slider).find('.slides > li').css({
                'z-index': ''
            })
        }
    });

    $('.page-header-slider').on('mouseenter', function() {
        $('.page-slider-progress-inner').addClass('paused');
        $('.page-header-slider').flexslider('pause');
    });

    $('.page-header-slider, .reservations-box-container').on('mouseleave', function() {
        $('.page-slider-progress-inner').removeClass('paused')
        $('.page-header-slider').flexslider('play');
    });

    $('.flex-prev, .flex-next').on('click', function(e) {
        e.preventDefault();

        var direction = $(this).data('direction');

        $('.page-header-slider').flexslider(direction);

        return false;
    });



    // Article gallery slider
    // -------------------------

    $('.article-gallery-carousel').flexslider({
        animation: 'slide',
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 96,
        itemMargin: 10,
        asNavFor: '.article-gallery-slider'
    });

    $('.article-gallery-slider').flexslider({
        // smoothHeight: true,
        pauseOnHover: false,
        controlNav: true,
        directionNav: false,
        slideshow: false,
        animationSpeed: 500,
        animation: 'fade',
        sync: '.article-gallery-carousel'
    });



    // Hotels map interact on click
    // -------------------------

    $('.map-overlay').on('click', function() {
        $(this).addClass('active');
    });

    $('body').on('click', function(e) {
        var target = $(e.target);

        if ( !target.closest('.map-overlay').length ) {
            $('.map-overlay').removeClass('active');
        }
    });



    // Show room guests distribution form
    // -------------------------

  /*  $('.reservations-form-guests-toggle').on('click', function() {
        if ($(this).hasClass('active')) {
            $('.guests-form-fields').slideDown(200);
            $('.hotel-reservation-form').slideUp(200);

            $('.reservations-form-title').addClass('active');
        }
    });*/

  /*  $('.reservations-form-title .edit-fields').on('click', function() {
        $(this).parent().removeClass('active');
        $('.hotel-reservation-form').slideDown(200);
        $('.guests-form-fields').slideUp(200);
    });*/



    // Hidden reservation form
    // -------------------------

    $('.btn-reservations-form-toggle').on('click', function(e) {
        e.preventDefault();

        if (!$(this).parent().hasClass('active')) {
            $(this).parent().addClass('active');
            $("#reservationsForm .form-control").each(function(){
            	if($(this).val()) {
            		$(this).addClass('focused');
            	}
            })
        } else {
            var element = $(this);
            
            $(this).parent().removeClass('active').addClass('closing');

            setTimeout(function() {
                element.parent().removeClass('closing');
            }, 200);
        }
    });

    $('body').on('click', function(e) {
        var target = $(e.target);

        if ( !target.closest('.reservations-box-hidden-container, .ui-datepicker, .ui-datepicker-prev, .ui-datepicker-next').length ) {
            if ($('.reservations-box-hidden-container.active').length) {
                var element = $('.reservations-box-hidden-container');

                element.removeClass('active').addClass('closing');

                setTimeout(function() {
                    element.removeClass('closing');
                }, 200);
            }
        }

        if (!target.closest('.search-filters-toggle-group').length) {
            if ($('.search-filters-form.active').length && !target.hasClass('select2-selection__choice__remove')) {
                $('.nav-overlay').fadeOut(200);
                $('.search-filters-form').slideUp();
                $('.btn-toggle-filters, .search-filters-form').removeClass('active');
                $('body').removeClass('overlay-active');
            }
        }
    });



    // Sidebar dropdowns
    // -------------------------

    $('.sidebar-nav-section .dropdown-container > a').on('click', function(e) {
        e.preventDefault();

        $(this)
            .next().slideToggle(200)
            .parent().toggleClass('active')
            .siblings('.dropdown-container').removeClass('active')
            .find('.sidebar-dropdown').slideUp()
            .parent().removeClass('active');

        $(this)
            .parents('.sidebar-nav-section').siblings()
            .find('.sidebar-dropdown').slideUp(200)
            .parent().removeClass('active');

        if ($(this).next().find('> li').length === 1) {
            $(this).next().find('> li > a')[0].click();
        }
    });



    // jQeury ui range slider
    // -------------------------

    /*$('#slider-range').slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300],
        slide: function(event, ui) {
            $('#price-from').val(ui.values[0]);
            $('#price-to').val(ui.values[1]);
        }
    });

    $('#price-from').val($('#slider-range').slider('values', 0));
    $('#price-to').val($('#slider-range').slider('values', 1));*/



    // Service item dropdown
    // -------------------------

    $('.btn-details-toggle').on('click', function(e) {
        e.preventDefault();

        var toggleId = $(this).data('toggle-id'),
            toggleTarget = $(this).parents('.service-item').find('.item-dropdown-details[data-toggle-id="' + toggleId + '"]');

        $(this).toggleClass('active').parent().siblings().find('.active').removeClass('active');
        toggleTarget.slideToggle().siblings('.item-dropdown-details').slideUp();
    });



    // Cart step change
    // -------------------------

    /*$('.btn-next-step').on('click', function() {
        var clicked = $(this);

        $(this).parents('.cart-step-content').slideUp().parents('.cart-step').addClass('completed').removeClass('active current').next().addClass('active current').find('.cart-step-content').slideDown();

        setTimeout(function() {
            $('html, body').animate({
                scrollTop: clicked.parents('.cart-step').next().offset().top
            }, 500);
        }, 400)
    });

    $('.cart-step .section-title, .cart-step .cart-step-indicator').on('click', function() {
        if ($(this).parents('.cart-step').hasClass('completed') || $(this).parents('.cart-step').hasClass('current')) {
            $(this).parents('.cart-step').addClass('active').find('.cart-step-content').slideDown();
            $(this).parents('.cart-step').siblings('.active').removeClass('active').addClass('current').find('.cart-step-content').slideUp();
        }
    });*/



    // Voucher gift users
    // -------------------------

    /*$('.product-gift-group .checkbox-group .form-control').on('change', function() {
        $(this).parents('.product-gift-group').find('.product-gift-users').slideToggle();
    });*/



    // Options table
    // -------------------------

    $('table input:checked').parents('tr').toggleClass('active');

    $('table input[type="radio"]').on('change', function() {
        $(this).parents('tr').toggleClass('active').siblings().removeClass('active');
    });

    $('table input[type="checkbox"]').on('change', function() {
        $(this).parents('tr').toggleClass('active');
    });



    // Cart identification step toggles
    // -------------------------

    /*$('.cart-step-identification .subsection-title').on('click', function() {
        if (!$(this).parents('.cart-step-identification').hasClass('active')) {
            $(this).parents('.cart-step-identification').addClass('active').find('.cart-step-identification-inner').slideDown();
            $(this).parents('.cart-step-identification').siblings('.active').removeClass('active').find('.cart-step-identification-inner').slideUp();
        }
    });*/



    // Forgotten password form toggle
    // -------------------------

    /*$('.forgotten-password').on('click', function(e) {
        e.preventDefault();

        $(this).parent().next('.forgotten-password-group').slideToggle();
    });*/



    // Registration group toggle
    // -------------------------

    /*$('#register-checkbox').on('change', function() {
        $('.registration-group').slideToggle();
    });*/



    // Invoice group toggle
    // -------------------------

    /*$('#pm-invoice').on('change', function() {
        $('.invoice-group').slideToggle();
    });*/



    // Gallery
    // -------------------------

    /*$('.gallery-trigger').on('click', function(e) {
        e.preventDefault();

        $('.gallery-container').fadeIn(200).css('top', $(window).scrollTop());
    });
*/
/*    $('.btn-close-gallery').on('click', function(e) {
        $('.gallery-container').fadeOut(200);
    });

    $('.gallery-thumbs').flexslider({
        controlNav: false,
        directionNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 100,
        itemMargin: 0,
        asNavFor: '.gallery-slider',
        start: function(slider) {
            slider.find('li').css({
                'margin-right': '',
                'width': '',
                'opacity': '',
                'z-index': ''
            })
        }
    });

    $('.gallery-slider').flexslider({
        animation: 'fade',
        controlNav: false,
        directionNav: false,
        animationLoop: false,
        animationSpeed: 500,
        slideshow: false,
        sync: '.gallery-thumbs'
    });

    $('.btn-gallery-prev, .btn-gallery-next').on('click', function(e) {
        e.preventDefault();

        var direction = $(this).data('direction');

        $('.gallery-slider').flexslider(direction);

        return false;
    });
*/


    // Awards grid
    // -------------------------
    if ($.fn.masonry) {
    $('.awards-list').masonry({
        itemSelector: '.awards-list > li'
    });
    }



    // Article show more button
    // -------------------------

    if ($('.height-control').outerHeight() > 300) {
        $('.height-control').addClass('height-limited');
    }

    $('.btn-show-full-article').on('click', function() {
        var thisElement = $(this);

        $(this).parent().css('max-height', '').animate({
            'max-height': $(this).parent()[0].scrollHeight
        }, 300);

        $(this).slideUp();

        setTimeout(function() {
            thisElement.parent().removeClass('height-limited');
        }, 300);
    });
});

$(document).on('keyup', function(e) {
    if (e.keyCode == 27 && $('.gallery-container').is(':visible')) {
        $('.btn-close-gallery').trigger('click');
    }
});



//home real estate notification
//-------------------------

$(window).on('load', function() {
    $('.realestate-home-notification').addClass('active');

    setTimeout(function() {
        $('.realestate-home-notification').removeClass('active');

        setTimeout(function() {
            $('.btn-home-realestate').addClass('active');
        }, 500);
    }, 5000);
});

$(window).on('scroll', function() {
    if ($(window).scrollTop() > $(window).height() / 2) {
        $('.btn-home-realestate span').slideUp(200);
    } else {
        $('.btn-home-realestate span').slideDown(200);
    }
});

$(function() {
    $('.realestate-home-notification .btn-hide').on('click', function() {
        $(this).parent().removeClass('active');

        setTimeout(function() {
            $('.btn-home-realestate').addClass('active');
        }, 500);
    });
});

