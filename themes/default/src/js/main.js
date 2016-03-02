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
            require('./modules/upload').init();
            break;

        case 'batchUpload':
            require('./modules/batchUpload').init();
            break;

        case 'login':
            require('./modules/login').init(dataKey);
            break;

        case 'register':
            require('./modules/login').init(dataKey);
            break;

        case 'forgetPwd':
            require('./modules/login').init(dataKey);
            break;

        case 'changePwd':
            require('./modules/login').init(dataKey);
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