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
                    let newRemoveButton = buttonDom('Unfriend', `/user/removeFriend/${data.data.friend._id}`, 'REMOVEFRIEND');
                    $('#FriendAction').html(newRemoveButton);

                    new Noty({
                        theme: 'relax',
                        text: "Friend Added",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                    // Call removeFriend() after the new button is added to the DOM
                    removeFriend();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    };

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

                    // Call addFriend() after the new button is added to the DOM
                    addFriend();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    };

    let buttonDom = function (text, actionurl, ID) {
        return $(`
          <form id="${ID}" action="${actionurl}" method="post">
            <button type="submit" class="btn btn-primary">${text}</button>
          </form>
        `);
    };

    addFriend();

}