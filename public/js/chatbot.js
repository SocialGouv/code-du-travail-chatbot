(function (window, document) {

    var _         = null;
    var socket    = null;
    var connected = false;

    _ = {

        date: {

            /**
             * Return a boolean to tell if a date should appear
             * based on the previous message date.
             *
             * @return {string}   The formatted date.
             */
            visible: function (last) {

                if (!last) { return true; }

                const delta = Math.floor((new Date() - last)/1000);

                return delta > 60;
            },

            /**
             * Return a formatted date.
             *
             * @return {string}   The formatted date.
             */
            formatted: function () {

                var current = new Date();

                var hours   = ('0' + current.getHours()).slice(-2);
                var minutes = ('0' + current.getMinutes()).slice(-2);

                return hours + ':' + minutes;
            }

        },

        scroll: function () {
            var body  = $('.o-cb__body').get(0);
            body.scrollTop = body.scrollHeight;
        },

        /**
         * contains a set of functions related to messages,
         * (sending, receiving, displaying).
         *
         * @namespace
         */
        message: {

            // @todo : add comments.
            last: {

                date: {
                    user: null,
                    bot:  null
                },

                sent: {
                    user: false,
                    bot:  false
                }

            },

            /**
             * Create a chatbot message DOM element with the
             * given information and return it.
             *
             * @param {string}  who                   Who is talking ('bot' or 'user').
             * @param {string}  text                 The text of the message.
             * @param {boolean} [dateVisible=true]   Is the date supposed to appear.
             */
            common: function (who, text, dateVisible) {

                dateVisible = (typeof dateVisible === 'undefined') ? true : dateVisible;
                var label = who === 'bot' ? 'Code du travail' : 'Vous';

                var message           = document.createElement('div');
                    message.classList = 'c-cb__msg ' + 'c-cb__msg--' + who;

                var date           = document.createElement('span');
                    date.className = 'c-cb__msg__date';
                    date.innerHTML = label + ' - ' + _.date.formatted();

                var body           = document.createElement('div');
                    body.className = 'c-cb__msg__body';

                var content           = document.createElement('div');
                    content.className = 'c-cb__msg__body__content';
                    content.innerHTML = text;

                    body.appendChild(content);

                if (!dateVisible) message.className += ' c-cb__msg--no-date';

                message.appendChild(date);
                message.appendChild(body);

                return message;
            },

            /**
             * Take care of the display when the bot is answering.
             *
             * @param {string}  message   The message to display.
             */
            bot: function (message) {

                var body        = $('.o-cb__body').get(0);
                var dateVisible = _.date.visible(_.message.last.date.user) || _.message.last.sent.user;

                body.appendChild(_.message.common('bot', message, dateVisible));

                _.message.last.date.bot  = new Date();

                // @todo : change this to something a little bit better.
                _.message.last.sent.user = false;
                _.message.last.sent.bot  = true;
            },

            /**
             * Take care of the display when the user is answering
             * and emit a socket io event.
             *
             * @todo Maybe it should be a good idea to move the socket.io
             *       stuff into the listener.
             *
             * @param {string}  message   The message to display.
             */
            user: function (message) {

                var body        = $('.o-cb__body').get(0);
                var dateVisible = _.date.visible(_.message.last.date.user) || _.message.last.sent.bot;

                body.appendChild(_.message.common('user', message, dateVisible));

                _.message.last.date.user = new Date();

                _.message.last.sent.user = true;
                _.message.last.sent.bot  = false;

                socket.emit('message.user', message);
            }

        },

        /**
         * Contains a set of functions created to catch events
         * related to the user and bot actions.
         *
         * @namespace
         */
        listeners: {

            // Catch and process the events related to the user actions.
            user: function () {

                var body  = $('.o-cb__body').get(0);
                var input = $('.o-cb__footer__input');
                var icon  = $('.o-cb__footer__input__icon');

                function send (event) {
                    if (input.val().trim() === '') return false;
                    _.message.user(input.val());
                    input.val('');  // Empty the textarea.
                    _.scroll();
                }

                input.keypress(function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    if (code === 13) {  // ENTER key pressed.
                        event.preventDefault();
                        send();
                    }
                });

                icon.click(send);

            },

            // Catch and process the socket.io events related to the bot actions.
            bot: function () {

                socket.on('message.bot', function (data) {
                    const msg = data.fulfillmentText;
                    _.message.bot(msg);
                    _.scroll();
                });

                socket.on('disconnect', function () {
                    connected = false;
                    socket.open();
                });

                socket.on('connect', function () {
                    connected = true;
                    socket.emit('user.id', socket.id);
                })

                socket.on('test', function(data) {
                    console.log(data)
                });

                const chatbotWindow   = $('.o-cb');
                const chatbotHeader   = $('.o-cb__header__minimize-icon-wrapper');
                const chatbotOpenIcon = $('.o-cb-open-icon');

                chatbotHeader.click(function () { chatbotWindow.toggleClass('o-cb--minimized'); });
                chatbotOpenIcon.click(function () {
                    if (!connected) {
                      socket.open();
                    }
                    chatbotWindow.toggleClass('o-cb--minimized');
                });

            }

        }

    }

    window._ = _;

    $(function () {

        socket = io('http://localhost:4200', {
            autoConnect: false
        });

        _.listeners.user();
        _.listeners.bot();

    });

})(window, document);
