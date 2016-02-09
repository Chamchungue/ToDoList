/**
 * Constants to application
 * @type {{wait: (*|jQuery|HTMLElement), form: {summary: {text: string, node: (*|jQuery|HTMLElement)}, description: {text: string, node: (*|jQuery|HTMLElement)}}}}
 */
var constApp = {
    wait: $("<div>Wait a moment</div>"),
    form: {
        summary: {text: 'Summary', node: $('#summary')},
        description: {text: 'Description', node: $('#description')}
    }
};

$(document).ready(function () {
    // Initiate namespace
    nsApp.setTicketsParentElement($('.listTickets'));

    // First tickets loading
    nsApp.getTickets(nsApp.ticketsParentElement);

    // Initiate events
    nsApp.eventAddTicket();
    nsApp.eventGetTickets();
    nsApp.eventDeleteTickets();
    nsApp.eventForm();
});

/**
 * Namespace to application
 * @type {{ticketsParentElement: (*|jQuery|HTMLElement), setTicketsParentElement: setTicketsParentElement, deleteElement: deleteElement, eventDeleteTicket: eventDeleteTicket, eventTicket: eventTicket, startSelected: startSelected, stopSelected: stopSelected, editTicket: editTicket, getTime: getTime, isUnEditForm: isUnEditForm, loadForm: loadForm, toggleForm: toggleForm, hideForm: hideForm, showForm: showForm, checkTicket: checkTicket, addNewTicket: addNewTicket, appendTickets: appendTickets, getTickets: getTickets, eventAddTicket: eventAddTicket, eventGetTickets: eventGetTickets, eventDeleteTickets: eventDeleteTickets, eventForm: eventForm, eventSubmitForm: eventSubmitForm, eventDueDateForm: eventDueDateForm}}
 */
var nsApp = {
    ticketsParentElement: null,
    /**
     * initiate the parent element of tickets
     * @param ticketsParentElement : (*|jQuery|HTMLElement)
     */
    setTicketsParentElement: function (ticketsParentElement) {
        this.ticketsParentElement = ticketsParentElement;
    },
    /**
     * Delete the tickets given
     * @param tickets Tickets to remove
     * @param element element keeping the url and method
     */
    deleteElement: function (tickets, element) {
        var data = {id: []};
        for (var i = 0; i < tickets.length; i++) {
            var ticket = tickets.get(i);
            data.id[i] = $(ticket).data('id');
        }
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
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
     * Add delete event on .close element
     * @param parents
     */
    eventDeleteTicket: function (parents) {
        var closeElement = parents.find('.close');
        closeElement.on({
            click: function () {
                var closeElement = $(this);
                var ticket = closeElement.parent();
                nsApp.deleteElement(ticket, closeElement);
            },
            mouseenter: function () {
                $(this).parent().off();
            },
            mouseleave: function () {
                nsApp.eventTicket($(this).parent());
            }
        });
    },
    /**
     * Add click event on tickets
     * @param tickets
     */
    eventTicket: function (tickets) {
        var start;
        tickets.on({
            mousedown: function () {
                if (!$(this).hasClass('toSelect')) {
                    start = nsApp.getTime();
                }
            },
            mouseenter: function () {
                $(document).off();
            },
            mouseleave: function () {
                start = 0;
                nsApp.eventDocument();
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
     * start multi-select event
     * @param element
     */
    startSelected: function (element) {
        $('.close').hide();
        element.parent().find(element.get(0).localName + " " + element.selector).addClass('toSelect');
        element.toggleClass('selected');
        $('.deleteTickets').addClass('showAction');
    },
    /**
     * stop multi-select event
     */
    stopSelected: function () {
        $('.deleteTickets').removeClass('showAction');
        $('.selected').removeClass('selected');
        $('.toSelect').removeClass('toSelect');
        $('.close').show();
    },
    /**
     * Open editing ticket
     * @param ticket
     */
    editTicket: function (ticket) {
        var data = {
            id: ticket.data('id'),
            summary: ticket.find('.summary').text(),
            description: ticket.find('.description').html(), // to keep html tags
            dueDate: ticket.find('.dueDate').text()
        };
        for( var prop in data) {
            var value = data[prop];
            if( !value || typeof value != 'string') continue;
            value = value.replace( new RegExp('<br((\/)|( \/))?>', 'g'), '\n');
            value = value.decodeHTML();
            data[prop] = value.trim();
        }
        this.showForm(data);
    },
    /**
     * Gets current time
     * @returns {number}
     */
    getTime: function () {
        return new Date().getTime();
    },
    /**
     * Checks if node has been modified
     * @param o
     * @param node
     * @returns {boolean}
     */
    isUnEditForm: function (o, node) {
        return( node.val().trim() == '' || node.val().trim() == o['text'] && node.css("color") != 'rgb(0, 0, 0)')
    },
    /**
     * Load unedited form
     * @param [data]
     */
    loadForm: function ( data) {
        data = data || {};
        function setForm(o, value) {
            function setTextAndColor(node, text, force) {
                if (force || nsApp.isUnEditForm(o, node)) {
                    node.val(text);
                    node.css({color: text == o['text'] ? '#aaa' : '#000'});
                }
            }

            setTextAndColor(o['node'], value || o['text'], true);
            o['node'].on({
                focusin: function () {
                    setTextAndColor(o['node'], '');
                },
                focusout: function () {
                    setTextAndColor(o['node'], o['text']);
                }
            });
        }

        $('#newTicket').data('id', data['id']);
        setForm(constApp.form.summary, data['summary']);
        setForm(constApp.form.description, data['description']);
        $('#dueDate').val(data['dueDate']);
    },
    /**
     * Toggle the form
     */
    toggleForm: function () {
        var addTicket = $('.addTicket');
        addTicket.text(addTicket.text() == 'Back' ? 'Add' : 'Back');
        $('.listTickets').toggle();
        $('.form').toggleClass('hidden');
        this.loadForm();
    },
    /**
     * Hide the form
     */
    hideForm: function () {
        $('.listTickets').show();
        $('.form').addClass('hidden');
        $('.addTicket').text('Add');
    },
    /**
     * Show the form
     * @param [data]
     */
    showForm: function ( data) {
        $('.listTickets').hide();
        $('.form').removeClass('hidden');
        $('.addTicket').text('Back');
        this.loadForm( data);
    },
    /**
     * Check and return data if they are valid
     * @param element element with data
     * @returns {*} data to send
     */
    checkTicket: function (element) {
        var divAlert = $('<div class="alert">Field missing</div>');
        var summaryNode = element.find('#summary');
        var summary = "";
        if (this.isUnEditForm(constApp.form.summary, summaryNode)) {
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
        if (!this.isUnEditForm(constApp.form.description, descriptionNode)) {
            description = descriptionNode.val().replace(new RegExp('\n', 'gi'), '<br/>');
        }
        var dueDate = element.find('#dueDate').val();
        var id = element.data('id');
        return {
            id: id,
            summary: summary,
            description: description,
            dueDate: dueDate
        };
    },
    /**
     * Create a new ticket with data
     * @param element element keeping the url and method
     * @param data data to send
     */
    addNewTicket: function (element, data) {
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
            data: data,
            headers: data,
            success: function (response) {
                nsApp.hideForm();
                nsApp.ticketsParentElement.find('.ticket').remove();
                nsApp.getTickets(nsApp.ticketsParentElement);
            },
            error: function (request, errorCode, errorText) {
                var error = $('<div>Impossible de créer ce ticket</div>');
                error.hide();
                element.after(error);
                error.slideDown(500);
                error.delay(1000).slideUp(500);
            },
            beforeSend: function () {
                nsApp.ticketsParentElement.prepend(constApp.wait);
            },
            complete: function () {
                constApp.wait.detach();
            }
        });
    },
    /**
     * Append tickets and add events on them
     * @param tickets
     */
    appendTickets: function (tickets) {
        this.ticketsParentElement.append(tickets);
        tickets.ready(function () {
            nsApp.eventDeleteTicket(tickets);
            nsApp.eventTicket(tickets)
        });
    },
    /**
     * Getting all tickets
     * @param element data url element
     */
    getTickets: function (element) {
        this.stopSelected();
        $.ajax({
            type: element.data('method'),
            url: element.data('url'),
            data: {},
            success: function (response) {
                nsApp.appendTickets($(response));
            },
            error: function (request, errorCode, errorText) {
                console.log(errorCode + "\n" + errorText);
            },
            beforeSend: function () {
                nsApp.ticketsParentElement.append(constApp.wait);
            },
            complete: function () {
                constApp.wait.detach();
            }
        });
    },
    /**
     * Add showing-form event
     */
    eventAddTicket: function () {
        $('.addTicket').on('click', function () {
            nsApp.toggleForm();
            nsApp.stopSelected();
        });
    },
    /**
     * Add reloading event
     */
    eventGetTickets: function () {
        $('.getTickets').on('click', function () {
            nsApp.hideForm();
            nsApp.ticketsParentElement.find('.ticket').remove();
            nsApp.getTickets($(this));
        });
    },
    /**
     * Add deleting event
     */
    eventDeleteTickets: function () {
        $('.deleteTickets').on('click', function () {
            nsApp.deleteElement($('.selected'), $(this));
        });
    },
    /**
     * Add document event
     */
    eventDocument: function() {
        $(document).on( 'click', function() {
            nsApp.stopSelected();
        });
    },
    /**
     * Add events on form
     */
    eventForm: function () {
        this.eventDueDateForm();
        this.eventSubmitForm();
    },
    /**
     * Add event on #submit
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
     * Add event on #dueDate
     */
    eventDueDateForm: function () {
        $('#dueDate').on('focusin', function () {
            $(this).datepicker({ dateFormat: 'dd/mm/yy' });
        });
    }
};

String.prototype.decodeHTML = function() {
    var map = {"gt":">", "lt":"<", "amp":"&" /* , … */};
    return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
};
