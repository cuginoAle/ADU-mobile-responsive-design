// jQuery Sticky plugin
// @author: apnerve
(function( $ ) {
  $.fn.sticky = function(t) {
    var _this = this;
    if(!t) {
      t = 0;
    }
    var stickyElement = $(_this);
    var oldValue = stickyElement.offset().top;
    var oldWidth = stickyElement.css('width');


    var scroller = function() {
      var stickyTop = stickyElement.offset().top;
      var windowTop = $(window).scrollTop();
      if(stickyTop - windowTop <= t && !stickyElement.hasClass('is-sticky')) {
        stickyElement.addClass('is-sticky');
        stickyElement.css({'width': oldWidth, 'top' : t + 'px', 'z-index' : 2});

        // specific to Adis search results
        if (_this.selector == '.tabs') {
          $('.results__content').css('margin-top', '48px');
        }
      }
      if(stickyTop - oldValue < 0) {
        stickyElement.removeClass('is-sticky');
        $('.results__content').css('margin-top', '0');
        stickyElement.css({'width' : 'auto'});
      }
    };

    if (window.addEventListener) {
      window.addEventListener('scroll', scroller, false);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', scroller);
    }
  };
}(jQuery));