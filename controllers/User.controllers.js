import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const registerUser = async (req, res) => {
  try{
    const{name, email,password, role}=req.body;

    let user = await User.find({email});
    if(user){
      throw new ApiError(400,'User already there');
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'intern',
    });
    await user.save();

    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }

  };


const updateUser = async (req, res) => {

  try{
    const{name, email ,role}= req.body;
    const user =await User.findById(req.params.id);

    if(!user){
      throw new ApiError(404, 'User not found');
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  
  }};


const deleteUser = async (req, res) => {
  try{
    const user = await findByIdAndDelete(req.params.id);

    if(!user){
      throw new ApiError(404,'User Not found');
    }
    res.status(200).json(new ApiResponse(200,user,'User deleted succ'));
  }catch(error){
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};

const changeRole = async (req, res) => {
  try{
    const{role}=req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
    };



const loginUser = async (req, res) => {
  try{
    const{ email, password}=req.body;
    const user = await User.findOne({email});

    if(!user){
      throw new ApiError(401, 'Invalid email or password');
    }
// Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json(new ApiResponse(200, { token, user }, 'Login successful'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }


};
const calculateEfficiency = async (req, res) => {};
// const getUser= async (req ,res )=>{}
const forgotPassword = async (req, res) => {};

export {
  registerUser,
  updateUser,
  changeRole,
  deleteUser,
  loginUser,
  calculateEfficiency,
  forgotPassword,
};
