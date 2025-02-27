import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Task from '../models/Task.models.js';
import User from '../models/User.models.js';
import Project from '../models/Project.models.js';
import Comment from '../models/Comment.models.js';
const createTask = async (req, res) => {
  const {
    name,
    description,
    user,
    allotedTeam,
    allotedTo,
    deadline,
    priority,
    credits,
    negativeReward,
  } = req.body;

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

    const dbTask = await Task.findById(task);
    if (!dbTask)
      return res.status(400).json(new ApiError(404, 'no such task found'));

    if (task !== dbTask.allotedTo)
      return res
        .status(400)
        .json(new ApiError(400, 'task is not alloted to you'));

    if (dbTask.status === status) {
      return res
        .status(400)
        .json(new ApiResponse(200, 'already set to this status'));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      dbTask._id,
      { status },
      { new: true }
    );
    if (!updatedTask)
      return res
        .status(500)
        .json(new ApiResponse(500, 'task status has been changed'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'task status has been changed', updatedTask));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, 'task status has been changed'));
  }
};
const changeTaskPriority = async (req, res) => {
  const user = req.user._id;
  const task = req.params.id;
  const { priority } = req.body;

  if (!task)
    return res
      .status(400)
      .json(new ApiError(400, 'task has been created successfully'));
  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));
  if (!priority)
    return res.status(400).json(new ApiError(400, 'task status found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));

    const dbTask = await Task.findById(task);
    if (!dbTask)
      return res.status(400).json(new ApiError(404, 'no such task found'));

    if (task !== dbTask.allotedTo)
      return res
        .status(400)
        .json(new ApiError(400, 'task is not alloted to you'));

    if (dbTask.priority === priority) {
      return res
        .status(400)
        .json(new ApiResponse(200, 'already set to this status'));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      dbTask._id,
      { priority },
      { new: true }
    );
    if (!updatedTask)
      return res
        .status(500)
        .json(new ApiResponse(500, 'task status has been changed'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'task status has been changed', updatedTask));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, 'task status has been changed'));
  }
};
const getTaskForUser = async (req, res) => {
  const user = req.user._id;

  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));

    const tasks = await Task.find({
      allotedTo: user,
      status: { $nin: ['completed', 'inactive'] },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};
const getOneTask = async (req, res) => {
  const { user } = req.body;

  try {
    const tasks = await Task.findOne({
      allotedTo: user,
      status: { $nin: ['completed', 'inactive'] },
    });
    if (!tasks)
      return res.status(200).json(new ApiResponse(200, 'no task found'));

    return res.status(200).json(new ApiResponse(200, 'task found', tasks));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};
const getTaskForProject = async (req, res) => {
  const user = req.user._id;
  const project = req.params.id;

  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));

  if (!project)
    return res.status(400).json(new ApiError(400, 'project id not found'));
  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));

    const dbProject = await Project.findById(project);
    if (!dbProject)
      return res.status(400).json(new ApiError(400, 'no project data found'));

    const tasks = await Task.find({
      allotedTo: user,
      status: { $nin: ['completed', 'inactive'] },
      project: dbProject._id,
    });

    if (!project)
      return res
        .status(200)
        .json(new ApiResponse(400, 'no task found for this project'));

    return res.status(200).json(new ApiResponse(200, 'task found', tasks));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};

const addReview = async (req, res) => {
  const { message } = req.body;
  const user = req.user._id;
  const taskId = req.params.id;

  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));
  if (!taskId)
    return res.status(400).json(new ApiError(400, 'task id not found'));
  if (!message)
    return res.status(400).json(new ApiResopnse(400, 'message not found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));

    const dbTask = await Task.findById(taskId);
    if (!dbTask)
      return res.status(400).json(new ApiError(400, 'no task data found'));

    const review = {
      message,
      postedBy: dbUser._id,
      taskId: dbTask._id,
    };

    const createdReview = await Comment.create(review);
    if (!createdReview)
      return res.status(500).json(new ApiError(500, 'internal error occured'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'review has been added', createdReview));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};
const updateReview = async (req, res) => {
  const { message } = req.body;
  const user = req.user._id;
  const review = req.params.id;

  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));
  if (!review)
    return res.status(400).json(new ApiError(400, 'task id not found'));
  if (!message)
    return res.status(400).json(new ApiResopnse(400, 'message not found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));

    const dbReview = await User.findById(review);
    if (!dbReview)
      return res.status(400).json(new ApiError(400, 'no review data found'));

    const updatedReview = await User.findByIdAndUpdate(
      dbReview._id,
      { message },
      { new: true }
    );

    if (!updatedReview)
      return res
        .status(400)
        .json(new ApiError(500, 'error in review updation'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'review updated', updatedReview));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};
const deleteReview = async (req, res) => {
  const { message } = req.body;
  const user = req.user._id;
  const review = req.params.id;

  if (!user)
    return res.status(400).json(new ApiError(400, 'user token not found'));
  if (!review)
    return res.status(400).json(new ApiError(400, 'task id not found'));
  if (!message)
    return res.status(400).json(new ApiResopnse(400, 'message not found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(400).json(new ApiError(400, 'no user data found'));

    const dbReview = await User.findById(review);
    if (!dbReview)
      return res.status(400).json(new ApiError(400, 'no review data found'));

    const updatedReview = await User.findByIdAndUpdate(
      dbReview._id,
      { status: 'hidden' },
      { new: true }
    );

    if (!updatedReview)
      return res
        .status(400)
        .json(new ApiError(500, 'error in review updation'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'review updated', updatedReview));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new ApiError(500, 'internal error occured'));
  }
};

export {
  createTask,
  changeTaskStatus,
  changeTaskPriority,
  addReview,
  updateReview,
  getTaskForUser,
  getTaskForProject,
  deleteReview,
  getOneTask,
};
