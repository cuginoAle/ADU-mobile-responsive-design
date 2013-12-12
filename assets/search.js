(function() {
  var AdvancedSearch, AdvancedSearchQuery, Search, SearchQuery;
  window.SearchQuery = SearchQuery = (function() {
    function SearchQuery(queryString, searchType) {
      this.queryString = queryString;
      this.searchType = searchType;
    }
    SearchQuery.prototype.searchUri = function() {
      var query;
      query = this.queryString;
      if (this.queryString === "Search") {
        query = "";
      }
      return ("/search?query=" + this.searchType + ":\"") + encodeURIComponent(query) + "\"";
    };
    return SearchQuery;
  })();
  window.SearchHandler = Search = (function() {
    Search.prototype._searchQuery = null;
    function Search(event) {
      this.event = event;
      this._searchQuery = new SearchQuery($("#searchTerm").val(), $("#search-filter-dropdown").val());
    }
    Search.prototype.submit = function() {
      this.event.preventDefault();
      return location.href = this._searchQuery.searchUri();
    };
    return Search;
  })();
  window.AdvancedSearch = AdvancedSearch = (function() {
    var addRow, getNewExtendedSearchRow, initializeAutoSuggest, renumberSearchRowsFor, resetFor, setId;
    function AdvancedSearch() {}
    AdvancedSearch.prototype.init = function() {
      $("#advancedSearchSubmit").prop("disabled", false);
      initializeAutoSuggest($('#adv-search-indication-1').find("input"), 'indication', '#adv-search-indication-1');
      initializeAutoSuggest($('#adv-search-moa-1').find("input"), 'moa', '#adv-search-moa-1');
      return initializeAutoSuggest($('#adv-search-drug-name-1').find("input"), 'drug-name', '#adv-search-drug-name-1');
    };
    AdvancedSearch.prototype.addIndicationSearchRow = function(event) {
      var parameterRow, type;
      event.preventDefault();
      parameterRow = $(event.target).parent().parent();
      type = "indication";
      return addRow(type, parameterRow);
    };
    AdvancedSearch.prototype.addMoaSearchRow = function(event) {
      var parameterRow, type;
      event.preventDefault();
      parameterRow = $(event.target).parent().parent();
      type = "moa";
      return addRow(type, parameterRow);
    };
    AdvancedSearch.prototype.addDrugNameSearchRow = function(event) {
      var parameterRow, type;
      event.preventDefault();
      parameterRow = $(event.target).parent().parent();
      type = "drug-name";
      return addRow(type, parameterRow);
    };
    addRow = function(type, parameterRow) {
      var containerID, inputElement, newRow;
      newRow = $(getNewExtendedSearchRow(type));
      parameterRow.after(newRow);
      renumberSearchRowsFor(type);
      containerID = "#" + newRow.attr("id");
      inputElement = newRow.find("input");
      initializeAutoSuggest(inputElement, type, containerID);
      newRow.find('option:contains("Or")').attr("selected", true);
      return $('.controls__operator').selectBox();
    };
    AdvancedSearch.prototype.deleteSearchRow = function(event, type) {
      var parameterRow;
      event.preventDefault();
      parameterRow = $(event.target).parent().parent();
      parameterRow.remove();
      return renumberSearchRowsFor(type);
    };
    renumberSearchRowsFor = function(type) {
      var baseRow, count, row, rows, _i, _len, _results;
      rows = $("#" + type + " > div");
      count = 2;
      baseRow = rows[0];
      _results = [];
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        if (row !== baseRow) {
          _results.push(setId($(row), type, count++));
        }
      }
      return _results;
    };
    setId = function(row, type, count) {
      return $(row).attr('id', 'adv-search-' + type + '-' + count);
    };
    AdvancedSearch.prototype.submitAdvancedSearch = function(event) {
      var advSearchQuery, query;
      event.preventDefault();
      advSearchQuery = new AdvancedSearchQuery();
      query = advSearchQuery.buildSearchQuery();
      if (query !== '') {
        return location.href = "/search?query=" + query;
      }
    };
    AdvancedSearch.prototype.reset = function(event) {
      var id, row, _i, _len, _ref, _results;
      event.preventDefault();
      _ref = $(".form-row");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        id = "#" + (row.getAttribute('id'));
        _results.push(resetFor($("" + id + "> div")));
      }
      return _results;
    };
    resetFor = function(rows) {
      var baseRow, row, _i, _len;
      baseRow = rows[0];
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        if (row !== baseRow) {
          $(row).remove();
        }
      }
      return $(baseRow).find("input").val("");
    };
    initializeAutoSuggest = function(textField, type, container) {
      return textField.autocomplete({
        source: function(request, response) {
          return $.getJSON("/suggest", {
            term: encodeURIComponent(textField.val()),
            hierarchyType: type
          }, response);
        },
        minLength: 2,
        select: function(event, ui) {
          return textField.val(ui.item.value);
        },
        appendTo: container
      });
    };
    getNewExtendedSearchRow = function(rowType) {
      return "<div id=\"adv-search-" + rowType + "\">" + "<div class=\"controls\">" + "<select class=\"controls__operator\"><option selected=\"selected\">Or</option></select>&nbsp;" + "<input type=\"text\" name=\"adv-search-" + rowType + "\">&nbsp;" + "<button class=\"btn js_add\" type=\"button\">+</button>&nbsp;" + "<button class=\"btn js_delete\" type=\"button\">-</button>" + "</div>" + "</div>";
    };
    return AdvancedSearch;
  })();
  window.AdvancedSearchQuery = AdvancedSearchQuery = (function() {
    var getQueryFor, getQueryValuesFor;
    AdvancedSearchQuery.prototype._indicationQueryString = '';
    AdvancedSearchQuery.prototype._moaQueryString = '';
    function AdvancedSearchQuery() {
      this._indicationQueryString = getQueryValuesFor($("input[name='adv-search-indication']"));
      this._moaQueryString = getQueryValuesFor($("input[name='adv-search-moa']"));
      this._drugNameQueryString = getQueryValuesFor($("input[name='adv-search-drug-name']"));
    }
    getQueryValuesFor = function(inputElement) {
      var i, queryString, queryValues;
      queryValues = [];
      i = 0;
      inputElement.each(function() {
        var value;
        value = $(this).val();
        if (value && value !== '') {
          return queryValues[i++] = '"' + escape($.trim(value)) + '"';
        }
      });
      queryString = queryValues.join(",");
      return queryString;
    };
    AdvancedSearchQuery.prototype.buildSearchQuery = function() {
      var filteredQueryString, queryStrings, searchQuery;
      queryStrings = [];
      queryStrings[0] = getQueryFor("indication", this._indicationQueryString);
      queryStrings[1] = getQueryFor("moa", this._moaQueryString);
      queryStrings[2] = getQueryFor("drug-name", this._drugNameQueryString);
      filteredQueryString = $.grep(queryStrings, function(q) {
        return q !== "";
      });
      searchQuery = filteredQueryString.join(" AND ");
      return searchQuery;
    };
    getQueryFor = function(type, queryString) {
      if (queryString !== '') {
        return type + ":" + queryString;
      } else {
        return "";
      }
    };
    return AdvancedSearchQuery;
  })();
}).call(this);
