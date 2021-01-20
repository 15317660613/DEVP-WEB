(function () {
    'use strict';
// 添加授权 本地
    GC.Spread.Sheets.LicenseKey =  "221.239.111.146,284313917124569#B0M1dRU56TJZEamJ4N8MlQE3SaqN4LlZleDZnSzAnVpRFSvE7KzJkcNdUWGZ4RJJVVzdzL5pFWRlWWWBjWjl5UzgnSyV7QwgEO5IHal3mdrATUzkkZ6wGUO9UVZx4VD3ySGl5aYZzN7E5SuB7RwJWQlFzaal4SndzZTV5Kl3idwglcDdHVtRUdVFzTkFWaIBVVXFVOwEFO7k5SORWWvJmMt3ySwN5dFR5RrhmaINjYuB7MQlXNUFndDVlZip4Yjt6NpVnWqd5S8xEc8gkZnNjQ8Jne4YlUDljaMdXNZNjZ8M4cqZ5asdnaVplTI36VYVzY7ljTVZXaiojITJCLiM4M5QDM5IDNiojIIJCL9gDM8QTNzEzM0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLiQTNwEjNwAyNwETM9EDMyIiOiQncDJCLiYDNx8SMxEjL9MjMuEjMyIiOiMXbEJCLig1jlzahlDZmpnInm1ajmDblmvYhl1rvoHajlXKtmnKplLiOiEmTDJCLikjN5QjMxcTM9MTMzQDOyIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPBhFa4lGUlRza6V4c6YWavYkeSVVMFllZFRDZLlUZ4tiT4U7YWJzNCBHU6ZVRpx4LHtCTOF7ZrRFVPlTeLl7Vvo6bClHZnhzUYZlW9c6UHdHTzQ5YGdXUYhnbmZla3tdN";


    var designer = GC.Spread.Sheets.Designer;

    var needSuspend;
    var tipWidth = 600;

    function updateLayout() {
        $(".content").css('height', $(".content").children('.fill-spread-content').height());
        $(".header").css("width", $(window).width() + "px");
        if ($(".ribbon-bar").data("gcui-gcuiribbon")) {
            $(".ribbon-bar").data("gcui-gcuiribbon").updateRibbonSize();
        }
        var spread = designer.wrapper.spread;
        if (spread && spread.isPaintSuspended()) {
            spread.resumePaint();
            spread.refresh();
            needSuspend = true;
        }
    }

    var _windowResizeTimer = null;

    function _doWindowResize() {
        if (_windowResizeTimer) {
            window.clearTimeout(_windowResizeTimer);
        }
        _windowResizeTimer = window.setTimeout(function () {
            updateLayout();
            _windowResizeTimer = null;
            if (needSuspend) {
                needSuspend = false;
                window.setTimeout(function () {
                    designer.wrapper.spread.suspendPaint();
                }, 300);
            }
        }, 100); //now delay 100ms to resize designer
    }

    $(document).ready(function () {
        designer.loader.loadContent();
        $(window).resize(_doWindowResize);
        $(window).resize();
        $("#verticalSplitter").draggable({
            axis: "y",
            containment: ".container",
            scroll: false,
            zIndex: 100,
            stop: function (event, ui) {
                var $this = $(this), top = $this.offset().top, offset = top - $(".header").height(), $content = $(".content .fill-spread-content");

                // adjust size of related items
                var oldHeight = $("#formulaBarText").height();
                var newHeight = oldHeight + offset;
                var ORIGINAL_FORMULABARTEXT_HEIGHT = 20;
                if (newHeight < ORIGINAL_FORMULABARTEXT_HEIGHT) { // 20: original height of formulaBarText
                    // reset to default
                    $("#formulaBarText").css({ height: ORIGINAL_FORMULABARTEXT_HEIGHT });
                    top = top + ORIGINAL_FORMULABARTEXT_HEIGHT - newHeight;
                } else {
                    $("#formulaBarText").css({ height: newHeight });
                }
                $content.css({ top: top + 10 }); // 10: height of the space for verticalSplitter
                $content.parent().css({ height: $content.height() });
                $(".header").css({ height: top });
                $this.css({ top: 0 });
                designer.wrapper.spread.refresh();
            }
        });

        function disableDragDrop(dataTransfer) {
            if (dataTransfer) {
                dataTransfer.effectAllowed = "none";
                dataTransfer.dropEffect = "none";
            }
        }

        window.addEventListener("dragenter", function (e) {
            e = e || event;
            e.preventDefault();
            disableDragDrop(e.dataTransfer);
        }, false);
        window.addEventListener("dragover", function (e) {
            e = e || event;
            e.preventDefault();
            disableDragDrop(e.dataTransfer);
        }, false);
        window.addEventListener("drop", function (e) {
            e = e || event;
            e.preventDefault();
            disableDragDrop(e.dataTransfer);
        }, false);
    });

    designer.loader.ready(function () {
        //To Fix the designer resize performance issues.
        $(window).unbind("resize.gcuiribbon");
        $("#verticalSplitter").show();
        updateLayout();
        data();
    });

})();

