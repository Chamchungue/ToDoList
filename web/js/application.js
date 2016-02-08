var wait = $("<div class='hidden'>Wait a moment</div>");

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
            tickets.closest().prepend(wait);
        },
        complete: function () {
            wait.detach();
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
    alert('editTicket');
}

function getTime() {
    return new Date().getTime();
}

var form = {
    summary: {text: 'Summary', node: $('#summary')},
    description: {text: 'Description', node: $('#description')}
};

function isUnEditForm(o, node) {
    return( node.val().trim() == '' || node.val().trim() == o['text'] && node.css("color") != 'rgb(0, 0, 0)')
}

function loadForm() {
    function setForm(o) {
        function setTextAndColor(node, text, force) {
            if (force || isUnEditForm(o, node)) {
                node.val(text);
                node.css({color: text ? '#aaa' : '#000'});
            }
        }

        setTextAndColor(o['node'], o['text'], true);
        o['node'].on({
            focusin: function () {
                setTextAndColor(o['node'], '');
            },
            focusout: function () {
                setTextAndColor(o['node'], o['text']);
            }
        });
    }

    setForm(form.summary);
    setForm(form.description);
    $('#dueDate').val('');
}

function toggleForm(element) {
    $('.listTickets').toggle();
    $('.form').toggleClass('hidden');
    element.text(element.text() == 'Back' ? 'Add' : 'Back');
    loadForm();
}

function hideForm() {
    $('.listTickets').show();
    $('.form').addClass('hidden');
    $('.addTicket').text('Add');
}

function checkTicket(element) {
    var divAlert = $('<div class="alert">Field missing</div>');
    var summaryNode = element.find('#summary');
    var summary = "";
    if (isUnEditForm(form.summary, summaryNode)) {
        divAlert.hide();
        summaryNode.after(divAlert);
        divAlert.slideDown(500);
        divAlert.delay(3000).slideUp(500);
        return null;
    } else {
        summary = summaryNode.val().trim();
    }
    var descriptionNode = element.find('#description');
    var description = "";
    if (!isUnEditForm(form.description, descriptionNode)) {
        description = descriptionNode.val().replace(new RegExp('\n', 'gi'), '<br/>');
    }
    var dueDate = element.find('#dueDate').val();
    return {
        summary: summary,
        description: description,
        dueDate: dueDate
    };
}

function addNewTicket(element, o) {
    var div = $('div.listTickets');
    $.ajax({
        type: element.data('method'),
        url: element.data('url'),
        data: o,
        headers: o,
        success: function (response) {
            hideForm();
            appendTickets(div, $(response));
        },
        error: function (request, errorCode, errorText) {
            var error = $('<div>Impossible de créer ce ticket</div>');
            error.hide();
            element.after(error);
            error.slideDown(500);
            error.delay(1000).slideUp(500);
        },
        beforeSend: function () {
            div.prepend(wait);
        },
        complete: function () {
            wait.detach();
        }
    });
}

function appendTickets(parent, tickets) {
    parent.append(tickets);
    tickets.ready(function () {
        addDeleteEvent(tickets);
        addClickEvent(tickets)
    });
}

$(document).ready(function () {
    var div = $('div.listTickets');

    function getTickets(element) {
        stopSelected();
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
            data: {},
            success: function (response) {
                appendTickets(div, $(response));
            },
            error: function (request, errorCode, errorText) {
                console.log(errorCode + "\n" + errorText);
            },
            beforeSend: function () {
                div.append(wait);
            },
            complete: function () {
                wait.detach();
            }
        });
    }

    getTickets(div);
    $('.addTicket').on('click', function () {
        toggleForm($(this));
    });
    $('.getTickets').on('click', function () {
        hideForm();
        div.find('.ticket').remove();
        getTickets($(this));
    });
    $('.deleteTickets').on('click', function () {
        deleteElement($('.selected'), $(this).data('url'), $(this).data('method'));
    });
    $('#submit').on('click', function () {
        var newTicket = $(this).closest('#newTicket');
        var properties = checkTicket(newTicket);
        if (properties) {
            addNewTicket($(this), properties);
        }
    });
    $('#dueDate').on('focusin', function () {
        $(this).datepicker({ dateFormat: 'dd/mm/yy' });
    });
});
