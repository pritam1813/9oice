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
                    $('#posts-container>div').prepend(newPost);
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

    </div>`)
    }
    createPost();
}