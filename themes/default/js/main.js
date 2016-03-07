require=function e(t,a,r){function n(o,s){if(!a[o]){if(!t[o]){var l="function"==typeof require&&require;if(!s&&l)return l(o,!0);if(i)return i(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var c=a[o]={exports:{}};t[o][0].call(c.exports,function(e){var a=t[o][1][e];return n(a?a:e)},c,c.exports,e,t,a,r)}return a[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)n(r[o]);return n}({1:[function(){$.fn.formCheck=function(e,t){function a(e,a){for(j in a)if(t.rules[a[j].type]&&t.rules[a[j].type](e,a[j]))a[j].showSuccess?a[j].showSuccess():t.showSuccess&&t.showSuccess($(e),a[j].errMsg);else{if(a[j].showError){a[j].showError(),r=!1;break}if(t.showError){t.showError($(e),a[j].errMsg),r=!1;break}if(a[j].errMsg)return alert(a[j].errMsg),!1}return!0}t||(t={}),t.rules=$.extend({"null":function(e){return $.trim($(e).val()).length>0},select:function(e,t){return $(e).val()!=t.value},checked:function(e){return e.checked},maxlength:function(e,t){return $.trim($(e).val()).length<=t.maxlength},minlength:function(e,t){return $.trim($(e).val()).length>=t.minlength},digitMinlength:function(e,t){return $.trim($(e).val().replace(/[^0-9]/g,"")).length>=t.minlength},user:function(e){return/^[a-zA-Z0-9]{3,10}$/.test($.trim($(e).val()))},password:function(e){return/^(?!\d)[a-zA-Z0-9_]{6,16}$/.test($.trim($(e).val()))},rePpassword:function(e,t){return $.trim($(e).val())==$.trim($(t.compare).val())},email:function(e){return/(\,|^)([\w+._]+@\w+\.(\w+\.){0,3}\w{2,4})/.test($(e).val().replace(/-|\//g,""))},phone:function(e,t){return/^[\d-\s]{1,20}$/.test($(e).val())&&$.trim($(e).val()).replace(/[\s]+/g," ").length<=t.maxlength},number:function(e){return/^[0-9]+$/.test($.trim($(e).val()))}},t.rules);var r=!0;for(i=0;i<this[0].length;i++)if(!($(this[0][i]).attr("name")&&0==$(this[0][i]).attr("name").length||$(this[0][i]).prop("disabled"))){var n=e[$(this[0][i]).attr("name")];if(n&&!a(this[0][i],n))return!1}return r}},{}],2:[function(){!function(e){"use strict";function t(t){var a=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).ajaxSubmit(a))}function a(t){var a=t.target,r=e(a);if(!r.is("[type=submit],[type=image]")){var n=r.closest("[type=submit]");if(0===n.length)return;a=n[0]}var i=this;if(i.clk=a,"image"==a.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=r.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-a.offsetLeft,i.clk_y=t.pageY-a.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function r(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function a(a){var r,n,i=e.param(a,t.traditional).split("&"),o=i.length,s=[];for(r=0;o>r;r++)i[r]=i[r].replace(/\+/g," "),n=i[r].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(r){for(var n=new FormData,i=0;i<r.length;i++)n.append(r[i].name,r[i].value);if(t.extraData){var o=a(t.extraData);for(i=0;i<o.length;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:l||"POST"});t.uploadProgress&&(s.xhr=function(){var a=e.ajaxSettings.xhr();return a.upload&&a.upload.addEventListener("progress",function(e){var a=0,r=e.loaded||e.position,n=e.total;e.lengthComputable&&(a=Math.ceil(r/n*100)),t.uploadProgress(e,r,n,a)},!1),a}),s.data=null;var u=s.beforeSend;return s.beforeSend=function(e,a){a.data=t.formData?t.formData:n,u&&u.call(this,e,a)},e.ajax(s)}function s(a){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(a){r("cannot get iframe.contentWindow document: "+a)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(a){r("cannot get iframe.contentDocument: "+a),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;r("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(a){r("Server abort: ",a," (",a.name,")"),s($),T&&clearTimeout(T),T=void 0}}var a=d.attr2("target"),i=d.attr2("action");k.setAttribute("target",m),(!l||/post/i.test(l))&&k.setAttribute("method","POST"),i!=f.url&&k.setAttribute("action",f.url),f.skipEncodingOverride||l&&!/post/i.test(l)||d.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),f.timeout&&(T=setTimeout(function(){w=!0,s(S)},f.timeout));var o=[];try{if(f.extraData)for(var u in f.extraData)f.extraData.hasOwnProperty(u)&&(e.isPlainObject(f.extraData[u])&&f.extraData[u].hasOwnProperty("name")&&f.extraData[u].hasOwnProperty("value")?o.push(e('<input type="hidden" name="'+f.extraData[u].name+'">').val(f.extraData[u].value).appendTo(k)[0]):o.push(e('<input type="hidden" name="'+u+'">').val(f.extraData[u]).appendTo(k)[0]));f.iframeTarget||v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1),setTimeout(t,15);try{k.submit()}catch(c){var p=document.createElement("form").submit;p.apply(k)}}finally{k.setAttribute("action",i),a?k.setAttribute("target",a):d.removeAttr("target"),e(o).remove()}}function s(t){if(!b.aborted&&!M){if(E=n(g),E||(r("cannot access response document"),t=$),t===S&&b)return b.abort("timeout"),j.reject(b,"timeout"),void 0;if(t==$&&b)return b.abort("server abort"),j.reject(b,"error","server abort"),void 0;if(E&&E.location.href!=f.iframeSrc||w){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var a,i="success";try{if(w)throw"timeout";var o="xml"==f.dataType||E.XMLDocument||e.isXMLDoc(E);if(r("isXml="+o),!o&&window.opera&&(null===E.body||!E.body.innerHTML)&&--O)return r("requeing onLoad callback, DOM not available"),setTimeout(s,250),void 0;var l=E.body?E.body:E.documentElement;b.responseText=l?l.innerHTML:null,b.responseXML=E.XMLDocument?E.XMLDocument:E,o&&(f.dataType="xml"),b.getResponseHeader=function(e){var t={"content-type":f.dataType};return t[e.toLowerCase()]},l&&(b.status=Number(l.getAttribute("status"))||b.status,b.statusText=l.getAttribute("statusText")||b.statusText);var u=(f.dataType||"").toLowerCase(),c=/(json|script|text)/.test(u);if(c||f.textarea){var d=E.getElementsByTagName("textarea")[0];if(d)b.responseText=d.value,b.status=Number(d.getAttribute("status"))||b.status,b.statusText=d.getAttribute("statusText")||b.statusText;else if(c){var m=E.getElementsByTagName("pre")[0],h=E.getElementsByTagName("body")[0];m?b.responseText=m.textContent?m.textContent:m.innerText:h&&(b.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==u&&!b.responseXML&&b.responseText&&(b.responseXML=C(b.responseText));try{_=A(b,u,f)}catch(y){i="parsererror",b.error=a=y||i}}catch(y){r("error caught: ",y),i="error",b.error=a=y||i}b.aborted&&(r("upload aborted"),i=null),b.status&&(i=b.status>=200&&b.status<300||304===b.status?"success":"error"),"success"===i?(f.success&&f.success.call(f.context,_,"success",b),j.resolve(b.responseText,"success",b),p&&e.event.trigger("ajaxSuccess",[b,f])):i&&(void 0===a&&(a=b.statusText),f.error&&f.error.call(f.context,b,i,a),j.reject(b,"error",a),p&&e.event.trigger("ajaxError",[b,f,a])),p&&e.event.trigger("ajaxComplete",[b,f]),p&&!--e.active&&e.event.trigger("ajaxStop"),f.complete&&f.complete.call(f.context,b,i),M=!0,f.timeout&&clearTimeout(T),setTimeout(function(){f.iframeTarget?v.attr("src",f.iframeSrc):v.remove(),b.responseXML=null},100)}}}var u,c,f,p,m,v,g,b,y,x,w,T,k=d[0],j=e.Deferred();if(j.abort=function(e){b.abort(e)},a)for(c=0;c<h.length;c++)u=e(h[c]),i?u.prop("disabled",!1):u.removeAttr("disabled");if(f=e.extend(!0,{},e.ajaxSettings,t),f.context=f.context||f,m="jqFormIO"+(new Date).getTime(),f.iframeTarget?(v=e(f.iframeTarget),x=v.attr2("name"),x?m=x:v.attr2("name",m)):(v=e('<iframe name="'+m+'" src="'+f.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],b={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var a="timeout"===t?"timeout":"aborted";r("aborting upload... "+a),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",f.iframeSrc),b.error=a,f.error&&f.error.call(f.context,b,a,t),p&&e.event.trigger("ajaxError",[b,f,a]),f.complete&&f.complete.call(f.context,b,a)}},p=f.global,p&&0===e.active++&&e.event.trigger("ajaxStart"),p&&e.event.trigger("ajaxSend",[b,f]),f.beforeSend&&f.beforeSend.call(f.context,b,f)===!1)return f.global&&e.active--,j.reject(),j;if(b.aborted)return j.reject(),j;y=k.clk,y&&(x=y.name,x&&!y.disabled&&(f.extraData=f.extraData||{},f.extraData[x]=y.value,"image"==y.type&&(f.extraData[x+".x"]=k.clk_x,f.extraData[x+".y"]=k.clk_y)));var S=1,$=2,D=e("meta[name=csrf-token]").attr("content"),F=e("meta[name=csrf-param]").attr("content");F&&D&&(f.extraData=f.extraData||{},f.extraData[F]=D),f.forceSync?o():setTimeout(o,10);var _,E,M,O=50,C=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},L=e.parseJSON||function(e){return window.eval("("+e+")")},A=function(t,a,r){var n=t.getResponseHeader("content-type")||"",i="xml"===a||!a&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),r&&r.dataFilter&&(o=r.dataFilter(o,a)),"string"==typeof o&&("json"===a||!a&&n.indexOf("json")>=0?o=L(o):("script"===a||!a&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return j}if(!this.length)return r("ajaxSubmit: skipping submit process - no element selected"),this;var l,u,c,d=this;"function"==typeof t?t={success:t}:void 0===t&&(t={}),l=t.type||this.attr2("method"),u=t.url||this.attr2("action"),c="string"==typeof u?e.trim(u):"",c=c||window.location.href||"",c&&(c=(c.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:c,success:e.ajaxSettings.success,type:l||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var f={};if(this.trigger("form-pre-serialize",[this,t,f]),f.veto)return r("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return r("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var p=t.traditional;void 0===p&&(p=e.ajaxSettings.traditional);var m,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,m=e.param(t.data,p)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return r("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,f]),f.veto)return r("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,p);m&&(g=g?g+"&"+m:m),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var b=[];if(t.resetForm&&b.push(function(){d.resetForm()}),t.clearForm&&b.push(function(){d.clearForm(t.includeHidden)}),!t.dataType&&t.target){var y=t.success||function(){};b.push(function(a){var r=t.replaceTarget?"replaceWith":"html";e(t.target)[r](a).each(y,arguments)})}else t.success&&b.push(t.success);if(t.success=function(e,a,r){for(var n=t.context||this,i=0,o=b.length;o>i;i++)b[i].apply(n,[e,a,r||d,d])},t.error){var x=t.error;t.error=function(e,a,r){var n=t.context||this;x.apply(n,[e,a,r,d])}}if(t.complete){var w=t.complete;t.complete=function(e,a){var r=t.context||this;w.apply(r,[e,a,d])}}var T=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}),k=T.length>0,j="multipart/form-data",S=d.attr("enctype")==j||d.attr("encoding")==j,$=n.fileapi&&n.formdata;r("fileAPI :"+$);var D,F=(k||S)&&!$;t.iframe!==!1&&(t.iframe||F)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){D=s(v)}):D=s(v):D=(k||S)&&$?o(v):e.ajax(t),d.removeData("jqxhr").data("jqxhr",D);for(var _=0;_<h.length;_++)h[_]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(r("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(r("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,a).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,a),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,a)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,a){var r=[];if(0===this.length)return r;var i=this[0],o=t?i.getElementsByTagName("*"):i.elements;if(!o)return r;var s,l,u,c,d,f,p;for(s=0,f=o.length;f>s;s++)if(d=o[s],u=d.name,u&&!d.disabled)if(t&&i.clk&&"image"==d.type)i.clk==d&&(r.push({name:u,value:e(d).val(),type:d.type}),r.push({name:u+".x",value:i.clk_x},{name:u+".y",value:i.clk_y}));else if(c=e.fieldValue(d,!0),c&&c.constructor==Array)for(a&&a.push(d),l=0,p=c.length;p>l;l++)r.push({name:u,value:c[l]});else if(n.fileapi&&"file"==d.type){a&&a.push(d);var m=d.files;if(m.length)for(l=0;l<m.length;l++)r.push({name:u,value:m[l],type:d.type});else r.push({name:u,value:"",type:d.type})}else null!==c&&"undefined"!=typeof c&&(a&&a.push(d),r.push({name:u,value:c,type:d.type,required:d.required}));if(!t&&i.clk){var h=e(i.clk),v=h[0];u=v.name,u&&!v.disabled&&"image"==v.type&&(r.push({name:u,value:h.val()}),r.push({name:u+".x",value:i.clk_x},{name:u+".y",value:i.clk_y}))}return r},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var a=[];return this.each(function(){var r=this.name;if(r){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)a.push({name:r,value:n[i]});else null!==n&&"undefined"!=typeof n&&a.push({name:this.name,value:n})}}),e.param(a)},e.fn.fieldValue=function(t){for(var a=[],r=0,n=this.length;n>r;r++){var i=this[r],o=e.fieldValue(i,t);null===o||"undefined"==typeof o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(a,o):a.push(o))}return a},e.fieldValue=function(t,a){var r=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===a&&(a=!0),a&&(!r||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],l=t.options,u="select-one"==n,c=u?o+1:l.length,d=u?o:0;c>d;d++){var f=l[d];if(f.selected){var p=f.value;if(p||(p=f.attributes&&f.attributes.value&&!f.attributes.value.specified?f.text:f.value),u)return p;s.push(p)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var a=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var r=this.type,n=this.tagName.toLowerCase();a.test(r)||"textarea"==n?this.value="":"checkbox"==r||"radio"==r?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==r?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(r)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var a=this.type;if("checkbox"==a||"radio"==a)this.checked=t;else if("option"==this.tagName.toLowerCase()){var r=e(this).parent("select");t&&r[0]&&"select-one"==r[0].type&&r.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1}("undefined"!=typeof jQuery?jQuery:window.Zepto)},{}],3:[function(e,t){t.exports={loading:'<img src="'+webData.IMG_PATH+'loading.gif" width="16" height="16" class="mr1">',success:'<i class="fa fa-check-circle"></i>',error:'<i class="fa fa-times-circle"></i>',tryAgain:"Opus！请刷新页面后再试一次~"}},{}],4:[function(){(function(e){define(function(t,a,r){function n(){}var i="undefined"!=typeof window?window.$:"undefined"!=typeof e?e.$:null;r.exports=n,n.prototype.setEva=function(e){var t=encodeURI(location.href),a=document.getElementById("eva_"+e),r=document.getElementById("eva_count_"+e);i.ajax({type:"POST",url:webData.WEB_ROOT+"ajax.php",dataType:"json",data:{act:"setEva",book_id:e},success:function(e){if(0==e.code){var n=parseInt(r.innerText);1==e.isplus?(n++,a.className="eva eva_1"):(n--,a.className="eva"),r.innerHTML=n}else 1==e.code?location.href=webData.WEB_ROOT+"login.php?back="+t:alert("操作失败！")}})},n.prototype.delFile=function(e,t){i.ajax({type:"POST",url:webData.WEB_ROOT+"ajax.php",dataType:"text",data:{act:"delFile",book_id:e},success:function(e){1==parseInt(e)?t():alert("操作失败")}})}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],5:[function(){(function(e){define(function(t){var a="undefined"!=typeof window?window.$:"undefined"!=typeof e?e.$:null,r=t("./file"),n=new r;a(".eva").click(function(){var e=parseInt(a(this).attr("id").replace("eva_",""));n.setEva(e)}),a(".btnDelFile").click(function(){{var e=a(this),t=parseInt(a(this).attr("id").replace("del_",""));n.delFile(t,function(){e.closest("li").hide("fast")})}})})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./file":4}],6:[function(){(function(e){define(function(){var t="undefined"!=typeof window?window.$:"undefined"!=typeof e?e.$:null;t.fn.selectWidget=function(){var e=t(this),a=t(this).children("span"),r=t(this).children('input[type="hidden"]'),n=t(this).children("ul"),i=n.children("li:eq(1)").outerHeight();n.children("li").length>10&&n.height(10*i-1),a.mousedown(function(){o()}),n.find("li").click(function(){0==t(this).children("a").length&&(a.html(t(this).html()),r.val(t(this).index())),e.removeClass("active"),t(document).unbind("click",s)});var o=function(){t(".select").removeClass("active"),e.addClass("active"),t(document).bind("click",s)},s=function(a){var r=a?a.target:a.srcElement;do{if(t(r).closest(".select").length>0)return;r=r.parentNode}while(r.parentNode);e.removeClass("active"),t(document).unbind("click",s)}},t.fn.selectInit=function(e){var a=t(this),r=t(this).children("span"),n=t(this).children('input[type="hidden"]'),i=e&&e.val?e.val:"0",o=e&&e.str?e.str:"-";n.val(i),r.html(o),a.selectWidget()}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],7:[function(e,t){t.exports={init:function(){$("textarea").blur(function(){var e=$(this),t=e.val().replace(/\n\s*/g,"\n");t=t.replace(/\n{2,}/g,"\n"),e.val(t)})}}},{}],8:[function(e,t){e("../lib/jqueryForm");var a=function(){var e=$("#verifyForm"),t=e.find('input[name="dir"]');t.prop("readonly")||t.focus(),e.submit(function(){var e=$.trim(t.val()).length>0;return e||t.focus(),e})},r=function(){};t.exports={init:function(){a(),r()}}},{"../lib/jqueryForm":2}],9:[function(){(function(e){define(function(t){var a="undefined"!=typeof window?window.$:"undefined"!=typeof e?e.$:null;t("../mod/fileList"),t("../mod/selectWidget"),a(".select").each(function(){a(this).selectWidget()}),a("#filterForm").submit(function(){return 0==a('input[name="ftype"]').val()&&0==a('input[name="fstyle"]').val()?(alert("请选择筛选条件"),!1):!0}),a("#keyForm").submit(function(){var e=a('input[name="sbkey"]').val();return e?!0:(alert("请输入关键字"),!1)})})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../mod/fileList":5,"../mod/selectWidget":6}],10:[function(){define(function(e){e("../mod/fileList")})},{"../mod/fileList":5}],11:[function(e,t){t.exports={init:function(t){e("../lib/jqueryForm"),e("../lib/formCheck");var a=e("../mod/config"),r=$(document.getElementById(t+"Form")),n=r.find("#submitTip"),i=r.find('button[type="submit"]'),o=r.find('input[name="act"]'),s={"data[user_name]":[{type:"user",errMsg:"由3-10位英文字母或数字组成"}],"data[user_email]":[{type:"email",errMsg:"邮箱格式错误"}],"data[oldpwd]":[{type:"password",errMsg:"由6-16位下划线、英文字母或数字组成"}],"data[user_pwd]":[{type:"password",errMsg:"由6-16位下划线、英文字母或数字组成"}],"data[repwd]":[{type:"password",errMsg:"由6-16位下划线、英文字母或数字组成"},{type:"rePpassword",errMsg:"密码不一致",compare:r.find('input[name="data[user_pwd]"]')}]},l=function(e){"verifyNameAndEmail"==o.val()?(r.find(".tr-readonly input").prop("readonly",!0),r.find(".tr-disabled").show().find("input").prop("disabled",!1),o.val("verifyFindPwd"),r.find('input[name="data[user_id]"]').val(e.user_id)):location.href=webData.WEB_ROOT+"login.php?back="+e.back},u=function(e){n.addClass("success").html(a.success+e.msg),r.find('input[type="password"]').val(""),r.find('input[type="password"]').each(function(){$(this).val("");var e=$(this).closest("tr").find(".tip"),t=e.attr("data-tip");e.attr("class","tip").html(t)})};r.submit(function(){n.attr("class","tip").html("");var e=r.formCheck(s,{showSuccess:function(e){$(e).closest("tr").find(".tip").attr("class","tip success").html(a.success)},showError:function(e,t){$(e).closest("tr").find(".tip").attr("class","tip error").html(a.error+t)}});if(e&&"changePwd"==t){var o=r.find('input[name="data[oldpwd]"]').val(),c=r.find('input[name="data[user_pwd]"]').val();o==c&&(n.addClass("error").html(a.error+"新密码不能与旧密码相同"),e=!1)}if(e){var d={dataType:"json",beforeSubmit:function(){n.html(a.loading),i.prop("disabled",!0)},success:function(e){n.html(""),i.prop("disabled",!1),0==e.code?"forgetPwd"==t?l(e):"changePwd"==t?u(e):location.href=e.back:n.addClass("error").html(a.error+e.msg)},error:function(){n.addClass("error").html(a.error+a.tryAgain)}};r.ajaxSubmit(d)}return!1})}}},{"../lib/formCheck":1,"../lib/jqueryForm":2,"../mod/config":3}],12:[function(){(function(e){define(function(t){{var a="undefined"!=typeof window?window.$:"undefined"!=typeof e?e.$:null,r=t("../mod/file");new r}a(".btn-pass").click(function(){var e=a(this),t=parseInt(e.closest("dt").attr("id").replace("bid_",""));a.ajax({type:"POST",url:webData.WEB_ROOT+"master/pending.php",dataType:"text",data:{act:"pass",book_id:t},success:function(t){1==parseInt(t)?e.parent().html("审核通过"):alert("操作失败")}})}),a(".btn-delete").click(function(){var e=a(this),t=parseInt(e.closest("dt").attr("id").replace("bid_",""));a.ajax({type:"POST",url:webData.WEB_ROOT+"master/pending.php",dataType:"text",data:{act:"repeat",book_id:t},success:function(t){1==parseInt(t)?e.parent().html("已删除"):alert("操作失败")}})})})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../mod/file":4}],13:[function(e,t){e("../lib/jqueryForm"),e("../mod/textarea").init(),e("../lib/formCheck");var a=e("../mod/config"),r={attaForm:$("#attaForm"),attaInput:$("#attachment"),attaTip:$("#attaTip"),uploadForm:$("#uploadForm"),uploadSubmitTip:$("#uploadSubmitTip"),uploadSubmitBtn:$("#uploadSubmitBtn"),bookTagsTip:$("#bookTagsTip"),successResult:$("#uploadSuccess"),failResult:$("#uploadFail")},n=function(){r.attaInput.val(""),r.attaTip.hide()},i=function(){r.uploadSubmitTip.html(""),r.uploadSubmitBtn.prop("disabled",!1),r.bookTagsTip.html(""),r.uploadForm.hide().get(0).reset()},o=function(){r.successResult.hide(),r.failResult.hide()},s=function(){r.attaInput.mousedown(function(){i(),o()}),r.attaInput.change(function(){if(""==r.attaInput.val())return r.attaTip.attr("class","tip error").html(a.error+"请选择文件"),r.uploadForm.hide(),!1;var e={dataType:"json",success:function(e){if(r.attaTip.innerHTML=e.msg,0==e.code){for(var t in e.book)console.log('input[name="data['+t+']"]'),console.log(e.book[t]),r.uploadForm.find('input[name="data['+t+']"]').val(e.book[t]);r.attaTip.attr("class","tip success").html(a.success+e.msg),r.uploadForm.show()}else r.attaTip.attr("class","tip error").html(a.error+e.msg),r.uploadForm.hide()}};r.attaForm.ajaxSubmit(e)})},l=function(){var e=r.uploadForm,t={"data[book_name]":[{type:"null",errMsg:"请刷新后重新上传"}],"data[book_author]":[{type:"null",errMsg:"请刷新后重新上传"}],"data[book_type]":[{type:"select",value:0,errMsg:"请选择分类"}]};e.submit(function(){var o=e.formCheck(t,{showSuccess:function(e){$(e).closest("tr").find(".tip").attr("class","tip success").html(a.success)},showError:function(e,t){$(e).closest("tr").find(".tip").attr("class","tip error").html(a.error+t)}});if(!o)return!1;if(e.find('input[name="data[book_tags][]"]:checked').length>5)return r.bookTagsTip.attr("class","tip error").html(a.error+"标签不能超过5个"),!1;var s={dataType:"json",beforeSubmit:function(){r.uploadSubmitTip.html(a.loading),r.uploadSubmitBtn.prop("disabled",!0)},success:function(e){n(),i(),0==e.code?r.successResult.show():r.failResult.show()},error:function(){n(),i(),r.failResult.show()}};return e.ajaxSubmit(s),!1})};t.exports={init:function(){s(),l()}}},{"../lib/formCheck":1,"../lib/jqueryForm":2,"../mod/config":3,"../mod/textarea":7}],main:[function(e,t){var a=function(){var t=webData.dataKey?webData.dataKey:"";switch(t){case"index":e("./modules/index");break;case"browse":e("./modules/browse");break;case"upload":e("./modules/upload").init();break;case"batchUpload":e("./modules/batchUpload").init();break;case"login":e("./modules/login").init(t);break;case"register":e("./modules/login").init(t);break;case"forgetPwd":e("./modules/login").init(t);break;case"changePwd":e("./modules/login").init(t);break;case"pending":e("./modules/pending")}};t.exports={init:a}},{"./modules/batchUpload":8,"./modules/browse":9,"./modules/index":10,"./modules/login":11,"./modules/pending":12,"./modules/upload":13}]},{},[]);