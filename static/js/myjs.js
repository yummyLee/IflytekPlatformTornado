/**
 * index.html
 */
function getArticles() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // console.log(xhttp.responseText);
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

$("#indexContainer").ready(function () {
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

    // // Add smooth scrolling to all links in navbar + footer link
    // $(".navbar a, footer a[href='#containerPage]").on('click', function (event) {
    //     // Prevent default anchor click behavior
    //     event.preventDefault();
    //     // Store hash
    //     var hash = this.hash;
    //     // Using jQuery's animate() method to add smooth page scroll
    //     // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
    //     $('html, body').animate({
    //         scrollTop: $(hash).offset().top
    //     }, 900, function () {
    //         // Add hash (#) to URL when done scrolling (default click behavior)
    //         window.location.hash = hash;
    //     });
    // });
    //
    // $(window).scroll(function () {
    //     $(".slideanim").each(function () {
    //         var pos = $(this).offset().top;
    //         var winTop = $(window).scrollTop();
    //         if (pos < winTop + 600) {
    //             $(this).addClass("slide");
    //         }
    //     });
    // });


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

function getBusiness() {
    var x = new XMLHttpRequest();
    if (x.readyState === 4 && x.status === 200) {

    }

    x.open("GET", "/")

}


/**
 * container.html加载
 */

function loadContainerPages(pageName, params) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if (x.readyState === 4 && x.status === 200) {
            var pageContainerName;
            switch (pageName) {
                case "tools":
                    pageContainerName = "toolsBodyContainer";
                    break;
                case "add_article":
                    pageContainerName = "addArticleBodyContainer";
                    break;
                case "article":
                    pageContainerName = "articleContainer";
                    break;
                case "business":
                    pageContainerName = "businessContainer";
                    break;
                default:
                    pageContainerName = "/";
            }

            var html = new DOMParser().parseFromString(x.responseText, "text/html").getElementById(pageContainerName);
            console.log(html);
            $("#contentContainer").html(html.outerHTML);
            window.history.replaceState("", "", "/" + pageName + "?" + params);

            console.log("pageName = " + pageName);
            if (pageName === "tools") {
                getPageInfo(PAGE_NUM, ARTICLE_CLASS);
                getArticleClassInfo();
            } else if (pageName === "article") {
                getOtherArticles();
            } else if (pageName === "add_article") {
                addArticleReady();
            } else if (pageName === "business") {
                console.log("business");
                businessReady();
            }
        }
    };
    var url = "/" + pageName + "?param=get_html";
    if (params.length > 0) {
        url += ("&" + params);
    }
    x.open("GET", url, true);
    x.send();

}


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
            // console.log(xhttp.responseText);
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
            // console.log(xhttp.responseText);
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

$("#contentContainer").ready(function () {

    var path = window.location.pathname;
    var params = window.location.search;
    console.log("$(\"#contentContainer\").ready");
    console.log("path = " + path);
    console.log("params = " + params);
    loadContainerPages(path.replace("/", ""), params.replace("?", ""));

});


/**
 * articles.html
 * @param html
 */

function getOtherArticles() {
    console.log("getOtherArticles()");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // console.log(xhttp.responseText);
            var articles = eval("(" + xhttp.responseText + ")");
            for (var i = 0; i < getJsonLength(articles); i++) {
                $("#otherTool").append("<a href=\"article?article_id=" + articles[i]._id + "\" class=\"a-black\">\n" +
                    "<div class=\"panel panel-info\">\n" +
                    "<div class=\"panel-heading\">" + articles[i].articleTitle + "</div>\n" +
                    "<div class=\"main-tool-description panel-body\">" + articles[i].articleDescription + "</div>\n" +
                    "</div>\n" +
                    "</a>\n")
            }
            var imgs = document.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                imgs[i].className = "article-img";
            }
        }
    };
    xhttp.open("GET", "tools?param=get_articles&offset=0&limit=3", true);
    xhttp.send();
}


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
    return date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
}


function addArticleReady() {

    console.log("addArticleBodyContainer ready");

    $.base64.utf8encode = true;
    //添加文章页面js
    $("#articleClass").children().children().children().click(function () {
        var articleClassName = this.innerHTML;
        console.log(articleClassName);
        $("#curArticleClass").find(">span").html(articleClassName);
    });

    function isAllSpace(string) {
        if (string === "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(string);

    }

    $("#submitArticleButton").click(function () {
        var articleContent = $.base64.btoa($("#editor").html());
        var articleDescription = $.base64.btoa($("#articleDescription").val());
        var articleTitle = $.base64.btoa($("#articleTitle").val());
        var articleWriter = $.base64.btoa($("#articleWriter").val());

        var errorinfo = "";
        if (isAllSpace(articleTitle)) {
            errorinfo += "文章标题 ";
        }
        if (isAllSpace(articleWriter)) {
            errorinfo += "文章作者 ";
        }
        if (isAllSpace(articleDescription)) {
            errorinfo += "文章描述 ";
        }
        if (isAllSpace(articleContent)) {
            errorinfo += "文章内容 ";
        }
        if (errorinfo.length > 0) {
            toastr.error(errorinfo + "为空");
            return;
        }

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
                var response = eval("(" + result + ")");
                if (response.addArticleResponseType === "success") {
                    window.location = "article?article_id=" + response.addArticleResponseTips;
                } else {
                    toastr.error(response.addArticleResponseTips)
                }
            },
            error: function (msg) {

            }
        });
        return true;
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
}

/**
 * business.html
 **/
//业务页面加载左边菜单树
function businessReady() {
    console.log("businessBody");

    $("#businessContainer").keyup(function (event) {
        if (event.keyCode === 13) {
            var wait_to_search_content = $("#businessSearchContent").val();
            businessSearchCategory(wait_to_search_content)
        }
    });

    $("#businessSearchBtn").click(function () {
        var wait_to_search_content = $("#businessSearchContent").val();
        businessSearchCategory(wait_to_search_content);
    });

    $("#businessModalDownloadBtn").click(function () {

    });

    $("#businessModalLastPage").click(function () {
        if (currentBusinessFileContentLineNumOffset - businessContentReadLineLimit >= 0) {
            currentBusinessFileContentLineNumOffset -= businessContentReadLineLimit;
            openFileViaAJAX(currentBusinessFileName, currentBusinessFileContentLineNumOffset)
        }
    });

    $("#businessModalNextPage").click(function () {
        currentBusinessFileContentLineNumOffset += businessContentReadLineLimit;
        openFileViaAJAX(currentBusinessFileName, currentBusinessFileContentLineNumOffset)
    });


    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if (x.readyState === 4 && x.status === 200) {
            // console.log(x.responseText);
            var businesses = eval("(" + x.responseText + ")")
            for (var i = 0; i < getJsonLength(businesses); i++) {
                $("#businessClassList").append(
                    `<div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a data-toggle="collapse" href="#collapse${i}">${businesses[i].business}</a>
                                </h4>
                            </div>
                            <div id="collapse${i}" class="panel-collapse collapse">
                                <ul class="list-group subservices${i}">
                                </ul>
                            </div>
                        </div>`
                );
                var sub = businesses[i].subservices;
                for (var j in sub) {
                    // console.log(j);
                    $("#collapse" + i).append(`<li class="list-group-item"><div id="sub-models-${i}-${j}" class="panel" data-toggle="collapse" href=""><div class="panel-heading">${sub[j].subServiceName}</div></div></li>`);
                    var html = "";
                    html += "<div class='panel-body'>";
                    html += "<ul id='sub-models-" + i + "-" + j + "' class='list-group'>";
                    for (var modelType in sub[j].modelTypes) {
                        html += "<li class='list-group-item subservice-item'><a title=" + businesses[i].business + "\\" + sub[j].subServiceName + "\\" + sub[j].modelTypes[modelType] + " > " + sub[j].modelTypes[modelType] + " </a></li> ";
                    }
                    html += "</ul>";
                    html += "</div>";
                    $("#sub-models-" + i + "-" + j).append(html);
                }

            }
            $(".subservice-item").click(function () {
                getSubServiceInfo($(this).find(">a").attr("title"));

            })
        }
    };
    x.open("GET", "?param=business_class", true);
    x.send();
}

function businessSearchCategory(wait_to_search_content) {
    $("#businessContentMainContainer").find(">div").css("display", "none");
    $("#businessSearchResultContainer").css("display", "block");
    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if (x.readyState === 4 && x.status === 200) {
            var results = eval("(" + x.responseText + ")");
            var result_list = $("#businessSearchResultList");
            result_list.empty();
            for (var r in results) {
                result_list.append(`<li class="list-group-item"><a class='file-open' data-toggle='modal' data-target='#fileContentModal'>${results[r].corpus_file_name}</a><span class="pull-right label label-info">${results[r].business_name}</span></li>`);
            }
            //为文件路径添加点击打开文件响应事件
            $(".file-open").unbind("click").click(function () {
                currentBusinessFileContentLineNumOffset = 0;
                currentBusinessFileName = $(this).text();
                openFileViaAJAX(currentBusinessFileName, currentBusinessFileContentLineNumOffset);

            });
        }
    };
    x.open("GET", "/search?param=category&search_content=" + wait_to_search_content, true);
    x.send();
}

var currentBusinessFileContentLineNumOffset;
var currentBusinessFileName;
var businessContentReadLineLimit = 15;

function openFileViaAJAX(file_name, offset) {
    var x = new XMLHttpRequest();
    console.log("openFileViaAJAX file_name = " + file_name);
    x.onreadystatechange = function () {
        if (x.readyState === 4 && x.status === 200) {
            console.log("$(\".file-open\").click");
            // console.log(x.responseText);
            $("#modalFileContent").empty();
            $("#businessModalDownloadBtnLink").removeClass("disabled");
            var file_content = eval("(" + x.responseText + ")");
            for (var line in file_content) {
                var p = document.createElement("p");
                if (file_content[line] === "Iflytek-Dir-Sign") {
                    $("#businessModalDownloadBtnLink").addClass("disabled");
                } else {
                    p.textContent += file_content[line];
                }
                $("#modalFileContent").append(p);
            }
            $("#businessModalDownloadBtnLink").attr("href", "http://localhost:8010/file?param=download&file_name=" + file_name);
        }
    };
    x.open("GET", "file?param=read&file_name=" + file_name + "&offset=" + offset + "&limit=" + businessContentReadLineLimit, true);
    x.send();
}


//加载子业务信息
function getSubServiceInfo(pInfo) {
    $("#businessContentMainContainer").find(">div").css("display", "none");
    $("#subServiceDetailContainer").css("display", "block");
    var x = new XMLHttpRequest();
    var info = pInfo.split("\\");
    x.onreadystatechange = function () {
        if (x.readyState === 4 && x.status === 200) {
            // console.log(x.responseText);
            var sub_service_info = eval("(" + x.responseText + ")");
            // console.log(sub_service_info);
            console.log("getSubServiceInfo()-subService" + sub_service_info.subService);
            document.getElementById("bSubName").innerHTML = sub_service_info.subService;
            $("#subServiceTableBody").empty();
            for (var ii in sub_service_info) {
                // console.log(ii);
                // console.log(sub_service_info[ii])
                var ii_content = "";
                if (typeof sub_service_info[ii] === "object") {
                    for (var i = 0; i < sub_service_info[ii].length; i++) {
                        var p = sub_service_info[ii][i];
                        if (ii === "useCorpus" || ii === "corpusPlace") {
                            ii_content += ("<a class='file-open' data-toggle=\"modal\" data-target=\"#fileContentModal\">" + p + "</a><br>");
                        } else if (ii === "corpus") {
                            ii_content += ("<a class='category-open'>" + p + "</a><br>");
                        }
                    }
                } else {
                    ii_content = sub_service_info[ii];
                }

                if (ii !== "_id") {
                    $("#subServiceTableBody").append(
                        `<tr>
                            <td class="col-lg-3 text-center"><span class="label label-info">${ii}</span></td>
                            <td class="col-lg-9 text-center">${ii_content}</td>
                        </tr>`);
                }
                //为文件路径添加点击打开文件响应事件
                $(".file-open").unbind("click").click(function () {
                    currentBusinessFileContentLineNumOffset = 0;
                    currentBusinessFileName = $(this).text();
                    openFileViaAJAX(currentBusinessFileName, currentBusinessFileContentLineNumOffset);
                });

                $(".category-open").unbind("click").click(function () {
                    businessSearchCategory($(this).text())
                });
            }
        }
    };
    x.open("GET", "?param=get_service_info&business=" + info[0] + "&sub_service_name=" + info[1] + "&model_type=" + info[2]);
    x.send();
}
