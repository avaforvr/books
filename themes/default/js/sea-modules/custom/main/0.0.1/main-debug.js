define("custom/main/0.0.1/main-debug", [ "jquery-debug", "./index-debug", "./mod/file-debug", "./browse-debug", "./mod/selectWidget-debug", "./mod/inputVal-debug", "./mod/formCheck-debug", "./details-debug", "./upload-debug", "./mod/verifyAtta-debug", "./lib/jqueryForm-debug", "./batchUpload-debug", "./mod/batch-debug", "./login-debug", "./mod/verify-debug", "./mod/getParam-debug", "./register-debug", "./forgetPwd-debug", "./changePwd-debug" ], function(require, exports, modulselectWidgete) {
    var $ = require("jquery-debug");
    //to determine which code to take effect
    var data_key = $("body").attr("data-key") ? $("body").attr("data-key") : "";
    // common
    // --------------------------------------------------
    // index
    // --------------------------------------------------
    if (data_key == "index") {
        require("./index-debug");
    }
    // browse
    // --------------------------------------------------
    if (data_key == "browse") {
        require("./browse-debug");
    }
    // details
    // --------------------------------------------------
    if (data_key == "details") {
        require("./details-debug");
    }
    // upload
    // --------------------------------------------------
    if (data_key == "upload") {
        require("./upload-debug");
    }
    // batchUpload
    // --------------------------------------------------
    if (data_key == "batchUpload") {
        require("./batchUpload-debug");
    }
    // login
    // --------------------------------------------------
    if (data_key == "login") {
        require("./login-debug");
    }
    // register
    // --------------------------------------------------
    if (data_key == "register") {
        require("./register-debug");
    }
    // forgetPwd
    // --------------------------------------------------
    if (data_key == "forgetPwd") {
        require("./forgetPwd-debug");
    }
    // changePwd
    // --------------------------------------------------
    if (data_key == "changePwd") {
        require("./changePwd-debug");
    }
});

define("custom/main/0.0.1/index-debug", [ "jquery-debug", "custom/main/0.0.1/mod/file-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var File = require("custom/main/0.0.1/mod/file-debug");
    //喜欢
    $(".eva").click(function() {
        var liId = $(this).parents("li").attr("id");
        var bid = parseInt(liId.replace("nov_", ""));
        var f = new File(bid);
        f.doLike();
    });
    //删除文件
    $(".btnDelFile").click(function() {
        var liId = $(this).parents("li").attr("id");
        var bid = parseInt(liId.replace("nov_", ""));
        var f = new File(bid);
        f.doDelete();
    });
});

define("custom/main/0.0.1/mod/file-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    function File(bid) {
        this.bid = parseInt(bid);
        this.container = $("#nov_" + bid);
        this.evaWrap = $("#evaWrap_" + bid);
        this.backUrl = encodeURI(location.href);
    }
    module.exports = File;
    //喜欢或取消喜欢
    File.prototype.doLike = function() {
        var nov = this;
        var bid = nov.bid;
        var evaWrap = nov.evaWrap;
        $.ajax({
            type: "POST",
            url: "../../../ajax.php",
            dataType: "json",
            data: {
                act: "doLike",
                bid: bid
            },
            success: function(r) {
                if (r.code == 0) {
                    var evaCount = parseInt(evaWrap.find(".evaCount").html());
                    if (r.iseva == 1) {
                        evaCount++;
                        evaWrap.find(".eva").addClass("eva_1");
                    } else {
                        evaCount--;
                        evaWrap.find(".eva").removeClass("eva_1");
                    }
                    evaWrap.find(".evaCount").html(evaCount);
                } else if (r.code == 1) {
                    location.href = "../../login.php?back=" + nov.backUrl;
                } else {
                    alert("操作失败！");
                }
            }
        });
    };
    //删除文件
    File.prototype.doDelete = function() {
        var bid = this.bid;
        var container = this.container;
        $.ajax({
            type: "POST",
            url: "../../../ajax.php",
            dataType: "text",
            data: {
                act: "deleteFile",
                bid: bid
            },
            success: function(r) {
                if (r == "1") {
                    container.hide("fast");
                } else {
                    alert("操作失败！");
                }
            }
        });
    };
});

define("custom/main/0.0.1/browse-debug", [ "jquery-debug", "custom/main/0.0.1/mod/selectWidget-debug", "custom/main/0.0.1/mod/inputVal-debug", "custom/main/0.0.1/mod/formCheck-debug", "custom/main/0.0.1/mod/file-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    //下拉框
    require("custom/main/0.0.1/mod/selectWidget-debug");
    $(".sele").each(function() {
        $(this).selectWidget();
    });
    //关键字搜索输入框
    var InputVal = require("custom/main/0.0.1/mod/inputVal-debug");
    var sbkey = new InputVal('input[name="sbkey"]', "请输入关键字");
    sbkey.init();
    //表单验证
    var fc = require("custom/main/0.0.1/mod/formCheck-debug");
    $("#filterForm").submit(function() {
        if (!fc.checkFilterForm()) {
            return false;
        }
    });
    $("#keyForm").submit(function() {
        if (!fc.checkKeyForm()) {
            return false;
        }
    });
    var File = require("custom/main/0.0.1/mod/file-debug");
    //喜欢
    $(".eva").click(function() {
        var liId = $(this).parents("li").attr("id");
        var bid = parseInt(liId.replace("nov_", ""));
        var f = new File(bid);
        f.doLike();
    });
    //删除文件
    $(".btnDelFile").click(function() {
        var liId = $(this).parents("li").attr("id");
        var bid = parseInt(liId.replace("nov_", ""));
        var f = new File(bid);
        f.doDelete();
    });
});

define("custom/main/0.0.1/mod/selectWidget-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    //js模拟下拉框
    $.fn.selectWidget = function(obj) {
        var $sele = $(this);
        var $text = $(this).children("span");
        var $hidden = $(this).children('input[type="hidden"]');
        var $menu = $(this).children("ul");
        var liHeight = $menu.children("li:eq(1)").outerHeight();
        if ($menu.children("li").length > 10) {
            $menu.height(liHeight * 10 - 1);
        }
        $text.mousedown(function() {
            showMenu();
        });
        $menu.find("li").click(function() {
            if ($(this).children("a").length == 0) {
                $text.html($(this).html());
                $hidden.val($(this).index());
            }
            $sele.removeClass("active");
            $(document).unbind("click", hideMenu);
        });
        var showMenu = function() {
            $(".sele").removeClass("active");
            $sele.addClass("active");
            $(document).bind("click", hideMenu);
        };
        var hideMenu = function(e) {
            var src = e ? e.target : e.srcElement;
            do {
                if ($(src).closest(".sele").length > 0) return;
                src = src.parentNode;
            } while (src.parentNode);
            $sele.removeClass("active");
            $(document).unbind("click", hideMenu);
        };
    };
    //初始化下拉框
    $.fn.selectInit = function(obj) {
        var $sele = $(this);
        var $text = $(this).children("span");
        var $hidden = $(this).children('input[type="hidden"]');
        var initVal = obj && obj.val ? obj.val : "0";
        var initStr = obj && obj.str ? obj.str : "-";
        $hidden.val(initVal);
        $text.html(initStr);
        $sele.selectWidget();
    };
});

//输入框友好提示
define("custom/main/0.0.1/mod/inputVal-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    function InputVal(container, tip) {
        this.container = $(container);
        this.tip = tip;
        this.initClass = "ini";
    }
    module.exports = InputVal;
    InputVal.prototype.init = function() {
        var container = this.container;
        var tip = this.tip;
        var initClass = this.initClass;
        if (container.val() == tip) {
            container.addClass(initClass);
        }
        container.focus(function() {
            container.removeClass(initClass);
            if (container.val() == tip) {
                container.val("");
            }
        });
        container.blur(function() {
            if (container.val() == "") {
                container.addClass(initClass).val(tip);
            }
        });
    };
});

//表单验证
define("custom/main/0.0.1/mod/formCheck-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    module.exports.checkKeyForm = function() {
        var sbkey = $('input[name="sbkey"]').val();
        if (sbkey == "请输入关键字" || sbkey == " ") {
            alert("请输入关键字");
            return false;
        }
        return true;
    };
    module.exports.checkFilterForm = function() {
        var isTrue = false;
        $('#filterForm .sele input[type="hidden"]').each(function(index, element) {
            if ($(element).val() != 0) {
                isTrue = true;
            }
        });
        if (isTrue) {
            return true;
        } else {
            alert("请选择筛选条件");
            return false;
        }
    };
    //upload and edit file
    module.exports.checkFileForm = function() {
        var bname = $('input[name="bname"]');
        var bauthor = $('input[name="bauthor"]');
        var btype = $('input[name="btype"]');
        var btags = $('input[name="btags[]"]:checked');
        if (!bname.val()) {
            $("#bnameTip").html("请填写书名").addClass("error").show();
            bname.focus(function() {
                $("#bnameTip").html("").removeClass("error").hide();
            });
            return false;
        }
        if (!bauthor.val()) {
            $("#bauthorTip").html("请填写作者").addClass("error").show();
            bauthor.focus(function() {
                $("#bauthorTip").html("").removeClass("error").hide();
            });
            return false;
        }
        if (btype.val() == 0) {
            $("#btypeTip").html("请选择分类").addClass("error").show();
            btype.next().mousedown(function() {
                $("#btypeTip").html("").removeClass("error").hide();
            });
            return false;
        }
        if (btags.length > 5) {
            $("#btagsTip").html("标签不能超过5个").addClass("error").show();
            btags.click(function() {
                $("#btagsTip").html("").removeClass("error").hide();
            });
            return false;
        }
        return true;
    };
});

define("custom/main/0.0.1/details-debug", [ "jquery-debug", "custom/main/0.0.1/mod/file-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var File = require("custom/main/0.0.1/mod/file-debug");
    //喜欢
    $(".eva").click(function() {
        var evaWrapId = $(this).parents(".heat").attr("id");
        var bid = parseInt(evaWrapId.replace("evaWrap_", ""));
        var f = new File(bid);
        f.doLike();
    });
});

define("custom/main/0.0.1/upload-debug", [ "jquery-debug", "custom/main/0.0.1/mod/verifyAtta-debug", "custom/main/0.0.1/lib/jqueryForm-debug", "custom/main/0.0.1/mod/selectWidget-debug", "custom/main/0.0.1/mod/formCheck-debug" ], function(require, exports, modulselectWidgete) {
    var $ = require("jquery-debug");
    //点击Choose File按钮回复原始状态
    $("#attachment").mousedown(function() {
        $(".sucDone, .failDone").hide();
    });
    //选择文件后验证上传到temp目录中
    var VerifyAtta = require("custom/main/0.0.1/mod/verifyAtta-debug");
    $("#attachment").change(function() {
        var va = new VerifyAtta();
        va.verify();
    });
    //下拉框
    require("custom/main/0.0.1/mod/selectWidget-debug");
    $(".sele").each(function() {
        $(this).selectWidget();
    });
    //填写简介后消除空行
    $('textarea[name="bsummary"]').blur(function() {
        var elem = $(this);
        var str = elem.val().replace(/\n\s*/g, "\n");
        str = str.replace(/\n{2,}/g, "\n");
        elem.val(str);
    });
    //上传和编辑页面表单验证
    var FormCheck = require("custom/main/0.0.1/mod/formCheck-debug");
    $("#uploadForm, #editForm").submit(function() {
        if (!FormCheck.checkFileForm()) {
            return false;
        }
    });
});

define("custom/main/0.0.1/mod/verifyAtta-debug", [ "jquery-debug", "custom/main/0.0.1/lib/jqueryForm-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    function VerifyAtta() {}
    module.exports = VerifyAtta;
    VerifyAtta.prototype.verify = function() {
        if ($("#attachment").val() == "") {
            $("#attaInfo").removeClass("suc").addClass("error").html("请选择文件").show();
            $("#uploadForm table").hide();
            return false;
        }
        var options = {
            type: "POST",
            url: "../../../upload.php",
            dataType: "json",
            success: function(r) {
                if (r.code == 0) {
                    $("#attaInfo").removeClass("error").addClass("suc").html(r.msg).show();
                    $('input[name="bname"]').val(r.bname);
                    $('input[name="bauthor"]').val(r.bauthor);
                    $('input[name="bformat"]').val(r.bformat);
                    $('input[name="bsize"]').val(r.bsize);
                    $('input[name="bpath"]').val(r.bpath);
                    $("#uploadForm table").show();
                } else {
                    $("#attaInfo").removeClass("suc").addClass("error").html(r.msg).show();
                    $("#uploadForm table").hide();
                }
            }
        };
        $("#attaForm").ajaxSubmit(options);
    };
});

define("custom/main/0.0.1/lib/jqueryForm-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    (function($) {
        "use strict";
        /*
		Usage Note:
		-----------
		Do not use both ajaxSubmit and ajaxForm on the same form.  These
		functions are mutually exclusive.  Use ajaxSubmit if you want
		to bind your own submit handler to the form.  For example,

		$(document).ready(function() {
			$('#myForm').on('submit', function(e) {
				e.preventDefault(); // <-- important
				$(this).ajaxSubmit({
					target: '#output'
				});
			});
		});

		Use ajaxForm when you want the plugin to manage all the event binding
		for you.  For example,

		$(document).ready(function() {
			$('#myForm').ajaxForm({
				target: '#output'
			});
		});

		You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
		form does not have to exist when you invoke ajaxForm:

		$('#myForm').ajaxForm({
			delegation: true,
			target: '#output'
		});

		When using ajaxForm, the ajaxSubmit function will be invoked for you
		at the appropriate time.
	*/
        /**
	 * Feature detection
	 */
        var feature = {};
        feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
        feature.formdata = window.FormData !== undefined;
        var hasProp = !!$.fn.prop;
        // attr2 uses prop when it can but checks the return type for
        // an expected string.  this accounts for the case where a form 
        // contains inputs with names like "action" or "method"; in those
        // cases "prop" returns the element
        $.fn.attr2 = function() {
            if (!hasProp) return this.attr.apply(this, arguments);
            var val = this.prop.apply(this, arguments);
            if (val && val.jquery || typeof val === "string") return val;
            return this.attr.apply(this, arguments);
        };
        /**
	 * ajaxSubmit() provides a mechanism for immediately submitting
	 * an HTML form using AJAX.
	 */
        $.fn.ajaxSubmit = function(options) {
            /*jshint scripturl:true */
            // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
            if (!this.length) {
                log("ajaxSubmit: skipping submit process - no element selected");
                return this;
            }
            var method, action, url, $form = this;
            if (typeof options == "function") {
                options = {
                    success: options
                };
            } else if (options === undefined) {
                options = {};
            }
            method = options.type || this.attr2("method");
            action = options.url || this.attr2("action");
            url = typeof action === "string" ? $.trim(action) : "";
            url = url || window.location.href || "";
            if (url) {
                // clean url (don't include hash vaue)
                url = (url.match(/^([^#]+)/) || [])[1];
            }
            options = $.extend(true, {
                url: url,
                success: $.ajaxSettings.success,
                type: method || $.ajaxSettings.type,
                iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
            }, options);
            // hook for manipulating the form data before it is extracted;
            // convenient for use with rich editors like tinyMCE or FCKEditor
            var veto = {};
            this.trigger("form-pre-serialize", [ this, options, veto ]);
            if (veto.veto) {
                log("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
                return this;
            }
            // provide opportunity to alter form data before it is serialized
            if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
                log("ajaxSubmit: submit aborted via beforeSerialize callback");
                return this;
            }
            var traditional = options.traditional;
            if (traditional === undefined) {
                traditional = $.ajaxSettings.traditional;
            }
            var elements = [];
            var qx, a = this.formToArray(options.semantic, elements);
            if (options.data) {
                options.extraData = options.data;
                qx = $.param(options.data, traditional);
            }
            // give pre-submit callback an opportunity to abort the submit
            if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
                log("ajaxSubmit: submit aborted via beforeSubmit callback");
                return this;
            }
            // fire vetoable 'validate' event
            this.trigger("form-submit-validate", [ a, this, options, veto ]);
            if (veto.veto) {
                log("ajaxSubmit: submit vetoed via form-submit-validate trigger");
                return this;
            }
            var q = $.param(a, traditional);
            if (qx) {
                q = q ? q + "&" + qx : qx;
            }
            if (options.type.toUpperCase() == "GET") {
                options.url += (options.url.indexOf("?") >= 0 ? "&" : "?") + q;
                options.data = null;
            } else {
                options.data = q;
            }
            var callbacks = [];
            if (options.resetForm) {
                callbacks.push(function() {
                    $form.resetForm();
                });
            }
            if (options.clearForm) {
                callbacks.push(function() {
                    $form.clearForm(options.includeHidden);
                });
            }
            // perform a load on the target only if dataType is not provided
            if (!options.dataType && options.target) {
                var oldSuccess = options.success || function() {};
                callbacks.push(function(data) {
                    var fn = options.replaceTarget ? "replaceWith" : "html";
                    $(options.target)[fn](data).each(oldSuccess, arguments);
                });
            } else if (options.success) {
                callbacks.push(options.success);
            }
            options.success = function(data, status, xhr) {
                // jQuery 1.4+ passes xhr as 3rd arg
                var context = options.context || this;
                // jQuery 1.4+ supports scope context
                for (var i = 0, max = callbacks.length; i < max; i++) {
                    callbacks[i].apply(context, [ data, status, xhr || $form, $form ]);
                }
            };
            if (options.error) {
                var oldError = options.error;
                options.error = function(xhr, status, error) {
                    var context = options.context || this;
                    oldError.apply(context, [ xhr, status, error, $form ]);
                };
            }
            if (options.complete) {
                var oldComplete = options.complete;
                options.complete = function(xhr, status) {
                    var context = options.context || this;
                    oldComplete.apply(context, [ xhr, status, $form ]);
                };
            }
            // are there files to upload?
            // [value] (issue #113), also see comment:
            // https://github.com/malsup/form/commit/588306aedba1de01388032d5f42a60159eea9228#commitcomment-2180219
            var fileInputs = $("input[type=file]:enabled", this).filter(function() {
                return $(this).val() !== "";
            });
            var hasFileInputs = fileInputs.length > 0;
            var mp = "multipart/form-data";
            var multipart = $form.attr("enctype") == mp || $form.attr("encoding") == mp;
            var fileAPI = feature.fileapi && feature.formdata;
            log("fileAPI :" + fileAPI);
            var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;
            var jqxhr;
            // options.iframe allows user to force iframe mode
            // 06-NOV-09: now defaulting to iframe mode if file input is detected
            if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
                // hack to fix Safari hang (thanks to Tim Molendijk for this)
                // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
                if (options.closeKeepAlive) {
                    $.get(options.closeKeepAlive, function() {
                        jqxhr = fileUploadIframe(a);
                    });
                } else {
                    jqxhr = fileUploadIframe(a);
                }
            } else if ((hasFileInputs || multipart) && fileAPI) {
                jqxhr = fileUploadXhr(a);
            } else {
                jqxhr = $.ajax(options);
            }
            $form.removeData("jqxhr").data("jqxhr", jqxhr);
            // clear element array
            for (var k = 0; k < elements.length; k++) elements[k] = null;
            // fire 'notify' event
            this.trigger("form-submit-notify", [ this, options ]);
            return this;
            // utility fn for deep serialization
            function deepSerialize(extraData) {
                var serialized = $.param(extraData, options.traditional).split("&");
                var len = serialized.length;
                var result = [];
                var i, part;
                for (i = 0; i < len; i++) {
                    // #252; undo param space replacement
                    serialized[i] = serialized[i].replace(/\+/g, " ");
                    part = serialized[i].split("=");
                    // #278; use array instead of object storage, favoring array serializations
                    result.push([ decodeURIComponent(part[0]), decodeURIComponent(part[1]) ]);
                }
                return result;
            }
            // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
            function fileUploadXhr(a) {
                var formdata = new FormData();
                for (var i = 0; i < a.length; i++) {
                    formdata.append(a[i].name, a[i].value);
                }
                if (options.extraData) {
                    var serializedData = deepSerialize(options.extraData);
                    for (i = 0; i < serializedData.length; i++) if (serializedData[i]) formdata.append(serializedData[i][0], serializedData[i][1]);
                }
                options.data = null;
                var s = $.extend(true, {}, $.ajaxSettings, options, {
                    contentType: false,
                    processData: false,
                    cache: false,
                    type: method || "POST"
                });
                if (options.uploadProgress) {
                    // workaround because jqXHR does not expose upload property
                    s.xhr = function() {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.addEventListener("progress", function(event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                /*event.position is deprecated*/
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                }
                                options.uploadProgress(event, position, total, percent);
                            }, false);
                        }
                        return xhr;
                    };
                }
                s.data = null;
                var beforeSend = s.beforeSend;
                s.beforeSend = function(xhr, o) {
                    //Send FormData() provided by user
                    if (options.formData) o.data = options.formData; else o.data = formdata;
                    if (beforeSend) beforeSend.call(this, xhr, o);
                };
                return $.ajax(s);
            }
            // private function for handling file uploads (hat tip to YAHOO!)
            function fileUploadIframe(a) {
                var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
                var deferred = $.Deferred();
                // #341
                deferred.abort = function(status) {
                    xhr.abort(status);
                };
                if (a) {
                    // ensure that every serialized input is still enabled
                    for (i = 0; i < elements.length; i++) {
                        el = $(elements[i]);
                        if (hasProp) el.prop("disabled", false); else el.removeAttr("disabled");
                    }
                }
                s = $.extend(true, {}, $.ajaxSettings, options);
                s.context = s.context || s;
                id = "jqFormIO" + new Date().getTime();
                if (s.iframeTarget) {
                    $io = $(s.iframeTarget);
                    n = $io.attr2("name");
                    if (!n) $io.attr2("name", id); else id = n;
                } else {
                    $io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
                    $io.css({
                        position: "absolute",
                        top: "-1000px",
                        left: "-1000px"
                    });
                }
                io = $io[0];
                xhr = {
                    // mock object
                    aborted: 0,
                    responseText: null,
                    responseXML: null,
                    status: 0,
                    statusText: "n/a",
                    getAllResponseHeaders: function() {},
                    getResponseHeader: function() {},
                    setRequestHeader: function() {},
                    abort: function(status) {
                        var e = status === "timeout" ? "timeout" : "aborted";
                        log("aborting upload... " + e);
                        this.aborted = 1;
                        try {
                            // #214, #257
                            if (io.contentWindow.document.execCommand) {
                                io.contentWindow.document.execCommand("Stop");
                            }
                        } catch (ignore) {}
                        $io.attr("src", s.iframeSrc);
                        // abort op in progress
                        xhr.error = e;
                        if (s.error) s.error.call(s.context, xhr, e, status);
                        if (g) $.event.trigger("ajaxError", [ xhr, s, e ]);
                        if (s.complete) s.complete.call(s.context, xhr, e);
                    }
                };
                g = s.global;
                // trigger ajax global events so that activity/block indicators work like normal
                if (g && 0 === $.active++) {
                    $.event.trigger("ajaxStart");
                }
                if (g) {
                    $.event.trigger("ajaxSend", [ xhr, s ]);
                }
                if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
                    if (s.global) {
                        $.active--;
                    }
                    deferred.reject();
                    return deferred;
                }
                if (xhr.aborted) {
                    deferred.reject();
                    return deferred;
                }
                // add submitting element to data if we know it
                sub = form.clk;
                if (sub) {
                    n = sub.name;
                    if (n && !sub.disabled) {
                        s.extraData = s.extraData || {};
                        s.extraData[n] = sub.value;
                        if (sub.type == "image") {
                            s.extraData[n + ".x"] = form.clk_x;
                            s.extraData[n + ".y"] = form.clk_y;
                        }
                    }
                }
                var CLIENT_TIMEOUT_ABORT = 1;
                var SERVER_ABORT = 2;
                function getDoc(frame) {
                    /* it looks like contentWindow or contentDocument do not
				 * carry the protocol property in ie8, when running under ssl
				 * frame.document is the only valid response document, since
				 * the protocol is know but not on the other two objects. strange?
				 * "Same origin policy" http://en.wikipedia.org/wiki/Same_origin_policy
				 */
                    var doc = null;
                    // IE8 cascading access check
                    try {
                        if (frame.contentWindow) {
                            doc = frame.contentWindow.document;
                        }
                    } catch (err) {
                        // IE8 access denied under ssl & missing protocol
                        log("cannot get iframe.contentWindow document: " + err);
                    }
                    if (doc) {
                        // successful getting content
                        return doc;
                    }
                    try {
                        // simply checking may throw in ie8 under ssl or mismatched protocol
                        doc = frame.contentDocument ? frame.contentDocument : frame.document;
                    } catch (err) {
                        // last attempt
                        log("cannot get iframe.contentDocument: " + err);
                        doc = frame.document;
                    }
                    return doc;
                }
                // Rails CSRF hack (thanks to Yvan Barthelemy)
                var csrf_token = $("meta[name=csrf-token]").attr("content");
                var csrf_param = $("meta[name=csrf-param]").attr("content");
                if (csrf_param && csrf_token) {
                    s.extraData = s.extraData || {};
                    s.extraData[csrf_param] = csrf_token;
                }
                // take a breath so that pending repaints get some cpu time before the upload starts
                function doSubmit() {
                    // make sure form attrs are set
                    var t = $form.attr2("target"), a = $form.attr2("action");
                    // update form attrs in IE friendly way
                    form.setAttribute("target", id);
                    if (!method || /post/i.test(method)) {
                        form.setAttribute("method", "POST");
                    }
                    if (a != s.url) {
                        form.setAttribute("action", s.url);
                    }
                    // ie borks in some cases when setting encoding
                    if (!s.skipEncodingOverride && (!method || /post/i.test(method))) {
                        $form.attr({
                            encoding: "multipart/form-data",
                            enctype: "multipart/form-data"
                        });
                    }
                    // support timout
                    if (s.timeout) {
                        timeoutHandle = setTimeout(function() {
                            timedOut = true;
                            cb(CLIENT_TIMEOUT_ABORT);
                        }, s.timeout);
                    }
                    // look for server aborts
                    function checkState() {
                        try {
                            var state = getDoc(io).readyState;
                            log("state = " + state);
                            if (state && state.toLowerCase() == "uninitialized") setTimeout(checkState, 50);
                        } catch (e) {
                            log("Server abort: ", e, " (", e.name, ")");
                            cb(SERVER_ABORT);
                            if (timeoutHandle) clearTimeout(timeoutHandle);
                            timeoutHandle = undefined;
                        }
                    }
                    // add "extra" data to form if provided in options
                    var extraInputs = [];
                    try {
                        if (s.extraData) {
                            for (var n in s.extraData) {
                                if (s.extraData.hasOwnProperty(n)) {
                                    // if using the $.param format that allows for multiple values with the same name
                                    if ($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty("name") && s.extraData[n].hasOwnProperty("value")) {
                                        extraInputs.push($('<input type="hidden" name="' + s.extraData[n].name + '">').val(s.extraData[n].value).appendTo(form)[0]);
                                    } else {
                                        extraInputs.push($('<input type="hidden" name="' + n + '">').val(s.extraData[n]).appendTo(form)[0]);
                                    }
                                }
                            }
                        }
                        if (!s.iframeTarget) {
                            // add iframe to doc and submit the form
                            $io.appendTo("body");
                        }
                        if (io.attachEvent) io.attachEvent("onload", cb); else io.addEventListener("load", cb, false);
                        setTimeout(checkState, 15);
                        try {
                            form.submit();
                        } catch (err) {
                            // just in case form has element with name/id of 'submit'
                            var submitFn = document.createElement("form").submit;
                            submitFn.apply(form);
                        }
                    } finally {
                        // reset attrs and remove "extra" input elements
                        form.setAttribute("action", a);
                        if (t) {
                            form.setAttribute("target", t);
                        } else {
                            $form.removeAttr("target");
                        }
                        $(extraInputs).remove();
                    }
                }
                if (s.forceSync) {
                    doSubmit();
                } else {
                    setTimeout(doSubmit, 10);
                }
                var data, doc, domCheckCount = 50, callbackProcessed;
                function cb(e) {
                    if (xhr.aborted || callbackProcessed) {
                        return;
                    }
                    doc = getDoc(io);
                    if (!doc) {
                        log("cannot access response document");
                        e = SERVER_ABORT;
                    }
                    if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                        xhr.abort("timeout");
                        deferred.reject(xhr, "timeout");
                        return;
                    } else if (e == SERVER_ABORT && xhr) {
                        xhr.abort("server abort");
                        deferred.reject(xhr, "error", "server abort");
                        return;
                    }
                    if (!doc || doc.location.href == s.iframeSrc) {
                        // response not received yet
                        if (!timedOut) return;
                    }
                    if (io.detachEvent) io.detachEvent("onload", cb); else io.removeEventListener("load", cb, false);
                    var status = "success", errMsg;
                    try {
                        if (timedOut) {
                            throw "timeout";
                        }
                        var isXml = s.dataType == "xml" || doc.XMLDocument || $.isXMLDoc(doc);
                        log("isXml=" + isXml);
                        if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                            if (--domCheckCount) {
                                // in some browsers (Opera) the iframe DOM is not always traversable when
                                // the onload callback fires, so we loop a bit to accommodate
                                log("requeing onLoad callback, DOM not available");
                                setTimeout(cb, 250);
                                return;
                            }
                        }
                        //log('response detected');
                        var docRoot = doc.body ? doc.body : doc.documentElement;
                        xhr.responseText = docRoot ? docRoot.innerHTML : null;
                        xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                        if (isXml) s.dataType = "xml";
                        xhr.getResponseHeader = function(header) {
                            var headers = {
                                "content-type": s.dataType
                            };
                            return headers[header.toLowerCase()];
                        };
                        // support for XHR 'status' & 'statusText' emulation :
                        if (docRoot) {
                            xhr.status = Number(docRoot.getAttribute("status")) || xhr.status;
                            xhr.statusText = docRoot.getAttribute("statusText") || xhr.statusText;
                        }
                        var dt = (s.dataType || "").toLowerCase();
                        var scr = /(json|script|text)/.test(dt);
                        if (scr || s.textarea) {
                            // see if user embedded response in textarea
                            var ta = doc.getElementsByTagName("textarea")[0];
                            if (ta) {
                                xhr.responseText = ta.value;
                                // support for XHR 'status' & 'statusText' emulation :
                                xhr.status = Number(ta.getAttribute("status")) || xhr.status;
                                xhr.statusText = ta.getAttribute("statusText") || xhr.statusText;
                            } else if (scr) {
                                // account for browsers injecting pre around json response
                                var pre = doc.getElementsByTagName("pre")[0];
                                var b = doc.getElementsByTagName("body")[0];
                                if (pre) {
                                    xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                                } else if (b) {
                                    xhr.responseText = b.textContent ? b.textContent : b.innerText;
                                }
                            }
                        } else if (dt == "xml" && !xhr.responseXML && xhr.responseText) {
                            xhr.responseXML = toXml(xhr.responseText);
                        }
                        try {
                            data = httpData(xhr, dt, s);
                        } catch (err) {
                            status = "parsererror";
                            xhr.error = errMsg = err || status;
                        }
                    } catch (err) {
                        log("error caught: ", err);
                        status = "error";
                        xhr.error = errMsg = err || status;
                    }
                    if (xhr.aborted) {
                        log("upload aborted");
                        status = null;
                    }
                    if (xhr.status) {
                        // we've set xhr.status
                        status = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 ? "success" : "error";
                    }
                    // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
                    if (status === "success") {
                        if (s.success) s.success.call(s.context, data, "success", xhr);
                        deferred.resolve(xhr.responseText, "success", xhr);
                        if (g) $.event.trigger("ajaxSuccess", [ xhr, s ]);
                    } else if (status) {
                        if (errMsg === undefined) errMsg = xhr.statusText;
                        if (s.error) s.error.call(s.context, xhr, status, errMsg);
                        deferred.reject(xhr, "error", errMsg);
                        if (g) $.event.trigger("ajaxError", [ xhr, s, errMsg ]);
                    }
                    if (g) $.event.trigger("ajaxComplete", [ xhr, s ]);
                    if (g && !--$.active) {
                        $.event.trigger("ajaxStop");
                    }
                    if (s.complete) s.complete.call(s.context, xhr, status);
                    callbackProcessed = true;
                    if (s.timeout) clearTimeout(timeoutHandle);
                    // clean up
                    setTimeout(function() {
                        if (!s.iframeTarget) $io.remove(); else //adding else to clean up existing iframe response.
                        $io.attr("src", s.iframeSrc);
                        xhr.responseXML = null;
                    }, 100);
                }
                var toXml = $.parseXML || function(s, doc) {
                    // use parseXML if available (jQuery 1.5+)
                    if (window.ActiveXObject) {
                        doc = new ActiveXObject("Microsoft.XMLDOM");
                        doc.async = "false";
                        doc.loadXML(s);
                    } else {
                        doc = new DOMParser().parseFromString(s, "text/xml");
                    }
                    return doc && doc.documentElement && doc.documentElement.nodeName != "parsererror" ? doc : null;
                };
                var parseJSON = $.parseJSON || function(s) {
                    /*jslint evil:true */
                    return window["eval"]("(" + s + ")");
                };
                var httpData = function(xhr, type, s) {
                    // mostly lifted from jq1.4.4
                    var ct = xhr.getResponseHeader("content-type") || "", xml = type === "xml" || !type && ct.indexOf("xml") >= 0, data = xml ? xhr.responseXML : xhr.responseText;
                    if (xml && data.documentElement.nodeName === "parsererror") {
                        if ($.error) $.error("parsererror");
                    }
                    if (s && s.dataFilter) {
                        data = s.dataFilter(data, type);
                    }
                    if (typeof data === "string") {
                        if (type === "json" || !type && ct.indexOf("json") >= 0) {
                            data = parseJSON(data);
                        } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                            $.globalEval(data);
                        }
                    }
                    return data;
                };
                return deferred;
            }
        };
        /**
	 * ajaxForm() provides a mechanism for fully automating form submission.
	 *
	 * The advantages of using this method instead of ajaxSubmit() are:
	 *
	 * 1: This method will include coordinates for <input type="image" /> elements (if the element
	 *    is used to submit the form).
	 * 2. This method will include the submit element's name/value data (for the element that was
	 *    used to submit the form).
	 * 3. This method binds the submit() method to the form for you.
	 *
	 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
	 * passes the options argument along after properly binding events for submit elements and
	 * the form itself.
	 */
        $.fn.ajaxForm = function(options) {
            options = options || {};
            options.delegation = options.delegation && $.isFunction($.fn.on);
            // in jQuery 1.3+ we can fix mistakes with the ready state
            if (!options.delegation && this.length === 0) {
                var o = {
                    s: this.selector,
                    c: this.context
                };
                if (!$.isReady && o.s) {
                    log("DOM not ready, queuing ajaxForm");
                    $(function() {
                        $(o.s, o.c).ajaxForm(options);
                    });
                    return this;
                }
                // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
                log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
                return this;
            }
            if (options.delegation) {
                $(document).off("submit.form-plugin", this.selector, doAjaxSubmit).off("click.form-plugin", this.selector, captureSubmittingElement).on("submit.form-plugin", this.selector, options, doAjaxSubmit).on("click.form-plugin", this.selector, options, captureSubmittingElement);
                return this;
            }
            return this.ajaxFormUnbind().bind("submit.form-plugin", options, doAjaxSubmit).bind("click.form-plugin", options, captureSubmittingElement);
        };
        // private event handlers
        function doAjaxSubmit(e) {
            /*jshint validthis:true */
            var options = e.data;
            if (!e.isDefaultPrevented()) {
                // if event has been canceled, don't proceed
                e.preventDefault();
                $(e.target).ajaxSubmit(options);
            }
        }
        function captureSubmittingElement(e) {
            /*jshint validthis:true */
            var target = e.target;
            var $el = $(target);
            if (!$el.is("[type=submit],[type=image]")) {
                // is this a child element of the submit el?  (ex: a span within a button)
                var t = $el.closest("[type=submit]");
                if (t.length === 0) {
                    return;
                }
                target = t[0];
            }
            var form = this;
            form.clk = target;
            if (target.type == "image") {
                if (e.offsetX !== undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY;
                } else if (typeof $.fn.offset == "function") {
                    var offset = $el.offset();
                    form.clk_x = e.pageX - offset.left;
                    form.clk_y = e.pageY - offset.top;
                } else {
                    form.clk_x = e.pageX - target.offsetLeft;
                    form.clk_y = e.pageY - target.offsetTop;
                }
            }
            // clear form vars
            setTimeout(function() {
                form.clk = form.clk_x = form.clk_y = null;
            }, 100);
        }
        // ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
        $.fn.ajaxFormUnbind = function() {
            return this.unbind("submit.form-plugin click.form-plugin");
        };
        /**
	 * formToArray() gathers form element data into an array of objects that can
	 * be passed to any of the following ajax functions: $.get, $.post, or load.
	 * Each object in the array has both a 'name' and 'value' property.  An example of
	 * an array for a simple login form might be:
	 *
	 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
	 *
	 * It is this array that is passed to pre-submit callback functions provided to the
	 * ajaxSubmit() and ajaxForm() methods.
	 */
        $.fn.formToArray = function(semantic, elements) {
            var a = [];
            if (this.length === 0) {
                return a;
            }
            var form = this[0];
            var els = semantic ? form.getElementsByTagName("*") : form.elements;
            if (!els) {
                return a;
            }
            var i, j, n, v, el, max, jmax;
            for (i = 0, max = els.length; i < max; i++) {
                el = els[i];
                n = el.name;
                if (!n || el.disabled) {
                    continue;
                }
                if (semantic && form.clk && el.type == "image") {
                    // handle image inputs on the fly when semantic == true
                    if (form.clk == el) {
                        a.push({
                            name: n,
                            value: $(el).val(),
                            type: el.type
                        });
                        a.push({
                            name: n + ".x",
                            value: form.clk_x
                        }, {
                            name: n + ".y",
                            value: form.clk_y
                        });
                    }
                    continue;
                }
                v = $.fieldValue(el, true);
                if (v && v.constructor == Array) {
                    if (elements) elements.push(el);
                    for (j = 0, jmax = v.length; j < jmax; j++) {
                        a.push({
                            name: n,
                            value: v[j]
                        });
                    }
                } else if (feature.fileapi && el.type == "file") {
                    if (elements) elements.push(el);
                    var files = el.files;
                    if (files.length) {
                        for (j = 0; j < files.length; j++) {
                            a.push({
                                name: n,
                                value: files[j],
                                type: el.type
                            });
                        }
                    } else {
                        // #180
                        a.push({
                            name: n,
                            value: "",
                            type: el.type
                        });
                    }
                } else if (v !== null && typeof v != "undefined") {
                    if (elements) elements.push(el);
                    a.push({
                        name: n,
                        value: v,
                        type: el.type,
                        required: el.required
                    });
                }
            }
            if (!semantic && form.clk) {
                // input type=='image' are not found in elements array! handle it here
                var $input = $(form.clk), input = $input[0];
                n = input.name;
                if (n && !input.disabled && input.type == "image") {
                    a.push({
                        name: n,
                        value: $input.val()
                    });
                    a.push({
                        name: n + ".x",
                        value: form.clk_x
                    }, {
                        name: n + ".y",
                        value: form.clk_y
                    });
                }
            }
            return a;
        };
        /**
	 * Serializes form data into a 'submittable' string. This method will return a string
	 * in the format: name1=value1&amp;name2=value2
	 */
        $.fn.formSerialize = function(semantic) {
            //hand off to jQuery.param for proper encoding
            return $.param(this.formToArray(semantic));
        };
        /**
	 * Serializes all field elements in the jQuery object into a query string.
	 * This method will return a string in the format: name1=value1&amp;name2=value2
	 */
        $.fn.fieldSerialize = function(successful) {
            var a = [];
            this.each(function() {
                var n = this.name;
                if (!n) {
                    return;
                }
                var v = $.fieldValue(this, successful);
                if (v && v.constructor == Array) {
                    for (var i = 0, max = v.length; i < max; i++) {
                        a.push({
                            name: n,
                            value: v[i]
                        });
                    }
                } else if (v !== null && typeof v != "undefined") {
                    a.push({
                        name: this.name,
                        value: v
                    });
                }
            });
            //hand off to jQuery.param for proper encoding
            return $.param(a);
        };
        /**
	 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
	 *
	 *  <form><fieldset>
	 *      <input name="A" type="text" />
	 *      <input name="A" type="text" />
	 *      <input name="B" type="checkbox" value="B1" />
	 *      <input name="B" type="checkbox" value="B2"/>
	 *      <input name="C" type="radio" value="C1" />
	 *      <input name="C" type="radio" value="C2" />
	 *  </fieldset></form>
	 *
	 *  var v = $('input[type=text]').fieldValue();
	 *  // if no values are entered into the text inputs
	 *  v == ['','']
	 *  // if values entered into the text inputs are 'foo' and 'bar'
	 *  v == ['foo','bar']
	 *
	 *  var v = $('input[type=checkbox]').fieldValue();
	 *  // if neither checkbox is checked
	 *  v === undefined
	 *  // if both checkboxes are checked
	 *  v == ['B1', 'B2']
	 *
	 *  var v = $('input[type=radio]').fieldValue();
	 *  // if neither radio is checked
	 *  v === undefined
	 *  // if first radio is checked
	 *  v == ['C1']
	 *
	 * The successful argument controls whether or not the field element must be 'successful'
	 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
	 * The default value of the successful argument is true.  If this value is false the value(s)
	 * for each element is returned.
	 *
	 * Note: This method *always* returns an array.  If no valid value can be determined the
	 *    array will be empty, otherwise it will contain one or more values.
	 */
        $.fn.fieldValue = function(successful) {
            for (var val = [], i = 0, max = this.length; i < max; i++) {
                var el = this[i];
                var v = $.fieldValue(el, successful);
                if (v === null || typeof v == "undefined" || v.constructor == Array && !v.length) {
                    continue;
                }
                if (v.constructor == Array) $.merge(val, v); else val.push(v);
            }
            return val;
        };
        /**
	 * Returns the value of the field element.
	 */
        $.fieldValue = function(el, successful) {
            var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
            if (successful === undefined) {
                successful = true;
            }
            if (successful && (!n || el.disabled || t == "reset" || t == "button" || (t == "checkbox" || t == "radio") && !el.checked || (t == "submit" || t == "image") && el.form && el.form.clk != el || tag == "select" && el.selectedIndex == -1)) {
                return null;
            }
            if (tag == "select") {
                var index = el.selectedIndex;
                if (index < 0) {
                    return null;
                }
                var a = [], ops = el.options;
                var one = t == "select-one";
                var max = one ? index + 1 : ops.length;
                for (var i = one ? index : 0; i < max; i++) {
                    var op = ops[i];
                    if (op.selected) {
                        var v = op.value;
                        if (!v) {
                            // extra pain for IE...
                            v = op.attributes && op.attributes["value"] && !op.attributes["value"].specified ? op.text : op.value;
                        }
                        if (one) {
                            return v;
                        }
                        a.push(v);
                    }
                }
                return a;
            }
            return $(el).val();
        };
        /**
	 * Clears the form data.  Takes the following actions on the form's input fields:
	 *  - input text fields will have their 'value' property set to the empty string
	 *  - select elements will have their 'selectedIndex' property set to -1
	 *  - checkbox and radio inputs will have their 'checked' property set to false
	 *  - inputs of type submit, button, reset, and hidden will *not* be effected
	 *  - button elements will *not* be effected
	 */
        $.fn.clearForm = function(includeHidden) {
            return this.each(function() {
                $("input,select,textarea", this).clearFields(includeHidden);
            });
        };
        /**
	 * Clears the selected form elements.
	 */
        $.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
            var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
            // 'hidden' is not in this list
            return this.each(function() {
                var t = this.type, tag = this.tagName.toLowerCase();
                if (re.test(t) || tag == "textarea") {
                    this.value = "";
                } else if (t == "checkbox" || t == "radio") {
                    this.checked = false;
                } else if (tag == "select") {
                    this.selectedIndex = -1;
                } else if (t == "file") {
                    if (/MSIE/.test(navigator.userAgent)) {
                        $(this).replaceWith($(this).clone(true));
                    } else {
                        $(this).val("");
                    }
                } else if (includeHidden) {
                    // includeHidden can be the value true, or it can be a selector string
                    // indicating a special test; for example:
                    //  $('#myForm').clearForm('.special:hidden')
                    // the above would clean hidden inputs that have the class of 'special'
                    if (includeHidden === true && /hidden/.test(t) || typeof includeHidden == "string" && $(this).is(includeHidden)) this.value = "";
                }
            });
        };
        /**
	 * Resets the form data.  Causes all form elements to be reset to their original value.
	 */
        $.fn.resetForm = function() {
            return this.each(function() {
                // guard against an input with the name of 'reset'
                // note that IE reports the reset function as an 'object'
                if (typeof this.reset == "function" || typeof this.reset == "object" && !this.reset.nodeType) {
                    this.reset();
                }
            });
        };
        /**
	 * Enables or disables any matching elements.
	 */
        $.fn.enable = function(b) {
            if (b === undefined) {
                b = true;
            }
            return this.each(function() {
                this.disabled = !b;
            });
        };
        /**
	 * Checks/unchecks any matching checkboxes or radio buttons and
	 * selects/deselects and matching option elements.
	 */
        $.fn.selected = function(select) {
            if (select === undefined) {
                select = true;
            }
            return this.each(function() {
                var t = this.type;
                if (t == "checkbox" || t == "radio") {
                    this.checked = select;
                } else if (this.tagName.toLowerCase() == "option") {
                    var $sel = $(this).parent("select");
                    if (select && $sel[0] && $sel[0].type == "select-one") {
                        // deselect all other options
                        $sel.find("option").selected(false);
                    }
                    this.selected = select;
                }
            });
        };
        // expose debug var
        $.fn.ajaxSubmit.debug = false;
        // helper fn for console logging
        function log() {
            if (!$.fn.ajaxSubmit.debug) return;
            var msg = "[jquery.form] " + Array.prototype.join.call(arguments, "");
            if (window.console && window.console.log) {
                window.console.log(msg);
            } else if (window.opera && window.opera.postError) {
                window.opera.postError(msg);
            }
        }
    })(typeof jQuery != "undefined" ? jQuery : window.Zepto);
});

define("custom/main/0.0.1/batchUpload-debug", [ "jquery-debug", "custom/main/0.0.1/mod/batch-debug", "custom/main/0.0.1/lib/jqueryForm-debug", "custom/main/0.0.1/mod/selectWidget-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var Batch = require("custom/main/0.0.1/mod/batch-debug");
    var bu = new Batch();
    $("#btnVerifyDir").click(function() {
        bu.verifyDir();
    });
    $("#buForm").submit(function() {
        bu.doBatchUpload();
        return false;
    });
});

define("custom/main/0.0.1/mod/batch-debug", [ "jquery-debug", "custom/main/0.0.1/lib/jqueryForm-debug", "custom/main/0.0.1/mod/selectWidget-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    require("custom/main/0.0.1/mod/selectWidget-debug");
    function Batch() {}
    module.exports = Batch;
    Batch.prototype.showLoading = function(str) {
        $(".main_form").append('<div class="fileList"><img src="themes/default/images/loading.gif" width="16" height="16" class="loading">' + str + "</div>");
    };
    Batch.prototype.hideLoading = function() {
        $("img.loading").parent().remove();
    };
    Batch.prototype.verifyDir = function() {
        var bu = this;
        $('input[name="btype"]').parent().selectInit();
        $(".batchOption").hide();
        $(".fileList").remove();
        var dir = $("#dir").val();
        if (!dir) {
            $("#dir").focus();
            return false;
        } else {
            $.ajax({
                type: "POST",
                url: "../../../batchUpload.php",
                dataType: "json",
                data: {
                    act: "verifyDir",
                    dir: dir
                },
                beforeSend: function() {
                    bu.showLoading("正在验证目录，请稍候...");
                },
                success: function(r) {
                    bu.hideLoading();
                    if (r.code == 0) {
                        $('input[name="legalDir"]').val(dir);
                        $(".batchOption").show();
                        var result = '<div class="fileList bbord">';
                        result += "<h3>" + r.msg + "</h3>";
                        result += "<table><thead><tr>";
                        result += "<td>书名</td><td>作者</td><td>格式</td><td>文件路径</td>";
                        result += "</tr></thead><tbody>";
                        for (var key in r.legal) {
                            var file = r.legal[key];
                            result += "<tr>";
                            result += "<td>" + file.bname + "</td>";
                            result += "<td>" + file.bauthor + "</td>";
                            result += "<td>" + file.bformat + "</td>";
                            result += "<td>" + file.bpath + "</td>";
                            result += "</tr>";
                        }
                        result += "</tbody></table></div>";
                        $(".main_form").append(result);
                        return true;
                    } else if (r.code == 1) {
                        $(".main_form").append('<div class="fileList">' + r.msg + "</div>");
                    } else if (r.code == 2) {
                        var result = '<div class="fileList bbord">';
                        result += "<h3>" + r.msg + "</h3>";
                        result += "<table><thead><tr>";
                        result += "<td>文件路径</td><td>错误提示</td>";
                        result += "</tr></thead><tbody>";
                        for (var key in r.illegal) {
                            var file = r.illegal[key];
                            result += "<tr>";
                            result += "<td>" + file.bpath + "</td>";
                            result += "<td>" + file.msg + "</td>";
                            result += "</tr>";
                        }
                        result += "</tbody></table></div>";
                        $(".main_form").append(result);
                    } else {
                        alert("操作失败，请重新执行");
                    }
                }
            });
            return false;
        }
    };
    Batch.prototype.doBatchUpload = function() {
        var bu = this;
        var dir = $("#dir").val();
        if (!dir || dir != $('input[name="legalDir"]').val()) {
            bu.verifyDir();
            return false;
        }
        var btype = $('input[name="btype"]');
        var btags = $('input[name="btags[]"]:checked');
        if (btype.val() == 0) {
            $("#btypeTip").html("请选择分类").addClass("error").show();
            btype.next().mousedown(function() {
                $("#btypeTip").html("").removeClass("error").hide();
            });
            return false;
        }
        if (btags.length > 5) {
            $("#btagsTip").html("标签不能超过5个").addClass("error").show();
            btags.click(function() {
                $("#btagsTip").html("").removeClass("error").hide();
            });
            return false;
        }
        var options = {
            type: "POST",
            url: "../../../batchUpload.php",
            dataType: "json",
            beforeSubmit: function() {
                $('input[name="btype"]').parent().selectInit();
                $(".batchOption").hide();
                $(".fileList").remove();
                bu.showLoading("文件正在上传，请稍候...");
            },
            success: function(r) {
                bu.hideLoading();
                if (r.code == 0) {
                    var result = "";
                    if (r.illegal.length > 0) {
                        result += '<div class="fileList bbord">';
                        result += "<h3>" + r.illegal.length + " 个文件上传失败</h3>";
                        result += "<table><thead><tr>";
                        result += "<td>书名</td><td>作者</td><td>格式</td><td>文件路径</td>";
                        result += "</tr></thead><tbody>";
                        for (var key in r.illegal) {
                            var file = r.illegal[key];
                            result += "<tr>";
                            result += "<td>" + file.bname + "</td>";
                            result += "<td>" + file.bauthor + "</td>";
                            result += "<td>" + file.bformat + "</td>";
                            result += "<td>" + file.bpath + "</td>";
                            result += "</tr>";
                        }
                        result += "</tbody></table></div>";
                    }
                    if (r.legal.length > 0) {
                        if (result != "") {
                            result += '<div class="fileList bbord" style="border-top:none; margin-top:0">';
                        } else {
                            result += '<div class="fileList bbord">';
                        }
                        result += "<h3>" + r.legal.length + " 个文件上传成功</h3>";
                        result += "<table><thead><tr>";
                        result += "<td>书名</td><td>作者</td><td>格式</td><td>文件路径</td>";
                        result += "</tr></thead><tbody>";
                        for (var key in r.legal) {
                            var file = r.legal[key];
                            result += "<tr>";
                            result += "<td>" + file.bname + "</td>";
                            result += "<td>" + file.bauthor + "</td>";
                            result += "<td>" + file.bformat + "</td>";
                            result += "<td>" + file.bpath + "</td>";
                            result += "</tr>";
                        }
                        result += "</tbody></table></div>";
                    }
                    $(".main_form").append(result);
                } else {
                    alert("error");
                }
            }
        };
        $("#buForm").ajaxSubmit(options);
        return false;
    };
});

define("custom/main/0.0.1/login-debug", [ "jquery-debug", "custom/main/0.0.1/mod/verify-debug", "custom/main/0.0.1/lib/jqueryForm-debug", "custom/main/0.0.1/mod/getParam-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var Verify = require("custom/main/0.0.1/mod/verify-debug");
    var ve = new Verify();
    $('input[name="name"]').blur(function() {
        ve.verifyName();
    });
    $('input[name="pwd"]').blur(function() {
        ve.verifyPwd();
    });
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    var gp = require("custom/main/0.0.1/mod/getParam-debug");
    var backUrl = gp.getParamVal("back");
    $("#loginForm").submit(function() {
        if (ve.verifyName() && ve.verifyPwd()) {
            var options = {
                type: "POST",
                url: "../../login.php?back=" + backUrl,
                dataType: "json",
                beforeSubmit: function() {
                    $("#submitTip").html('<img src="themes/default/images/loading.gif" width="16" height="16" class="loading">');
                    $('input[type="submit"]').attr("disabled", true);
                },
                success: function(r) {
                    $("#submitTip").removeClass("error").removeClass("suc").html("");
                    if (r.code == 0) {
                        $("#submitTip").addClass("suc").html("登陆成功");
                        location.href = r.back;
                    } else if (r.code == 1) {
                        $("#nameTip").addClass("error").html("该用户不存在");
                    } else {
                        $("#pwdTip").addClass("error").html("密码错误");
                    }
                    $('input[type="submit"]').attr("disabled", false);
                    $(":input").focus(function() {
                        $("#submitTip").removeClass("error").removeClass("suc").html("");
                    });
                }
            };
            $("#loginForm").ajaxSubmit(options);
        }
        return false;
    });
});

// JavaScript Document
define("custom/main/0.0.1/mod/verify-debug", [ "jquery-debug", "custom/main/0.0.1/lib/jqueryForm-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    function Verify() {
        this.name = $('input[name="name"]');
        this.nameTip = $("#nameTip");
        this.email = $('input[name="email"]');
        this.emailTip = $("#emailTip");
        this.pwd = $('input[name="pwd"]');
        this.pwdTip = $("#pwdTip");
        this.repwd = $('input[name="repwd"]');
        this.repwdTip = $("#repwdTip");
        this.oldpwd = $('input[name="oldpwd"]');
        this.oldpwdTip = $("#oldpwdTip");
    }
    module.exports = Verify;
    Verify.prototype.verifyName = function(isAjax) {
        var isAjax = arguments[0] ? arguments[0] : false;
        var name = this.name;
        var nameVal = name.val();
        var nameTip = this.nameTip;
        name.focus(function() {
            nameTip.removeClass("error").removeClass("suc").html("由3-10位英文字母或数字组成");
        });
        if (nameVal.length < 3 || nameVal.length > 10 || nameVal.search(/^[A-Za-z0-9]+$/g)) {
            nameTip.addClass("error");
            return false;
        }
        if (isAjax) {
            $.ajax({
                type: "POST",
                url: "../../../login.php",
                dataType: "text",
                data: {
                    act: "verifyName",
                    name: nameVal
                },
                beforeSend: function() {
                    nameTip.html('<img src="themes/default/images/loading.gif" width="16" height="16" class="loading">');
                },
                success: function(r) {
                    if (r) {
                        nameTip.addClass("error").html("该用户名已被占用");
                    } else {
                        nameTip.addClass("suc").html("可用");
                    }
                }
            });
        }
        return true;
    };
    Verify.prototype.verifyEmail = function(isAjax) {
        var isAjax = arguments[0] ? arguments[0] : false;
        var email = this.email;
        var emailVal = email.val();
        var emailTip = this.emailTip;
        var origTip = emailTip.html();
        email.focus(function() {
            emailTip.removeClass("error").removeClass("suc").html(origTip);
        });
        if (emailVal.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g)) {
            emailTip.addClass("error").html("邮箱格式错误");
            return false;
        }
        if (isAjax) {
            $.ajax({
                type: "POST",
                url: "../../../login.php",
                dataType: "text",
                data: {
                    act: "verifyEmail",
                    email: emailVal
                },
                beforeSend: function() {
                    emailTip.html('<img src="themes/default/images/loading.gif" width="16" height="16" class="loading">');
                },
                success: function(r) {
                    if (r) {
                        emailTip.addClass("error").html("该邮箱已被占用");
                    } else {
                        emailTip.addClass("suc").html("可用");
                    }
                }
            });
        }
        return true;
    };
    Verify.prototype.verifyPwd = function(isShowRight) {
        var isShowRight = arguments[0] ? arguments[0] : false;
        var pwd = this.pwd;
        var pwdVal = pwd.val();
        var pwdTip = this.pwdTip;
        pwd.focus(function() {
            pwdTip.removeClass("error").removeClass("suc").html("由6-16位下划线、英文字母或数字组成");
        });
        if (pwdVal.length < 6 || pwdVal.length > 16 || pwdVal.search(/^\w+$/g)) {
            pwdTip.addClass("error");
            return false;
        }
        if (isShowRight) {
            pwdTip.addClass("suc").html("可用");
        }
        return true;
    };
    Verify.prototype.verifyRepwd = function(isShowRight) {
        var repwd = this.repwd;
        var repwdVal = repwd.val();
        var repwdTip = this.repwdTip;
        repwd.focus(function() {
            repwdTip.removeClass("error").removeClass("suc").html("");
        });
        if (!repwdVal) {
            repwdTip.addClass("error").html("密码不能为空");
            return false;
        }
        if (repwdVal != $('input[name="pwd"]').val()) {
            repwdTip.addClass("error").html("密码不一致");
            return false;
        }
        if (isShowRight) {
            repwdTip.addClass("suc").html("可用");
        }
        return true;
    };
    Verify.prototype.verifyOldpwd = function(isShowRight) {
        var isShowRight = arguments[0] ? arguments[0] : false;
        var oldpwd = this.oldpwd;
        var oldpwdVal = oldpwd.val();
        var oldpwdTip = this.oldpwdTip;
        oldpwd.focus(function() {
            oldpwdTip.removeClass("error").removeClass("suc").html("由6-16位下划线、英文字母或数字组成");
        });
        if (oldpwdVal.length < 6 || oldpwdVal.length > 16 || oldpwdVal.search(/^\w+$/g)) {
            oldpwdTip.addClass("error");
            return false;
        }
        if (isShowRight) {
            oldpwdTip.addClass("suc").html("可用");
        }
        return true;
    };
    Verify.prototype.verifyNameReg = function() {
        var nameVal = this.name.val();
        var nameTip = this.nameTip;
        var vnameVal = $('input[name="vname"]').val();
        if (nameVal == vnameVal && vnameVal != "") {
            nameTip.addClass("suc").html("可用");
            return true;
        }
        if (this.verifyName(true)) {
            $('input[name="vname"]').val(nameVal);
        }
    };
    Verify.prototype.verifyEmailReg = function() {
        var emailVal = this.email.val();
        var emailTip = this.emailTip;
        var vemailVal = $('input[name="vemail"]').val();
        if (emailVal == vemailVal && vemailVal != "") {
            emailTip.addClass("suc").html("可用");
            return true;
        }
        if (this.verifyEmail(true)) {
            $('input[name="vemail"]').val(emailVal);
        }
    };
    Verify.prototype.verifyNameAndEmail = function() {
        if (this.verifyName() && this.verifyEmail()) {
            var name = this.name;
            var nameVal = this.name.val();
            var nameTip = this.nameTip;
            var email = this.email;
            var emailVal = this.email.val();
            var emailTip = this.emailTip;
            $.ajax({
                type: "POST",
                url: "../../../login.php",
                dataType: "json",
                data: {
                    act: "verifyNameAndEmail",
                    name: nameVal,
                    email: emailVal
                },
                beforeSend: function() {
                    $(".submitTip").html('<img src="themes/default/images/loading.gif" width="16" height="16" class="loading">');
                },
                success: function(r) {
                    $(".submitTip").html("");
                    if (r.code == 0) {
                        $("#nameTip").addClass("suc").html("正确");
                        name.attr("readonly", true);
                        $("#emailTip").addClass("suc").html("正确");
                        email.attr("readonly", true);
                        $(".pwdtr").show();
                        $('input[name="act"]').val("findPwd");
                    } else if (r.code == 1) {
                        emailTip.addClass("error").html("邮箱错误");
                    } else {
                        nameTip.addClass("error").html("该用户不存在");
                    }
                }
            });
        }
    };
});

define("custom/main/0.0.1/mod/getParam-debug", [], function(require, exports, module) {
    module.exports.getParamVal = function(paramName) {
        paramVal = "";
        isFound = false;
        if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
            arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&");
            i = 0;
            while (i < arrSource.length && !isFound) {
                if (arrSource[i].indexOf("=") > 0) {
                    if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                        paramVal = arrSource[i].split("=")[1];
                        isFound = true;
                    }
                }
                i++;
            }
        }
        return paramVal;
    };
});

define("custom/main/0.0.1/register-debug", [ "jquery-debug", "custom/main/0.0.1/mod/verify-debug", "custom/main/0.0.1/lib/jqueryForm-debug", "custom/main/0.0.1/mod/getParam-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var Verify = require("custom/main/0.0.1/mod/verify-debug");
    var ve = new Verify();
    $('input[name="name"]').blur(function() {
        ve.verifyNameReg();
    });
    $('input[name="email"]').blur(function() {
        ve.verifyEmailReg();
    });
    $('input[name="pwd"]').blur(function() {
        ve.verifyPwd(true);
    });
    $('input[name="repwd"]').blur(function() {
        ve.verifyRepwd(true);
    });
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    var gp = require("custom/main/0.0.1/mod/getParam-debug");
    var backUrl = gp.getParamVal("back");
    $("#regForm").submit(function() {
        if (ve.verifyNameReg() && ve.verifyEmailReg() && ve.verifyPwd() && ve.verifyRepwd()) {
            var options = {
                type: "POST",
                url: "../../login.php?back=" + backUrl,
                dataType: "json",
                beforeSubmit: function() {
                    $("#submitTip").html('<img src="themes/default/images/loading.gif" width="16" height="16" class="loading">');
                    $('input[type="submit"]').attr("disabled", true);
                },
                success: function(r) {
                    if (r.code == 0) {
                        $("#submitTip").addClass("suc").html("注册成功");
                        location.href = r.back;
                    } else {
                        $("#submitTip").html("注册失败，请重新填写").addClass("error");
                        $('input[type="submit"]').attr("disabled", false);
                        $(":input").focus(function() {
                            $("#submitTip").removeClass("error").removeClass("suc").html("");
                        });
                    }
                }
            };
            $("#regForm").ajaxSubmit(options);
        }
        return false;
    });
});

define("custom/main/0.0.1/forgetPwd-debug", [ "jquery-debug", "custom/main/0.0.1/mod/verify-debug", "custom/main/0.0.1/lib/jqueryForm-debug", "custom/main/0.0.1/mod/getParam-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var Verify = require("custom/main/0.0.1/mod/verify-debug");
    var ve = new Verify();
    $('input[name="name"]').blur(function() {
        ve.verifyName();
    });
    $('input[name="email"]').blur(function() {
        ve.verifyEmail();
    });
    $('input[name="pwd"]').blur(function() {
        ve.verifyPwd(true);
    });
    $('input[name="repwd"]').blur(function() {
        ve.verifyRepwd(true);
    });
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    var gp = require("custom/main/0.0.1/mod/getParam-debug");
    var backUrl = gp.getParamVal("back");
    $("#findPwdForm").submit(function() {
        if ($('#findPwdForm input[name="act"]').val() == "" || $('#findPwdForm input[name="pwd"]').closest("tr").is(":hidden")) {
            ve.verifyNameAndEmail();
        } else {
            if (ve.verifyPwd() && ve.verifyRepwd()) {
                $('input[name="act"]').val("findPwd");
                var options = {
                    type: "POST",
                    url: "../../login.php",
                    dataType: "text",
                    beforeSubmit: function() {
                        $("#submitTip").html('<img src="themes/default/images/loading.gif" width="16" height="16" class="loading">');
                        $('input[type="submit"]').attr("disabled", true);
                    },
                    success: function(r) {
                        if (r) {
                            $("#submitTip").addClass("suc").html("密码设置成功");
                            location.href = "../../login.php?back=" + backUrl;
                        } else {
                            $("#submitTip").addClass("error").html("设置失败，请重新提交");
                            $('input[type="submit"]').attr("disabled", false);
                            $(":input").focus(function() {
                                $("#submitTip").removeClass("error").removeClass("suc").html("");
                            });
                        }
                    }
                };
                $("#findPwdForm").ajaxSubmit(options);
            }
        }
        return false;
    });
});

define("custom/main/0.0.1/changePwd-debug", [ "jquery-debug", "custom/main/0.0.1/mod/verify-debug", "custom/main/0.0.1/lib/jqueryForm-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var Verify = require("custom/main/0.0.1/mod/verify-debug");
    var ve = new Verify();
    $('input[name="oldpwd"]').blur(function() {
        ve.verifyOldpwd(true);
    });
    $('input[name="pwd"]').blur(function() {
        ve.verifyPwd(true);
    });
    $('input[name="repwd"]').blur(function() {
        ve.verifyRepwd(true);
    });
    require("custom/main/0.0.1/lib/jqueryForm-debug");
    $("#changePwdForm").submit(function() {
        if (ve.verifyOldpwd() && ve.verifyPwd() && ve.verifyRepwd()) {
            var options = {
                type: "POST",
                url: "../../user/changePwd.php",
                dataType: "json",
                beforeSubmit: function() {
                    $("#submitTip").html('<img src="../themes/default/images/loading.gif" width="16" height="16" class="loading">');
                    $('input[type="submit"]').attr("disabled", true);
                },
                success: function(r) {
                    $("#submitTip").html("");
                    if (r.code == 0) {
                        $("#submitTip").addClass("suc").html("密码修改成功");
                    } else if (r.code == 1) {
                        $("#oldpwdTip").addClass("error").html("旧密码错误");
                    } else {
                        $("#submitTip").addClass("error").html("密码修改失败，请重新提交");
                    }
                    $('input[type="submit"]').attr("disabled", false);
                    $(":input").focus(function() {
                        $("#submitTip").removeClass("error").removeClass("suc").html("");
                    });
                }
            };
            $("#changePwdForm").ajaxSubmit(options);
        }
        return false;
    });
});
