Da Capo is an app that allows musicians to connect with each other by asking
and answering questions in forums.

I began this project with the intention of building an environment that could incubate a rich community of musicians.  To simplify this epic user story, I decided to start small.  I knew that one of the resources I wanted to have was a 'forum'.  A forum is a space where people can post a question or topic (or image) and other users can view the forum and hopefully comment on it.  I began work on that application with the express api template.  I built the forum resource, then moved to the client side because I didn't want to worry about relationships quite yet.  Once I was able to CRUD on the forum resource from the client, I went back to the API and struggled through conceptualizing the relationship between a forum and a 'comment', but eventually came up with a working structure.  I then moved back to the client side and made sure I could CRUD on comments.  At this point I had some 'good to haves' that I wanted to implement, such as only having buttons show up if the corresponding resource was owned by the current user.  This was challenging because there were views where there would be multiple comments owned by different users (unlike a blog where the entire view is owned by the user or not).
At this point, I pretty much had a working MVP and decided to try and implement AWS image uploads.  Installed several packages in both my client and api repos, and completed styling.
API repo: https://github.com/jonnykalani/da-capo-api
API deployed: https://morning-stream-87669.herokuapp.com
client repo: https://github.com/jonnykalani/da-capo-client
client deployed: jonnykalani.github.io/da-capo-client

Technologies used: Javascript, HTML, CSS, SASS, AJAX, HTTP, Express Node API, MongoDB, Mongoose, AWS, SDK, S3.

As a user, I'd like to be able to authenticate.
As a user, I'd like to be able to create a forum to discuss music topics.
As a user, I'd like to view forums that other users have created.
As a user, I'd like to be able to comment in other users' forums.
As a user, Id like to be able to search for forums with key words.
As a user. I'd like to utilize tags to find forums that are relevant to specific topics.

ERD: https://imgur.com/oavSCbw

resource routes:
.resources('examples')
.resources('forums', { except: ['destroy'] })
.resources('comments')
.resources('images')
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })
.get('/ownedforums/:id', 'forums#indexByUser')
.get('/ownedcomments/:id', 'comments#indexByUser')
.get('/forumcomments/:id', 'comments#indexByForum')
.get('/ownedimages/:id', 'images#indexByUser')
