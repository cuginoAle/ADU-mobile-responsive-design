(function() {
  var ADIS, show_search_results, toggle_deal_details;
  toggle_deal_details = function(e) {
    if ($(this).parent().find("#is_collapsed").val() === "true") {
      $(this).parent().find('span.read-more').children('a').trigger('click');
      return $(this).parent().find("#is_collapsed").val("false");
    } else {
      $(this).parent().find('span.read-less').children('a').trigger('click');
      return $(this).parent().find("#is_collapsed").val("true");
    }
  };
  $(document).ready(function() {
    var hey;
    hey = new ADIS;
    hey.init();
    $('p.results-list__snippet').expander({
      expandText: 'See more',
      userCollapseText: 'See less',
      slicePoint: 210,
      expandSpeed: 0,
      collapseSpeed: 0
    });
    $("#drugs, .no-results__drugs-match").click(function(e) {
      return show_search_results("drugs");
    });
    $("#deals, .no-results__deals-match").click(function(e) {
      return show_search_results("deals");
    });
    window.exportHandler = new ExportHandler("#export-bar", 50, "#export-choices");
    exportHandler.init();
    $(".facet-values__link").click(function() {
      $(this).addClass("loading");
      return $(this).children("img.loading").removeClass("display-none");
    });
    $("#searchTerm").focus(function() {
      $(".popup-menu").removeClass("display");
      return $("body").removeClass("enable-popup");
    });
    $("#show-more-drugs").click(function() {
      var nextPgUrl, pageNum, pageNumString, _this;
      pageNumString = $('#drug-page-next').val().replace(",", "");
      pageNum = parseInt(pageNumString);
      nextPgUrl = "/drugs" + $('#drug-page-load-more').val() + "&page=" + pageNum;
      _this = this;
      ADIS.loading(_this);
      return $.ajax(nextPgUrl, {
        type: "GET",
        datatype: "html",
        success: function(data) {
          var totalDrugs;
          $('#drug-page-next').val(pageNum + 1);
          totalDrugs = $('#drug-total').val().replace(",", "");
          if (pageNum * 50 > parseInt(totalDrugs)) {
            $("#show-more-drugs").hide();
          }
          $('.results__drugs-content ol').append(data);
          return ADIS.loaded(_this);
        }
      });
    });
    $('.deal-heading').bind("click", toggle_deal_details);
    return $("#show-more-deals").click(function() {
      var nextPgUrl, pageNum, pageNumString, _this;
      pageNumString = $('#deal-page-next').val().replace(",", "");
      pageNum = parseInt(pageNumString);
      nextPgUrl = "/deals" + $('#deal-page-load-more').val() + "&page=" + pageNum;
      _this = this;
      ADIS.loading(_this);
      return $.ajax(nextPgUrl, {
        type: "GET",
        datatype: "html",
        success: function(data) {
          var totalDeals;
          $('#deal-page-next').val(pageNum + 1);
          $('.results__deals-content ol').append(data);
          $('p.results-list__snippet').expander({
            expandText: 'See more',
            userCollapseText: 'See less',
            slicePoint: 210
          });
          $('.deal-heading').unbind("click");
          $('.deal-heading').bind("click", toggle_deal_details);
          totalDeals = $('#deal-total').val().replace(",", "");
          if (pageNum * 50 > parseInt(totalDeals)) {
            $("#show-more-deals").hide();
          }
          return ADIS.loaded(_this);
        }
      });
    });
  });
  ADIS = (function() {
    function ADIS() {}
    ADIS.prototype.init = function() {
      var stickyOffset;
      if ($(window).width() >= 1024 && $('html').hasClass('no-csspositionsticky')) {
        stickyOffset = 7;
        this.sticky('.facets-container', stickyOffset);
        this.sticky('.tabs', 0);
      }
      this.showMore('.js-show-more');
      return this.back('.back-to-top');
    };
    ADIS.prototype.sticky = function(el, offset) {
      if ($(el).length) {
        return $(el).sticky(offset);
      }
    };
    ADIS.prototype.back = function(el) {
      if (($(el).length)) {
        return $(el).click(function(e) {
          e.preventDefault();
          return $('body,html').animate({
            scrollTop: 0
          }, 400);
        });
      }
    };
    ADIS.prototype.showMore = function(el) {
      return $(el).click(function(e) {
        var _this;
        _this = $(this);
        return e.preventDefault();
      });
    };
    ADIS.loading = function(e) {
      return $(e).attr('disabled', 'true').text('Please wait...');
    };
    ADIS.loaded = function(e) {
      $(e).removeAttr('disabled').text('Show more results');
      return $(".export-selector").click(function() {
        return exportHandler.functionality_for_newresults($(this));
      });
    };
    return ADIS;
  })();
  show_search_results = function(selected_tab) {
    $(".results__content").hide();
    $("." + selected_tab).show();
    $(".tabs__item").removeClass("active");
    $("#" + selected_tab).addClass("active");
    return $.cookie("current_tab", selected_tab);
  };
}).call(this);
