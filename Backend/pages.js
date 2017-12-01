exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'UA ABS',
        style:"css/style.css"
    });
};