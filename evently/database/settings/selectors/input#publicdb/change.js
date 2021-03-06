function() {
    var app = $$(this).app,
        db = app.db,
        isPublic = $(this).is(':checked'),
        utilsLib = app.getlib('utils');

    function onSuccess() {
        var msg = 'This database is now ' + (isPublic ? 'public' : 'private') + '.';
        utilsLib.showSuccess(msg);
    }

    function onError(e) {
        utilsLib.showError(e);
    }

    //utilsLib.admin_db(app.db, 'set_public', {'public' : isPublic}, null, onSuccess, onError);
    db.dm_admin(db.name, 'set_public', {'public' : isPublic}, null, onSuccess, onError);
}