var init = function () {
    // common
    // --------------------------------------------------

    //to determine which code to take effect
    var dataKey = webData.dataKey ? webData.dataKey : '';

    switch (dataKey) {
        case 'index':
            require('./modules/index');
            break;

        case 'browse':
            require('./modules/browse');
            break;

        case 'upload':
            require('./modules/upload');
            break;

        case 'batchUpload':
            require('./modules/batchUpload');
            break;

        case 'login':
            require('./modules/login').init();
            break;

        case 'register':
            require('./modules/register').init();
            break;

        case 'forgetPwd':
            require('./modules/forgetPwd');
            break;

        case 'changePwd':
            require('./modules/changePwd');
            break;

        case 'pending':
            require('./modules/pending');
            break;

        default:
            break;
    }
};

module.exports = {
    "init": init
};