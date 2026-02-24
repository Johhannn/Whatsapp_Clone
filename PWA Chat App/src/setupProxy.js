/**
 * CRA dev server proxy to fix COOP headers that block Firebase Auth popup.
 * This sets Cross-Origin-Opener-Policy to unsafe-none so the Google 
 * auth popup can communicate back to the opener window.
 */
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
        res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
        next();
    });
};
