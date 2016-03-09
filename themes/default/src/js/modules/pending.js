module.exports = {
    "init": function () {
        var list = $('#pendingList');

        //审核通过
        var pass = function (btnObj) {
            var wrap = $(btnObj).closest('li'),
                box = wrap.closest('.list-b-box'),
                bookIds = [wrap.attr('data-book-id')],
                existList = box.find('.exist'),
                pendingList = wrap.parent();

            $.ajax({
                type: 'POST',
                url: webData.WEB_ROOT + 'master/pending.php',
                dataType: 'text',
                data: {'act':'pass','bookIds':bookIds},
                success: function(r){
                    if(parseInt(r) == 1) {
                        if(pendingList.children('li').length === 1) {
                            box.remove();
                        } else {
                            if(existList.length == 0) {
                                existList = $('<ul class="exist"></ul>');
                                wrap.closest('dd').prepend('<hr>').prepend(existList);
                            }
                            var newItem = $('<li><i class="fa fa-angle-right"></i></li>');
                            newItem.append(wrap.children('a'));
                            existList.append(newItem);
                            wrap.remove();
                        }

                    } else {
                        alert('操作失败');
                    }
                }
            });
        };

        //批量通过
        var batchPass = function (btnObj) {
            var box =  $(btnObj).closest('.list-b-box'),
                bookIds = [];

            box.find('.pending>li').each(function (idx, domElem) {
                bookIds.push($(domElem).attr('data-book-id'));
            });

            $.ajax({
                type: 'POST',
                url: webData.WEB_ROOT + 'master/pending.php',
                dataType: 'text',
                data: {'act':'pass','bookIds':bookIds},
                success: function(r){
                    if(parseInt(r) == 1) {
                        box.hide();
                    } else {
                        alert('操作失败');
                    }
                }
            });
        };

        //删除重复文件
        var repeat = function (btnObj){
            var wrap = $(btnObj).closest('li'),
                bookId = wrap.attr('data-book-id'),
                box = wrap.closest('.list-b-box'),
                pendingList = wrap.parent();

            $.ajax({
                type: 'POST',
                url: webData.WEB_ROOT + 'master/pending.php',
                dataType: 'text',
                data: {'act':'repeat','bookId':bookId},
                success: function(r){
                    if(parseInt(r) == 1) {
                        if(pendingList.children('li').length === 1) {
                            box.remove();
                        } else {
                            wrap.remove();
                        }
                    } else {
                        alert('操作失败');
                    }
                }
            });
        };

        list.on('click', '.btn-pass', function () {
            pass($(this));

        }).on('click', '.btn-batch-pass', function () {
            batchPass($(this));

        }).on('click', '.btn-repeat', function () {
            repeat($(this));
        });
    }
};