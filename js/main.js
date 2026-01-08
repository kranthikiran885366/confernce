jQuery(document).ready(function( $ ) {

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Header fixed on scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Real view height for mobile devices
  if (window.matchMedia("(max-width: 767px)").matches) {
    $('#home').css({ height: $(window).height() });
  }

  // Initiate the wowjs animation library
  new WOW().init();

  // Initialize Venobox
  $('.venobox').venobox({
    bgcolor: '',
    overlayColor: 'rgba(6, 12, 34, 0.85)',
    closeBackground: '',
    closeColor: '#fff'
  });

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      // Get hash from href attribute directly to ensure accuracy
      var href = $(this).attr('href') || this.getAttribute('href') || '';
      var hash = '';
      
      // Extract hash from href (handles both #section and full URLs)
      if (href.indexOf('#') !== -1) {
        hash = href.substring(href.indexOf('#'));
      } else if (this.hash) {
        hash = this.hash; // Fallback to this.hash property
      }
      
      // Ensure hash starts with # and is not empty
      if (!hash || hash.charAt(0) !== '#') {
        hash = '#' + (hash || '');
      }
      
      // Remove any extra content after the hash (in case of query params)
      hash = hash.split('?')[0].split('&')[0];
      
      var target = $(hash);
      
      if (target.length) {
        // Get current year route
        var currentYear = getCurrentRoute();
        
        // Store year in sessionStorage for persistence
        sessionStorage.setItem('currentYear', currentYear);
        
        // Build new hash with year and section (format: #2027-intro)
        var sectionId = hash.replace('#', '');
        var newHash = buildHash(currentYear, sectionId);
        
        // Update hash - this will trigger hashchange event
        window.location.hash = newHash;
        
        // The hashchange handler will handle scrolling, but we can also do it here
        var top_space = 0;
        if ($('#header').length) {
          top_space = $('#header').outerHeight();
          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        // Small delay to ensure route content is shown
        setTimeout(function() {
          $('html, body').animate({
            scrollTop: target.offset().top - top_space
          }, 1500, 'easeInOutExpo');
        }, 100);

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Gallery carousel (uses the Owl Carousel library)
  $(".gallery-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    center:true,
    responsive: { 0: { items: 1 }, 768: { items: 3 }, 992: { items: 4 }, 1200: {items: 5}
    }
  });

  // Buy tickets select the ticket type on click
  $('#buy-ticket-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var ticketType = button.data('ticket-type');
    var modal = $(this);
    modal.find('#ticket-type').val(ticketType);
  })

// custom code

  // ===========================
  // Hash-based Routing System
  // ===========================
  
  // Default year (current conference)
  const DEFAULT_YEAR = '2027';
  
  // Function to get current route from hash
  function getCurrentRoute() {
    var hash = window.location.hash.replace('#', '');
    // Check if hash starts with a 4-digit year followed by dash
    var yearMatch = hash.match(/^(\d{4})(?:-|$)/);
    if (yearMatch) {
      return yearMatch[1];
    }
    // Check if hash is just a 4-digit year
    if (/^\d{4}$/.test(hash)) {
      return hash;
    }
    // If hash is empty or doesn't match a year pattern, use default
    if (!hash) {
      return DEFAULT_YEAR;
    }
    // If hash exists but doesn't start with year, check for stored year or use default
    var storedYear = sessionStorage.getItem('currentYear');
    return storedYear || DEFAULT_YEAR;
  }
  
  // Function to extract section hash from full hash
  function getSectionHash() {
    var hash = window.location.hash.replace('#', '');
    // If hash starts with year followed by dash, extract the section part
    var yearMatch = hash.match(/^\d{4}-(.+)$/);
    if (yearMatch) {
      return '#' + yearMatch[1];
    }
    // If hash doesn't start with year, return it as is (for backward compatibility)
    if (hash && !/^\d{4}$/.test(hash) && !hash.match(/^\d{4}-/)) {
      return '#' + hash;
    }
    return null;
  }
  
  // Function to build hash with year and section
  function buildHash(year, section) {
    if (section) {
      return '#' + year + '-' + section.replace('#', '');
    }
    return '#' + year;
  }
  
  // Function to show/hide content based on route
  function routeContent(year) {
    // Hide all year-specific content first
    $('[data-year]').hide();
    
    // Show content for the specified year
    $('[data-year="' + year + '"]').show();
    
    // If no content found for the year, show default
    if ($('[data-year="' + year + '"]:visible').length === 0) {
      $('[data-year="' + DEFAULT_YEAR + '"]').show();
      year = DEFAULT_YEAR;
      // Update URL if needed
      if (window.location.hash !== '#' + DEFAULT_YEAR) {
        window.location.hash = DEFAULT_YEAR;
      }
    }
    
    // Update active route indicator if exists
    $('.route-link').removeClass('active');
    $('.route-link[data-route="' + year + '"]').addClass('active');
    
    // Scroll to top when route changes (but not on initial load)
    if (window.routeInitialized) {
      $('html, body').animate({scrollTop: 0}, 500);
    }
    window.routeInitialized = true;
  }
  
  // Initialize routing on page load
  var currentRoute = getCurrentRoute();
  routeContent(currentRoute);
  
  // Handle section navigation after route is set
  function handleSectionNavigation() {
    var sectionHash = getSectionHash();
    if (sectionHash) {
      var target = $(sectionHash);
      if (target.length) {
        var top_space = 0;
        if ($('#header').length) {
          top_space = $('#header').outerHeight();
          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }
        setTimeout(function() {
          $('html, body').animate({
            scrollTop: target.offset().top - top_space
          }, 1500, 'easeInOutExpo');
        }, 100);
      }
    }
  }
  
  // Handle hash changes
  $(window).on('hashchange', function() {
    var newRoute = getCurrentRoute();
    var routeChanged = newRoute !== currentRoute;
    
    if (routeChanged) {
      currentRoute = newRoute;
      sessionStorage.setItem('currentYear', currentRoute);
      routeContent(newRoute);
      // After route content is shown, handle section navigation
      setTimeout(handleSectionNavigation, 300);
    } else {
      // Same route, just section change
      handleSectionNavigation();
    }
  });
  
  // Handle initial section hash on page load
  $(document).ready(function() {
    // Store initial year
    var initialYear = getCurrentRoute();
    sessionStorage.setItem('currentYear', initialYear);
    
    // Handle section navigation after a delay
    setTimeout(handleSectionNavigation, 500);
  });
  
  // Update URL hash without triggering navigation (for internal links)
  function updateRoute(year, updateHash) {
    if (updateHash !== false) {
      window.location.hash = year;
    }
    currentRoute = year;
    routeContent(year);
  }
  
  // Expose route function globally for use in other scripts
  window.updateRoute = updateRoute;
  window.getCurrentRoute = getCurrentRoute;

});

