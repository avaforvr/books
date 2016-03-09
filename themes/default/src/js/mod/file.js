function File() {}
module.exports = new File();

//喜欢或取消喜欢
File.prototype.setEva = function(book_id) {
    var back_url = encodeURI(location.href);
    var elem_eva = document.getElementById('eva_' + book_id);
    var elem_count = document.getElementById('eva_count_' + book_id);
    $.ajax({
        type: 'POST',
        url: webData.WEB_ROOT + 'ajax.php',
        dataType: 'json',
        data: {'act':'setEva','book_id':book_id},
        success: function(r){
            if(r.code == 0) {
                var total = parseInt(elem_count.innerText);
                if(r.isplus == 1) {
                    total ++;
                    elem_eva.className = 'eva eva_1';
                } else {
                    total --;
                    elem_eva.className = 'eva';
                }
                elem_count.innerHTML = total;
            } else if(r.code == 1) {
                location.href = webData.WEB_ROOT + 'login.php?back=' + back_url;
            } else {
                alert('操作失败！');
            }
        }
    });
}

//删除文件
File.prototype.delFile = function(book_id, callback) {
    $.ajax({
        type: 'POST',
        url: webData.WEB_ROOT + 'ajax.php',
        dataType: 'text',
        data: {'act':'delFile','book_id':book_id},
        success: function(r){
            if(parseInt(r) == 1) {
                callback();
            } else {
                alert('操作失败');
            }
        }
    });
}