class ChatEngine{
    constructor(chatId, userEmail){
        this.chatId = $(`#${chatId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000/');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log("Connection established with sockets.");

            self.socket.emit("join_room", {
                user_email: self.userEmail,
                chatroom: 'frstchatrm'
            });

            self.socket.on("user_joined", function(data){
                console.log(`User ${data.user_email} has joined`);
            });
        });

        $('#send-message').click(function(){
            let msg = $('#messege-text').val();

            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'frstchatrm'
                });
            }
        });

        self.socket.on('recieve_message', function(data){
            console.log("message recieved", data.message);

            let newMessage = $('<li>');
            let messageType = 'Othermessage';

            if(data.user_email == self.userEmail){
                messageType = 'selfmessage';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#text-list').append(newMessage);
        });
    }
}