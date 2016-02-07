function deleteElement(tickets, url, methode) {
    var data = {id: []};
    for (var i = 0; i < tickets.length; i++) {
        var ticket = tickets.get(i);
        data.id[i] = $(ticket).data('id');
    }
    $.ajax({
        type: methode || 'DELETE',
        url: url,
        data: data,
        headers: data,
        success: function (response) {
            tickets.remove();
            stopSelected();
        },
        error: function (request, errorCode, errorText) {
            console.log('Impossible de supprimer ce ticket');
        },
        beforeSend: function () {
        },
        terminate: function () {
        }
    });
}

function addDeleteEvent(parent) {
    var closeElement = parent.find('.close');
    closeElement.on({
        click: function () {
            var closeElement = $(this);
            var ticket = closeElement.parent();
            deleteElement(ticket, closeElement.data('url'), closeElement.data('method'));
        },
        mouseenter: function () {
            $(this).parent().off();
        },
        mouseleave: function () {
            addClickEvent($(this).parent());
        }
    });
}

function addClickEvent(element) {
    var start;
    element.on({
        mousedown: function () {
            if (!$(this).hasClass('toSelect')) {
                start = getTime();
            }
        },
        mouseleave: function () {
            start = 0;
        },
        mouseup: function () {
            if (!$(this).hasClass('toSelect')) {
                if (getTime() >= ( start + 500 )) {
                    startSelected($(this));
                } else {
                    editTicket($(this));
                }
            } else {
                $(this).toggleClass('selected');
                if (!$('.selected').length) stopSelected();
            }
        }
    });
}

function startSelected(element) {
    $('.close').hide();
    element.parent().find(element.get(0).localName + " " + element.selector).addClass('toSelect');
    element.toggleClass('selected');
    $('.deleteTickets').addClass('showAction');
}

function stopSelected() {
    $('.deleteTickets').removeClass('showAction');
    $('.selected').removeClass('selected');
    $('.toSelect').removeClass('toSelect');
    $('.close').show();
}

function editTicket(element) {
    alert('test');
}

function getTime() {
    return new Date().getTime();
}

$(document).ready(function () {
    var div = $('div.listTickets');

    function appendAjax(element) {
        stopSelected();
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
            data: {},
            success: function (response) {
                var result = $(response);
                div.append(result);
                result.ready(function () {
                    addDeleteEvent(result);
                    addClickEvent(result)
                });
            },
            error: function (request, errorCode, errorText) {
                console.log(errorCode + "\n" + errorText);
            },
            beforeSend: function () {
            },
            terminate: function () {
            }
        });
    }

    appendAjax(div);
    $('.addTicket').on('click', function () {
        $('.listTickets').toggle();
        $('.form').toggle();
        //appendAjax($(this));
    });
    $('.getTickets').on('click', function () {
        $('.listTickets').show();
        $('.form').hide();
        div.find('.ticket').remove();
        appendAjax($(this));
    });
    $('.deleteTickets').on('click', function () {
        deleteElement($('.selected'), $(this).data('url'), $(this).data('method'));
    });
});
