export  const loginSuccess = (req, res) =>{

    if(req.user){
        res.status(200).json({
            success:true, 
            message: "User authenticated successfully! ",
            user: req.user
        })
    }else{
        res.status(401).json({success: false, message: "Not authenticated "})
    }
}

export const  logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return res.status(500).json({success: false, message: 'Error logging out'})
        }
        req.session  = null ,
        req.redirect(process.env.CLIENT_URL)
    })
}