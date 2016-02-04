var i = 0;

function addDeleteEvent() {
    $(this).on('click', '.close', function () {
        $.ajax({
            type: 'DELETE',
            data: {
                id: $(this).data('id')
            },
            url: $(this).data('url'),
            success: function (response) {
                $(this).parent().remove();
            },
            error: function (request, errorCode, errorText) {
                console.log(errorCode + "\n" + errorText);
            },
            beforeSend: function () {
            },
            terminate: function () {
            }
        });
    });
}
function getElement(parent, elementName) {
    var element = parent.find(elementName);
    if (!element.length) element = $('<' + elementName + '/>').appendTo(parent);
    return element;
}

$(document).ready(function () {
    $('button.listTickets').on('click', function () {
        var ul = $('ul.listTickets');
        $.ajax({
            type: 'GET',
            url: $(this).data('url'),
            data: {},
            success: function (response) {
                ul.append(response);
                $(response).ready(addDeleteEvent);
            },
            error: function (request, errorCode, errorText) {
                console.log(errorCode + "\n" + errorText);
            },
            beforeSend: function () {
            },
            terminate: function () {
            }
        });
    });
});
