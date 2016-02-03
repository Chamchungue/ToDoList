var i = 0;

$(document).ready( function() {
    var body = $('body');
    body.append($('<button name="name" value="value">test</button>'));
    $('button').on( 'click', function( ) {
        var ul = $('ul');
        if( !ul.length) ul = $('<ul/>').insertAfter($(this));
        $.ajax( 'index.php/ticket', {
            success : function( response) {
                ul.append( response);
                ul.find('li').on('click', '.close', function() {
                    $(this).closest('li').remove();
                });
            },
            error : function( request, errorCode, errorText) {
                alert( errorCode + "\n" + errorText);
            },
            beforeSend : function() {},
            terminate : function() {}
        });
    });
});
