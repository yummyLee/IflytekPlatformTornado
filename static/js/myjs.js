/**
 * index.html
 */
function getArticles() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log(xhttp.responseText);
            var articles = eval("(" + xhttp.responseText + ")");
            for (var i = 0; i < getJsonLength(articles); i++) {
                $("#mainToolList").append("<div class=\"col-sm-4\">\n" +
                    "<a href=\"article?article_id=" + articles[i]._id + "\" class=\"a-black\">\n" +
                    "<div class=\"panel panel-info\">\n" +
                    "<div class=\"panel-heading\">" + articles[i].articleTitle + "</div>\n" +
                    "<div class=\"main-tool-description panel-body\">" + articles[i].articleDescription + "</div>\n" +
                    "</div>" +
                    "</a>" +
                    "</div>")
            }
        }
    };
    xhttp.open("GET", "tools?param=get_articles&offset=0&limit=3", true);
    xhttp.send();
}

function getJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
}

$(document).ready(function () {
    getArticles();

    $("#userLogout").click(function () {
        var x = new XMLHttpRequest();
        x.onreadystatechange = function () {
            if (x.readyState === 4 && x.status === 200) {
                var response = eval("(" + x.responseText + ")")
                if (response.logoutResponseType === "success") {
                    window.location.href = "/";
                }
            }
        };
        x.open("GET", "/logout", true);
        x.send();
    });

    // Add smooth scrolling to all links in navbar + footer link
    $(".navbar a, footer a[href='#myPage']").on('click', function (event) {
        // Prevent default anchor click behavior
        event.preventDefault();
        // Store hash
        var hash = this.hash;
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 900, function () {
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    });

    $(window).scroll(function () {
        $(".slideanim").each(function () {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600) {
                $(this).addClass("slide");
            }
        });
    });


    // $("#goToTools").click(function () {
    //     var x = new XMLHttpRequest();
    //     x.overrideMimeType("text/html");
    //     x.onreadystatechange = function () {
    //         if (x.readyState === 4 && x.status === 200) {
    //             var html = new DOMParser().parseFromString(x.responseText, "text/html").getElementById("toolsContainer");
    //             console.log(html);
    //             document.getElementById("allContainer").innerHTML = html.outerHTML;
    //             $("#toolsContainer").ready(function () {
    //                 getPageInfo(PAGE_NUM, ARTICLE_CLASS);
    //                 getArticleClassInfo()
    //             });
    //         }
    //     };
    //     x.open("GET", "/tools", true);
    //     x.send()
    // })

});


/**
 * tools.html
 * @type {number}
 */
var PAGE_NUM = 1;
var ARTICLE_CLASS = "all";

function getArticleClassInfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log(xhttp.responseText);
            var article_classes = eval("(" + xhttp.responseText + ")");
            for (var i = 0; i < getJsonLength(article_classes); i++) {
                $("#article_class_list").append("<a href=\"#\" onclick=getPageInfo(1,\"" + article_classes[i].articleClass + "\") class=\"list-group-item\">\n" +
                    "<label class=\"label label-info\">" + article_classes[i].articleClass + "</label><span class=\"badge\">" + article_classes[i].articleClassCount + "</span>\n" +
                    "</a>")
            }
        }
    };
    xhttp.open("GET", "tools?param=article_class", true);
    xhttp.send();
}

function nextPage() {
    getPageInfo(++PAGE_NUM, ARTICLE_CLASS);
}

function prePage() {
    if (PAGE_NUM - 1 > 0) {
        getPageInfo(--PAGE_NUM, ARTICLE_CLASS);
    } else {

    }
}

function getPageInfo(page_num, article_class) {
    var xhttp = new XMLHttpRequest();
    if (ARTICLE_CLASS !== article_class) {
        PAGE_NUM = 1;
        ARTICLE_CLASS = article_class
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log(xhttp.responseText);
            var articles = eval("(" + xhttp.responseText + ")");
            var len = getJsonLength(articles);
            if (len === 0) {
                return
            }
            $("#tool-class-list").empty();
            for (var i = 0; i < len; i++) {
                $("#tool-class-list").append("<a href=\"article?article_id=" + articles[i]._id + "\" class=\"list-group-item\">" +
                    "<label class=\"label label-info article-item\">" + articles[i].articleClass + "</label>" +
                    "<span class=\"article-item\">" + articles[i].articleTitle + "</span>" +
                    "</a>"
                );
            }
        }
    };
    if (article_class === "all") {
        xhttp.open("GET", "tools?param=get_articles&offset=" + (PAGE_NUM - 1) * 10 + "&limit=10", true);
    } else {
        xhttp.open("GET", "tools?param=get_articles&offset=" + (page_num - 1) * 10 + "&limit=10&article_class=" + article_class, true);
    }
    xhttp.send();
}

$("#toolsContainer").ready(function () {
    getPageInfo(PAGE_NUM, ARTICLE_CLASS);
    getArticleClassInfo();
    // $("#addArticleBtn").click(function () {
    //     var x = new XMLHttpRequest();
    //     x.overrideMimeType("text/html");
    //     x.onreadystatechange = function () {
    //         if (x.readyState === 4 && x.status === 200) {
    //             console.log(x.responseText);
    //             var html = new DOMParser().parseFromString(x.responseText, "text/html").getElementById("addArticleBodyContainer");
    //             console.log(html);
    //             $("#toolsBodyContainer").innerHTML = html.outerHTML;
    //         }
    //     };
    //     x.open("GET", "add_article", true);
    //     x.send();
    // });
});

//添加文章页面js
$("#articleClass").children().children().children().click(function () {
    var articleClassName = this.innerHTML;
    console.log(articleClassName);
    $("#curArticleClass").html(articleClassName);
});

function runCode(html) {
    var newwin = window.open('', '', '');
    newwin.opener = null;
    newwin.document.write(html);
    newwin.document.close();
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
}

$.base64.utf8encode = true;

$("#addArticleBodyContainer").ready(function () {
    $("#submitArticleButton").click(function () {
        var articleContent = $.base64.btoa($("#editor").html());
        var articleDescription = $.base64.btoa($("#articleDescription").val());
        var articleTitle = $.base64.btoa($("#articleTitle").val());
        var articleWriter = $.base64.btoa($("#articleWriter").val());
        var articleClass = $.base64.btoa($("#curArticleClass").html());
        console.log(articleClass);
        var articleDate = getNowFormatDate();
        var _xsrf = $("input[name='_xsrf']").val();
        console.log("_xsrf = " + _xsrf);
        $.ajax({
            url: "add_article",
            type: "POST",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data:
                JSON.stringify({
                'articleTitle': articleTitle,
                'articleWriter': articleWriter,
                'articleClass': articleClass,
                'articleDescription': articleDescription,
                'articleDate': articleDate,
                'articleContent': articleContent,

            }),
            dataType: "text",
            success: function (result) {
                console.log(result);
//                    runCode(result)
                window.location = "article?article_id=" + result;
            },
            error: function (msg) {

            }
        });
        return true;
    })
});

$(function () {
    function initToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
                'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                'Times New Roman', 'Verdana'
            ],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });
        $('a[title]').tooltip({
            container: 'body'
        });
        $('.dropdown-menu input').click(function () {
            return false;
        })
            .change(function () {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function () {
                this.value = '';
                $(this).change();
            });

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this),
                target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });
        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();
            $('#voiceBtn').css('position', 'absolute').offset({
                top: editorOffset.top,
                left: editorOffset.left + $('#editor').innerWidth() - 35
            });
        } else {
            $('#voiceBtn').hide();
        }
    }

    function showErrorAlert(reason, detail) {
        var msg = '';
        if (reason === 'unsupported-file-type') {
            msg = "Unsupported format " + detail;
        } else {
            console.log("error uploading file", reason, detail);
        }
        $('<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
    }

    initToolbarBootstrapBindings();
    $('#editor').wysiwyg({
        fileUploadError: showErrorAlert
    });
    window.prettyPrint && prettyPrint();
});