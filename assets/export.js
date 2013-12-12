(function() {
  var ConfirmDialog, ExportHandler, ExportOptions;
  window.ExportHandler = ExportHandler = (function() {
    function ExportHandler(exportBarId, maxLimit, exportOptionsDiv) {
      this.exportBarId = exportBarId;
      this.maxLimit = maxLimit;
      this.exportOptionsDiv = exportOptionsDiv;
      this._exportOptions = new ExportOptions(this.exportOptionsDiv);
      this._exportOptions.init();
    }
    ExportHandler.prototype.init = function() {
      $("#exportOptions").click(function() {
        return exportHandler._exportOptions.toggleOptions();
      });
      $("#export").click(function() {
        return exportHandler.exportToCSV();
      });
      $(".export-selector").click(function() {
        return exportHandler.addProfileToExportList($(this));
      });
      return $("#exportOptions").hover(function() {
        return $(this).next(".tooltip-information").toggleClass("show");
      });
    };
    ExportHandler.prototype.addProfileToExportList = function(element) {
      this.toggleActiveClass($(element));
      return this.display();
    };
    ExportHandler.prototype.display = function() {
      var chkBox, exportBar, length, _i, _j, _len, _len2, _ref, _ref2;
      length = $(".export-selector:checked").length;
      exportBar = $(this.exportBarId);
      exportBar.find("#count-of-selected").text("Selected " + length + "/" + this.maxLimit);
      if (length === this.maxLimit) {
        _ref = $(".export-selector:not(:checked)");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chkBox = _ref[_i];
          chkBox.setAttribute("disabled", true);
        }
      } else {
        _ref2 = $(".export-selector:not(:checked)");
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          chkBox = _ref2[_j];
          chkBox.removeAttribute("disabled");
        }
      }
      if (length > 0) {
        return exportBar.show();
      } else {
        return exportBar.hide();
      }
    };
    ExportHandler.prototype.reset = function() {
      var selectedDrugs;
      selectedDrugs = $('.export-selector:checked');
      selectedDrugs.removeAttr('checked').parent('h2').parent('li').removeClass("active");
      return this.display();
    };
    ExportHandler.prototype.exportToCSV = function() {
      var actionUrl, selected, selectedIds;
      selectedIds = ((function() {
        var _i, _len, _ref, _results;
        _ref = $('.export-selector:checked');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          selected = _ref[_i];
          _results.push(selected.value);
        }
        return _results;
      })()).join(',');
      actionUrl = $("#export-bar [name='exportSection']:checked").val();
      return $.download(actionUrl, "ids=" + selectedIds + "&expectedInformation=" + this._exportOptions.getExpectedInformation(), "POST");
    };
    ExportHandler.prototype.toggleActiveClass = function(checkbox) {
      return checkbox.parent('h2').parent('li').toggleClass("active");
    };
    return ExportHandler;
  })();
  window.ExportOptions = ExportOptions = (function() {
    function ExportOptions(exportOptionsDiv) {
      this.exportOptionsDiv = exportOptionsDiv;
    }
    ExportOptions.prototype.init = function() {
      $("#close-popup").click(function() {
        return exportHandler._exportOptions.closeOptions();
      });
      $("#dev-phase").click(function() {
        return exportHandler._exportOptions.selectDevPhaseExport();
      });
      $("#all-fields").click(function() {
        return exportHandler._exportOptions.selectAllFieldsExport();
      });
      return $("#select-all-for-export").click(function() {
        return exportHandler._exportOptions.selectAllFieldsForExport();
      });
    };
    ExportOptions.prototype.toggleOptions = function() {
      $(this.exportOptionsDiv).toggleClass("display");
      return $("body").toggleClass("enable-popup");
    };
    ExportOptions.prototype.closeOptions = function() {
      $(this.exportOptionsDiv).removeClass("display");
      return $("body").removeClass("enable-popup");
    };
    ExportOptions.prototype.selectDevPhaseExport = function() {
      $(this.exportOptionsDiv + " [name='exportColumns']").attr("disabled", true);
      return $("#select-all-for-export").hide();
    };
    ExportOptions.prototype.selectAllFieldsExport = function() {
      $(this.exportOptionsDiv + " [name='exportColumns']").attr("disabled", false);
      return $("#select-all-for-export").show();
    };
    ExportOptions.prototype.getExpectedInformation = function() {
      var selected;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = $(this.exportOptionsDiv + " [name='exportColumns']:checked");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          selected = _ref[_i];
          _results.push(selected.value);
        }
        return _results;
      }).call(this)).join(',');
    };
    ExportOptions.prototype.selectAllFieldsForExport = function() {
      $(this.exportOptionsDiv + " [name='exportColumns']").attr("checked", "checked");
      return $(this.exportOptionsDiv + " [name='exportColumns']").prop("checked", true);
    };
    return ExportOptions;
  })();
  window.ConfirmDialog = ConfirmDialog = (function() {
    function ConfirmDialog(confirmDialogId, yesId, noId) {
      this.confirmDialogId = confirmDialogId;
      this.yesId = yesId;
      this.noId = noId;
      $(this.confirmDialogId).children(this.yesId).click(function() {
        return true;
      });
      $(this.confirmDialogId).children(this.noId).click(function() {
        return false;
      });
      ({
        yes: function() {
          return true;
        },
        no: function() {
          return false;
        }
      });
    }
    return ConfirmDialog;
  })();
}).call(this);
