const express = require('express');
const app = express();


const { mongoose } = require('./db/mongoose');

// lodaing mongoose models
const { List, Task, User } = require('./db/models');
const jwt = require('jsonwebtoken');
const { secret } = require('./db/models/user.model')



// middleware for body requests 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// auth middleware => checking for  valid jwt access token 

let auth = (req,res, next) => {
    let token = req.header('x-access-token');

    jwt.verify(token, secret, (err,decoded)=>{
        if(err) {
            // invalid jwt
            res.status(401).send(err)
        }
        else {
            req.user_id = decoded._id
            next();
        }

    })
}


// verify refresh token middleware
let verifySession = ((req,res,next)=> {
    let refreshToken = req.header('x-refresh-token');

    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user)=> {
        if(!user) {
            return Promise.reject({
                'error': 'user not found. make sure that rhe refresh token and user id are valid'
            })
        }
    req.user_id = user._id;
    req.userObject = user;
    req.refreshToken = refreshToken;

    let isSessionValid = false;


    user.sessions.forEach((session)=> {
        if(session.token === refreshToken) {
            if(User.hasRefreshTokenExpired(session.expiresAt) === false) {
                isSessionValid = true;

            }
        }
    });

    if (isSessionValid) {
        next();
    }
    else {
        return Promise.reject({
            'error': 'Refresh token has expired or the session is invalid'
        })
    }
 }).catch((err)=> {
     res.status(401).send(err);
     })
})


// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers','x-access-token,x-refresh-token,Origin, X-Requested-With, Content-Type, Accept, Authorization, _id, listId,, title');
    
    res.header('Access-Control-Expose-Headers',
    'x-access-token, x-refresh-token,');


    
    next();
});
// routes

// LIST METHODS

// GET/list => get all lists  _userId: req.user_id
app.get('/lists' , auth,   (req,res)=> {
    // array of lists in database that belong to the authenticated user !!!!!!
    List.find({
        _userId: req.user_id
    }).then((lists)=> {
        res.send(lists)
    })
})


// POST/lists => creating a list ,
app.post('/lists',auth, (req,res)=> {
    // creating a new list,, return the new list doc back to the user with id
    let title = req.body.title;

    let newList = new List  ({
        title,
        _userId: req.user_id
        
    });
    newList.save().then((listDocument)=> {
        res.send(listDocument)
    })
});

// PATCH/lists => updating a specific list
app.patch('/lists/:id' , auth , (req,res)=> {
   
    
    List.findOneAndUpdate({
        _id:req.params.id,
        _userId: req.user_id}, {
            $set:req.body
        }) 
    .then((result) => {
        console.log(result);
        res.send({message: result})
    })
    .catch((error) => {
        res.status(500).json({
            message:'failed to update'
        })
    })
    // List.findOneAndUpdate({
    //  _id:req.params.id,
    //  _userId:req.user_id }, {

    //     $set:req.body

    // }).then(()=> {
    //     res.send({'message': 'updated successfully'});
    // }).catch((err)=> {
    //     console.log(err, 'something is wrong with /lists/:d');
    // })
});

app.delete('/lists/:id', auth, (req,res)=> {
List.findOneAndRemove({
    _id:req.params.id,
    _userId: req.user_id
}).then((removedListDocument)=> {
        res.send(removedListDocument)

        // deleting tasks that are in the deleted lists
         deleteTasksFromLists(removedListDocument._id);
    })
});

// TASK REQUEST'S / METHODS
app.get('/lists/:listId/tasks', auth, (req,res)=> {
    // returning all tasks that belong to sa specific list
    Task.find({
        _listId : req.params.listId
    }).then((tasks)=> {
        res.send(tasks)
    })
});

// in case we want just one item
// app.get('/lists/:listId/tasks/:taskId', (req,res)=> {
//     Task.findOne({
//         _id:req.params.taskId,
//         _listId: req.params.listId
//     }).then((task)=> {
//         res.send(task)
//     })
// })

app.post('/lists/:listId/tasks', auth, (req,res)=> {
// creating a new task in the list !!!! 

List.findOne({
    _id:req.params.listId,
    _userId: req.user_id
}).then((list)=> {
    if(list) {
        // in case user is valid we can create a  new task
        return true
    }
    else {
        return false
    }
}).then((createTask)=> {
    if(createTask) {
        let newTasks = new Task({
       title:req.body.title,
       _listId: req.params.listId
     });
      newTasks.save().then((newTasksDocument)=> {
         res.send(newTasksDocument)
   })
    } else {
        res.json({'message': 'something went wrong, try again'})
    }
  })
   
})


app.patch('/lists/:listId/tasks/:taskId', auth, (req,res)=> {
    // updating an existing task
    List.findOne({
        _id:req.params.listId,
        _userId: req.user_id
    }).then((list)=> {
        if(list){
            return true
        } else {
            return false
        }
    }).then((canUpdate)=> {
        if(canUpdate) {
             Task.findByIdAndUpdate({ 
                _id:req.params.taskId,
                _listId: req.params.listId,
             }, 
             {
                $set:{
                    title:req.body.title, 
                    _id:req.body.id
                }
            }).then((result)=> {
                 res.send({message:result});
           })
        } else {
            return res.sendStatus(404);
        }
    }).catch((err)=> {
        console.log(err, 'something is wrong with patch/lists:id/tasks/task:id');
    })

   
})

app.delete('/lists/:listId/tasks/:taskId',auth,(req,res)=> {
     List.findOneAndDelete({
         _id:req.params.listId,
         _userId: req.user_id

     }).then((list)=> {
         if(list) {
             return true;
         }
         else {
             return false
         }
     }).then((canDelete)=> {
         if (canDelete) {
             Task.findOneAndRemove({
        _id:req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDocument)=> {
         res.send(removedTaskDocument)
       })
     } else {
         res.json({'message': 'not found'});
     }

         })
         

    
})

/** USER ROUTES
 * POST /users
 * SIGNUP
 */
app.post('/users', (req,res)=> {
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(()=> {
        return newUser.createSession();
    }).then((refreshToken)=> {

        return newUser.generateAccessAuthToken().then((accessToken)=> {
            return {accessToken, refreshToken}
        });
    }).then((authTokens)=> {
        res.header('x-refresh-token', authTokens.refreshToken);
          res.header('x-access-token', authTokens.accessToken);
           res.send(newUser);
    }).catch((err)=> {
        res.status(400).send(err)
    })
})

// USER LOGIN

app.post('/users/login', (req,res)=> {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredential(email,password).then((user)=> {
        return user.createSession().then((refreshToken)=> {

            return user.generateAccessAuthToken().then((accessToken)=> {
                return { accessToken, refreshToken }
            })
        }).then((authTokens)=> {
            res
               .header('x-refresh-token', authTokens.refreshToken)
               .header('x-access-token', authTokens.accessToken)
               .send(user);
               
        })
    }).catch((err)=> {
        res.status(400).send(err)
    });
});

// get method for user 

app.get('/users/me/access-token',verifySession, (req, res) => {
  req.userObject.generateAccessAuthToken().then((accessToken)=> {
      res.header('x-access-token', accessToken).send({accessToken});
  }).catch((err)=> {
      res.status(400).send('somethings is wrong with get users/me bla bla');
  })
})


// helper method

let deleteTasksFromLists = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(()=> {
        console.log("Tasks from" + _listId + " were deleted")
    })
}
app.listen(3000, ()=> {
    console.log('Server is listening on port 3000...');
})