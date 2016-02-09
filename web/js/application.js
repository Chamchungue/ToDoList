var constApp = {
    wait: $("<div>Wait a moment</div>"),
    form: {
        summary: {text: 'Summary', node: $('#summary')},
        description: {text: 'Description', node: $('#description')}
    }
};
$(document).ready(function () {
    var div = $('div.listTickets');

    nsApp.getTickets(div, div);

    nsApp.eventAddTicket();
    nsApp.eventGetTickets(div);
    nsApp.eventDeleteTickets();
    nsApp.eventForm();
});

var nsApp = {
    /**
     *
     * @param tickets
     * @param url
     * @param methode
     */
    deleteElement: function (tickets, url, methode) {
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
                nsApp.stopSelected();
            },
            error: function (request, errorCode, errorText) {
                console.log('Impossible de supprimer ce ticket');
                for (var i = 0; i < tickets.length; i++) {
                    var ticket = $(tickets.get(i));
                    nsApp.eventDeleteTicket(ticket);
                }
            },
            beforeSend: function () {
                $('.deleteTickets').off();
                tickets.find('.close').off();
                tickets.closest().prepend(constApp.wait);
            },
            complete: function () {
                constApp.wait.detach();
                nsApp.eventDeleteTickets();
            }
        });
    },
    /**
     *
     * @param parents
     */
    eventDeleteTicket: function (parents) {
        var closeElement = parents.find('.close');
        closeElement.on({
            click: function () {
                var closeElement = $(this);
                event.stopImmediatePropagation();
                event.stopPropagation();
                var ticket = closeElement.parent();
                nsApp.deleteElement(ticket, closeElement.data('url'), closeElement.data('method'));
            },
            mouseenter: function () {
                $(this).parent().off();
            },
            mouseleave: function () {
                nsApp.eventClickTicket($(this).parent());
            }
        });
    },
    /**
     *
     * @param element
     */
    eventClickTicket: function (element) {
        var start;
        element.on({
            mousedown: function () {
                if (!$(this).hasClass('toSelect')) {
                    start = nsApp.getTime();
                }
            },
            mouseleave: function () {
                start = 0;
            },
            mouseup: function () {
                if (!$(this).hasClass('toSelect')) {
                    if (nsApp.getTime() >= ( start + 400 )) {
                        nsApp.startSelected($(this));
                    } else {
                        nsApp.editTicket($(this));
                    }
                } else {
                    $(this).toggleClass('selected');
                    if (!$('.selected').length) nsApp.stopSelected();
                }
            }
        });
    },
    /**
     *
     * @param element
     */
    startSelected: function (element) {
        $('.close').hide();
        element.parent().find(element.get(0).localName + " " + element.selector).addClass('toSelect');
        element.toggleClass('selected');
        $('.deleteTickets').addClass('showAction');
    },
    /**
     *
     */
    stopSelected: function () {
        $('.deleteTickets').removeClass('showAction');
        $('.selected').removeClass('selected');
        $('.toSelect').removeClass('toSelect');
        $('.close').show();
    },
    /**
     *
     * @param element
     */
    editTicket: function (element) {
        alert('editTicket');
    },
    /**
     *
     * @returns {number}
     */
    getTime: function () {
        return new Date().getTime();
    },
    /**
     *
     * @param o
     * @param node
     * @returns {boolean}
     */
    isUnEditForm: function (o, node) {
        return( node.val().trim() == '' || node.val().trim() == o['text'] && node.css("color") != 'rgb(0, 0, 0)')
    },
    /**
     *
     */
    loadForm: function () {
        function setForm(o) {
            function setTextAndColor(node, text, force) {
                if (force || nsApp.isUnEditForm(o, node)) {
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

        setForm(constApp.form.summary);
        setForm(constApp.form.description);
        $('#dueDate').val('');
    },
    /**
     *
     * @param element
     */
    toggleForm: function (element) {
        $('.listTickets').toggle();
        $('.form').toggleClass('hidden');
        element.text(element.text() == 'Back' ? 'Add' : 'Back');
        nsApp.loadForm();
    },
    /**
     *
     */
    hideForm: function () {
        $('.listTickets').show();
        $('.form').addClass('hidden');
        $('.addTicket').text('Add');
    },
    /**
     *
     * @param element
     * @returns {*}
     */
    checkTicket: function (element) {
        var divAlert = $('<div class="alert">Field missing</div>');
        var summaryNode = element.find('#summary');
        var summary = "";
        if (nsApp.isUnEditForm(constApp.form.summary, summaryNode)) {
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
        if (!nsApp.isUnEditForm(constApp.form.description, descriptionNode)) {
            description = descriptionNode.val().replace(new RegExp('\n', 'gi'), '<br/>');
        }
        var dueDate = element.find('#dueDate').val();
        return {
            summary: summary,
            description: description,
            dueDate: dueDate
        };
    },
    /**
     *
     * @param element
     * @param o
     */
    addNewTicket: function (element, o) {
        var div = $('div.listTickets');
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
            data: o,
            headers: o,
            success: function (response) {
                nsApp.hideForm();
                nsApp.appendTickets(div, $(response));
            },
            error: function (request, errorCode, errorText) {
                var error = $('<div>Impossible de créer ce ticket</div>');
                error.hide();
                element.after(error);
                error.slideDown(500);
                error.delay(1000).slideUp(500);
            },
            beforeSend: function () {
                div.prepend(constApp.wait);
            },
            complete: function () {
                constApp.wait.detach();
            }
        });
    },
    /**
     *
     * @param parent
     * @param tickets
     */
    appendTickets: function (parent, tickets) {
        parent.append(tickets);
        tickets.ready(function () {
            nsApp.eventDeleteTicket(tickets);
            nsApp.eventClickTicket(tickets)
        });
    },
    /**
     *
     * @param parent
     * @param element
     */
    getTickets: function (parent, element) {
        nsApp.stopSelected();
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
            data: {},
            success: function (response) {
                nsApp.appendTickets(parent, $(response));
            },
            error: function (request, errorCode, errorText) {
                console.log(errorCode + "\n" + errorText);
            },
            beforeSend: function () {
                parent.append(constApp.wait);
            },
            complete: function () {
                constApp.wait.detach();
            }
        });
    },
    /**
     *
     */
    eventAddTicket: function () {
        $('.addTicket').on('click', function () {
            nsApp.toggleForm($(this));
        });
    },
    /**
     *
     * @param div
     */
    eventGetTickets: function (div) {
        $('.getTickets').on('click', function () {
            nsApp.hideForm();
            div.find('.ticket').remove();
            nsApp.getTickets(div, $(this));
        });
    },
    /**
     *
     */
    eventDeleteTickets: function () {
        $('.deleteTickets').on('click', function () {
            nsApp.deleteElement($('.selected'), $(this).data('url'), $(this).data('method'));
        });
    },
    /**
     *
     */
    eventForm: function () {
        this.eventDueDateForm();
        this.eventSubmitForm();
    },
    /**
     *
     */
    eventSubmitForm: function () {
        $('#submit').on('click', function () {
            var newTicket = $(this).closest('#newTicket');
            var properties = nsApp.checkTicket(newTicket);
            if (properties) {
                nsApp.addNewTicket($(this), properties);
            }
        });
    },
    /**
     *
     */
    eventDueDateForm: function () {
        $('#dueDate').on('focusin', function () {
            $(this).datepicker({ dateFormat: 'dd/mm/yy' });
        });
    }
};