
//  thsi function is used as a middleware for authorization for adding new item in database

const authorise = (permitedRole) =>{
      
    return (req, res, next)=>{
         
        const user = req.user ;
        console.log("user", user);
       let isAuthorize = false;

       permitedRole.map((role)=>{
          if(user?.role?.includes(role)){
             isAuthorize = true ;
          }
       })
          if(isAuthorize){
            return next();
          }else{
             return res.status(401).send("User is not authorized for the change ")
          }

        
    }

    
 }


module.exports = authorise;