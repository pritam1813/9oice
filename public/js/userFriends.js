{
    let addFriend = function () {

        let addfriendButton = $('#ADDFRIEND');

        addfriendButton.submit(function (e) {
            e.preventDefault();
            let self = $(this); // Store a reference to the clicked button

            $.ajax({
                type: 'post',
                url: self.prop('action'),
                success: function (data) {
                    console.log(data.data.friend);
                    let newRemoveButton = buttonDom('Unfriend', `/user/removeFriend/${data.data.friend._id}`, 'REMOVEFRIEND');
                    $('#FriendAction').html(newRemoveButton);

                    new Noty({
                        theme: 'relax',
                        text: "Friend Added",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                    // Attach event listener to Unfriend button if it exists
                    if ($('#REMOVEFRIEND').length > 0) {
                        removeFriend();
                    }
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    let removeFriend = function () {
        let removefriendButton = $('#REMOVEFRIEND');

        removefriendButton.submit(function (e) {
            e.preventDefault();
            let self = $(this); // Store a reference to the clicked button

            $.ajax({
                type: 'post',
                url: self.prop('action'),
                success: function (data) {
                    console.log(data.data);
                    let newAddButton = buttonDom('Add Friend', `/user/addFriend/${data.data.userId}`, 'ADDFRIEND');
                    $('#FriendAction').html(newAddButton);

                    new Noty({
                        theme: 'relax',
                        text: "Friend Removed",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                    // Attach event listener to Add Friend button if it exists
                    if ($('#ADDFRIEND').length > 0) {
                        addFriend();
                    }
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    let buttonDom = function (text, actionurl, ID) {
        return $(`
            <form id="${ID}" action="${actionurl}" method="post">
                <button type="submit" class="btn btn-primary">${text}</button>
            </form>
        `)
    }

    // Attach event listeners to buttons on page load
    addFriend();
    removeFriend();

}