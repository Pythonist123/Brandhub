import User from "../models/user.js";
import bcrypt from "bcrypt";
import UserDTO from "../DTO/UserDTO.js";
import jwt from "jsonwebtoken";
import cookie from "cookie"
// login user
// register user

const  userController = {

    //register
    async register(req, res,next) {
        try {
            console.log("Registering User");
            const { email, password } = req.body;
      
            // Check if the email already exists in the database
            const existingUser = await User.findOne({ email: email });
            
            if (existingUser) {
                const error = {
                    status: 400,
                    message: "Email already Registered, use another email",
                  };
                  return next(error);
            }
      
            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);
      
            // Create a new user using your User model
            const newUser = new User({
              email: email,
              password: hashedPassword,
            });

            const token = jwt.sign({ id: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

            // Save the user to the database
            await newUser.save();

            
            // Set the token as a cookie
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 3600, // Set the expiration time in seconds (1 hour in this example)
                sameSite: 'strict', // Adjust based on your security requirements
                path: '/', // Adjust based on your application's path structure
            }));

            console.log("User registered successfully");
            const userdto = new UserDTO(newUser._id,newUser.email);
            res.status(201).json({ message: 'User registered successfully',  user:userdto.getProperties()});
           

          } catch (Error) {
            console.error('Error registering user:', Error);
            const error = {
                status : 500,
                message:"Internal Server Error"
            }
            return next(error);
          }
        
      },
    
      async login(req, res, next) {
        try {
            console.log('Logging User:')
          const { email, password } = req.body;
    
          // Check if the user with the provided email exists
          const user = await User.findOne({ email });
    
          if (!user) {
         
            const error = {
                status:401,
                message:'Invalid email or password'
            }
            
            return next(error);
          }
    
          // Compare the provided password with the hashed password in the database

          const passwordMatch = await bcrypt.compare(password, user.password);
    
          if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
          }
    
          // At this point, the user is authenticated
          // You might want to generate a token or set a session here
          const userdto = new UserDTO(user._id,user.email);
            // After successfully authenticating, create a JWT token

            const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });

            // Set the token as a cookie
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            maxAge: 3600, // Set the expiration time in seconds (1 hour in this example)
            sameSite: 'strict', // Adjust based on your security requirements
            path: '/', // Adjust based on your application's path structure
            }));

          res.status(200).json({ message: 'Login successful', user:userdto.getProperties() });
        // res.status(201).json({token});
        } catch (error) {
          // Handle any errors that occur during the login process
          next(error);
        }
      }
}

export default userController;