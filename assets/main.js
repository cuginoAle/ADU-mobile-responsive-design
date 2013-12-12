(function() {
  var searchTextforIE;
  $(document).ready(function() {
    var advSearch, highlight, searchtextbox;
    searchtextbox = $("#searchTerm");
    searchTextforIE(searchtextbox);
    $("#toggle-searchbar").click(function(e) {
      e.preventDefault();
      $('body').toggleClass("show-search");
      return $(this).toggleClass("pillow-btn-active");
    });
    advSearch = new AdvancedSearch();
    advSearch.init();
    $("#advancedSearchForm").submit(function(e) {
      return advSearch.submitAdvancedSearch(e);
    });
    $("#global-search").submit(function(e) {
      var searchHandler;
      $.cookie("current_searchType", $("#search-filter-dropdown").val());
      searchHandler = new SearchHandler(e);
      return searchHandler.submit();
    });
    $(".selectBox-dropdown-menu a").click(function(e) {
      e.preventDefault();
      if ($(this).attr("rel") !== "any") {
        return $(".advanced-search").removeClass("show-advanced-search");
      } else {
        return $(".advanced-search").toggleClass("show-advanced-search");
      }
    });
    $("#indication").on("click", ".btn.js_add", function(e) {
      return advSearch.addIndicationSearchRow(e);
    });
    $("#indication").on("click", ".btn.js_delete", function(e) {
      return advSearch.deleteSearchRow(e, "indication");
    });
    $("#moa").on("click", ".btn.js_add", function(e) {
      return advSearch.addMoaSearchRow(e);
    });
    $("#moa").on("click", ".btn.js_delete", function(e) {
      return advSearch.deleteSearchRow(e, "moa");
    });
    $("#drug-name").on("click", ".btn.js_add", function(e) {
      return advSearch.addDrugNameSearchRow(e);
    });
    $("#drug-name").on("click", ".btn.js_delete", function(e) {
      return advSearch.deleteSearchRow(e, "drug-name");
    });
    $("#advancedSearchForm").on("click", ".btn.js_reset", function(e) {
      return advSearch.reset(e);
    });
    $("#global-search").submit(function() {
      $("#search").addClass("loading");
      return $("#search").next("img.loading").css("display", "inline");
    });
    $(window).load(function() {
      return $("#search").prop("disabled", false);
    });
    highlight = function(searchTerm, matchedResults) {
      var re, term;
      term = $.trim(searchTerm).split(" ").join("|");
      term = $.trim(term).split("'").join("[']*");
      term = $.trim(term).split("-").join("[- ]");
      term = $.trim(term).split("(").join("[\( ]");
      term = $.trim(term).split(")").join("[\) ]");
      re = new RegExp("\\b(" + term + ")", "gi");
      return matchedResults.replace(re, "<strong>$1</strong>");
    };
    $.ui.autocomplete.prototype._renderItem = function(ul, item) {
      var highlightedResult;
      highlightedResult = highlight(this.term, item.label);
      return $("<li></li>").data("item.autocomplete", item).append("<a>" + highlightedResult + "</a>").appendTo(ul);
    };
    return $("#reset").colorbox({
      opacity: 0.75,
      fixed: true,
      scrolling: true,
      width: 350,
      height: 140,
      html: $(".alert-box"),
      close: "Close",
      onOpen: function() {
        return $('.alert-box').show();
      },
      onComplete: function() {
        var header;
        header = $('#cboxClose');
        $('.alert-box__confirm').append(header);
        $("#reset-drugs-selection").click(function() {
          exportHandler.reset();
          return $.colorbox.close();
        });
        return $("#cboxClose").click(function() {
          return $.colorbox.close();
        });
      }
    });
  });
  $(function() {
    return $("#searchTerm").autocomplete({
      source: function(request, response) {
        return $.getJSON("/suggest", {
          term: encodeURIComponent($('#searchTerm').val()),
          hierarchyType: $('#search-filter-dropdown').val()
        }, response);
      },
      minLength: 2,
      select: function(event, ui) {
        $('#searchTerm').val(ui.item.value);
        $.cookie("current_searchType", $("#search-filter-dropdown").val());
        return $("#global-search").submit();
      },
      position: {
        my: "left-1 top+1"
      },
      appendTo: ".big-search .search-field"
    });
  });
  searchTextforIE = function(txt) {
    if ($("html").hasClass("ie8") || $("html").hasClass("ie9")) {
      if (!(txt.val() != null) || txt.val() === "") {
        txt.val("Search");
        txt.focus(function(e) {
          e.preventDefault();
          if ($(this).val() === "Search") {
            return $(this).val(null);
          }
        });
        return txt.blur(function(e) {
          e.preventDefault();
          if (!($(this).val() != null) || $(this).val() === "") {
            return $(this).val("Search");
          }
        });
      }
    }
  };
}).call(this);
