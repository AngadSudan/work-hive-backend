import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Task from '../models/Task.models.js';
import User from '../models/User.models.js';

const createTask = async (req, res) => {
  const user = req.user._id;

  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));

  const {
    name,
    description,
    allotedTeam,
    allotedTo,
    deadline,
    priority,
    credits,
    negativeReward,
  } = req.body;

  if (
    !name ||
    !description ||
    !allotedTeam ||
    !allotedTo ||
    !priority ||
    !deadline
  ) {
    return res.status(400).json(new ApiError(400, 'need basic informations'));
  }

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res
        .status(400)
        .json(new ApiError(400, 'task needs to be created'));

    const task = {
      name,
      description,
      allotedTeam,
      allotedTo,
      deadline,
      priority,
      credits,
      negativeReward,
      status: 'pending',
    };

    const createdTask = await Task.create(task);
    if (!createdTask)
      return res.status(500).json(' some error occured in creation process');

    return res
      .status(200)
      .json(new ApiResponse(200, 'task has been created', createdTask));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};
const changeTaskStatus = async (req, res) => {
  const user = req.user._id;
  const task = req.params.id;
  const { status } = req.body;

  if (!task)
    return res
      .status(400)
      .json(new ApiError(400, 'task has been created successfully'));
  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));
  if (!status)
    return res.status(400).json(new ApiError(400, 'task status found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, 'task status has been changed'));
  }
};
const changeTaskPriority = async (req, res) => {};
const addReview = async (req, res) => {};
const updateReview = async (req, res) => {};
const deleteReview = async (req, res) => {};

export {
  createTask,
  changeTaskStatus,
  changeTaskPriority,
  addReview,
  updateReview,
  deleteReview,
};
