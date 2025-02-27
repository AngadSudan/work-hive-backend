import User from '../models/User.models.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import dotenv from 'dotenv';
import { CloudinaryUpload } from '../utils/cloudinary.js'; // Assuming you have this utility
dotenv.config();

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    employeeNumber,
    userName,
    organization,
  } = req.body;

  // Validation checks
  if (!name) {
    return res.status(400).json(new ApiError(400, 'Name is required'));
  }
  if (!email)
    return res.status(400).json(new ApiError(400, 'Email is required'));
  if (!password)
    return res.status(400).json(new ApiError(400, 'Password is required'));
  if (!employeeNumber)
    return res
      .status(400)
      .json(new ApiError(400, 'Employee number is required'));
  if (!userName)
    return res.status(400).json(new ApiError(400, 'Username is required'));
  if (!organization)
    return res.status(400).json(new ApiError(400, 'Organization is required'));

  // Create the user
  try {
    const createdUser = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      employeeNumber,
      userName,
      organization,
      isActive: true,
    });

    if (!createdUser)
      return res.status(400).json(new ApiError(400, 'User not created'));

    // Remove password from response
    const userWithoutPassword = createdUser.toObject();
    delete userWithoutPassword.password;

    return res
      .status(201)
      .json(
        new ApiResponse(201, 'User created successfully', userWithoutPassword)
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong', [error.message]));
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    role,
    employeeNumber,
    userName,
    credits,
    organization,
  } = req.body;
  const profileImage = req.file?.path;

  // Verify user exists
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Prepare update object
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (employeeNumber) updateData.employeeNumber = employeeNumber;
    if (userName) updateData.userName = userName;
    if (credits !== undefined) updateData.credits = credits;
    if (organization) updateData.organization = organization;

    // Handle profile image if provided
    if (profileImage) {
      try {
        updateData.profileImageUrl = await CloudinaryUpload(profileImage);
      } catch (error) {
        return res
          .status(500)
          .json(
            new ApiError(500, 'Something went wrong in image uploading', [
              error.message,
            ])
          );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    return res
      .status(200)
      .json(new ApiResponse(200, 'User updated successfully', updatedUser));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong', [error.message]));
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, 'User deleted successfully', {}));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong', [error.message]));
  }
};

const changeRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json(new ApiError(400, 'Role is required'));
  }

  // Validate role is one of the allowed values
  const allowedRoles = ['lead', 'employee', 'admin', 'manager'];
  if (!allowedRoles.includes(role)) {
    return res
      .status(400)
      .json(
        new ApiError(400, `Role must be one of: ${allowedRoles.join(', ')}`)
      );
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!updatedUser) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, 'User role updated successfully', updatedUser)
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong', [error.message]));
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email or username is provided
  if (!email) {
    return res
      .status(400)
      .json(new ApiError(400, 'Email or username is required'));
  }

  if (!password) {
    return res.status(400).json(new ApiError(400, 'Password is required'));
  }

  try {
    // Find user by email or username
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json(new ApiError(401, 'Invalid credentials'));
    }

    return res.status(200).json(
      new ApiResponse(200, 'Login successful', {
        user: user,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong', [error.message]));
  }
};

const calculateEfficiency = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Assuming you have Task model and want to calculate efficiency
    // This is a placeholder implementation - modify as needed
    const tasks = await Task.find({ assignedTo: userId });

    if (!tasks.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, 'No tasks found for user', { efficiency: 0 })
        );
    }

    // Calculate efficiency metrics
    const completedTasks = tasks.filter((task) => task.status === 'completed');
    const completedOnTime = completedTasks.filter(
      (task) => new Date(task.completedAt) <= new Date(task.dueDate)
    );

    const efficiency = {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completedOnTime: completedOnTime.length,
      efficiencyRate: (completedTasks.length / tasks.length) * 100,
      onTimeRate: completedTasks.length
        ? (completedOnTime.length / completedTasks.length) * 100
        : 0,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, 'Efficiency calculated successfully', efficiency)
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong', [error.message]));
  }
};

export {
  registerUser,
  updateUser,
  deleteUser,
  changeRole,
  loginUser,
  calculateEfficiency,
};
