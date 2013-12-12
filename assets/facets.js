(function() {
  $(document).ready(function() {
    if ($("#see-all").length) {
      return $("#see-all").colorbox({
        opacity: 0.75,
        fixed: true,
        height: "85%",
        width: "45%",
        scrolling: true,
        html: $(".facets__facet-values").html(),
        onOpen: function() {
          return $('#cboxClose').hide();
        },
        onComplete: function() {
          var facet_list, h, header;
          header = "<div class='facets facets--facet-expanded'>                    <div class='facets-header'>                      <h3 class='facets__facet-title'>Mechanism of Action</h3>                      <a class='btn btn-close right'>Close</a>                    </div>                    <ol class='facets__facet-values' id='facet-values'></ol>                  </div>";
          facet_list = $("#cboxLoadedContent").html();
          $("#cboxLoadedContent").html(header);
          h = $("#cboxLoadedContent").height() - 42;
          $('#facet-values').append(facet_list).css("height", h + "px");
          return $(".btn-close").click(function() {
            return $.colorbox.close();
          });
        }
      });
    }
  });
}).call(this);
