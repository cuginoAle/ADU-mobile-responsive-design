(function() {
  $(document).ready(function() {
    if ($("#chemicalStructureImage").length) {
      $("#chemicalStructureImage").colorbox({
        opacity: 0.75,
        fixed: true,
        scrolling: true,
        maxWidth: 1024,
        maxHeight: 768,
        close: "Close",
        onOpen: function() {
          return $('#cboxClose').hide();
        },
        onComplete: function() {
          var header, originalHtml;
          header = "<div id='reader-buttons' style='position:absolute;width: 100%;' />";
          originalHtml = $("#cboxLoadedContent");
          originalHtml.prepend(header);
          return $('#cboxClose').show();
        }
      });
    }
    $('.document__alt-name').expander({
      expandText: 'show all',
      userCollapseText: 'show less',
      slicePoint: 185,
      expandSpeed: 0,
      collapseSpeed: 0
    });
    $('.recent-events__event-details').expander({
      expandText: 'show more',
      userCollapseText: 'show less',
      slicePoint: 130,
      expandSpeed: 0,
      collapseSpeed: 0
    });
    return $('.accordion__hd:not(.accordion__hd--disabled)').click(function() {
      var content_box, _this;
      _this = $(this);
      content_box = _this.next('.accordion__bd');
      if (_this.hasClass('accordion__hd--expanded')) {
        content_box.hide();
        return _this.addClass('accordion__hd--collapsed').removeClass('accordion__hd--expanded');
      } else {
        content_box.show();
        return _this.addClass('accordion__hd--expanded').removeClass('accordion__hd--collapsed');
      }
    });
  });
}).call(this);
