{
    //Method to submit the form Data using Ajax
    let createPost = function(){

        //Getting the post creation from
        let postForm = $('#create-post-form');      

        postForm.submit(function(e){
            e.preventDefault();                     //preventing submission via default process

            $.ajax({                                //Submitting form data with Ajax
                type: 'post',
                url: '/posts/create',
                data: postForm.serialize(),         //Converting the data into json format
                success: function(data){
                    let newPost = postDom(data.data.post);
                    $('#posts-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    //method to create post in DOM
    let postDom = function(post){
        return $(`<div class="row row-cols-1 posts" id="posts-${post._id}">
        <div class="col text-start" id="name-col">
            ${post.user.name}
        </div>
        <div class="col" id="post-col">
            ${post.content}
        </div>

            <div class="col" id="like-share">
                <span class="m-2"><a href="#">Like</a></span>
                <span class="m-2"><a href="#">Share</a></span>

                <span class="m-2"><a class="delete-post-button" href="/posts/destroy/${post._id}">Delete</a></span>

            </div>
        <div id="post-comment-${post._id}">
            <div class="col" id="comment-col">
                <form id="commentForm-${post._id}" action="/comment/create" method="post" >
                    <input type="text" class="form-control" name="content" id="commentbox" placeholder="Comment" required>
                    <input type="hidden" name="post" value="${post._id}">
                    <button type="submit" class="btn btn-primary">Add Comment</button>
                </form>
            </div>
        </div>
    </div>`)
    }

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'delete',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#posts-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, 
                error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    let convertPoststoAJAX = function(){
        $('#posts-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);
        });
    }
    createPost();
    convertPoststoAJAX();
}