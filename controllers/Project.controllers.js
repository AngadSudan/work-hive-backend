import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Project from '../models/Project.models.js';
import User from '../models/User.models.js';
import { CloudinaryUpload } from '../utils/Cloudinary.js';
const createProject = async (req, res) => {
  const {
    user,
    name,
    description,
    organizationId,
    projectLead,
    IdleDeadline,
    projectStatus,
    priority,
  } = req.body;

  if (
    !name ||
    !description ||
    !organizationId ||
    !projectLead ||
    !IdleDeadline ||
    !projectStatus ||
    !priority
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const prdfile = req.files?.prd[0]?.path;
  const projectImage = req.files?.projectImg[0]?.path;

  try {
    //check if user exists
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(404).json(new ApiError(404, 'User not found'));

    //check if organization exists
    const dbOrganization = await Organization.findById(organizationId);
    if (!dbOrganization)
      return res.status(404).json(new ApiError(404, 'Organization not found'));
    // check if prd exists then upload on cloudinary
    let prdfileImageLink = '';
    let projectImageLink = '';
    if (prdfile) {
      const respnose = await CloudinaryUpload(prdfile);
      if (!response)
        return res.status(500).json(new ApiError(500, 'PRD file not uploaded'));

      prdfileImageLink = response.secure_url;
    } //upload prd file on cloudinary
    if (projectImage) {
      const response = await CloudinaryUpload(projectImage);

      if (!response)
        return res
          .status(500)
          .json(new ApiError(500, 'Project image not uploaded'));

      projectImageLink = response.secure_url;
    } //upload project image on cloudinary

    //create project
    const project = {
      name,
      description,
      organizationId,
      projectLead,
      imageUrl: projectImageLink || '',
      deadline: IdleDeadline,
      projectStatus: 'active',
      priority,
      prd: prdfileImageLink || '',
      status: 'active',
      createdBy: user,
    };
    const createdProject = await Project.create(project);
    if (!createdProject)
      return res.status(500).json(new ApiError(500, 'Project not created'));

    return res
      .status(201)
      .json(
        new ApiResponse(201, 'Project created successfully', createdProject)
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};

const updateProject = async (req, res) => {
  const projectid = req.params.id;
  const user = req.user._id;

  if (!projectid || !user)
    return res
      .status(400)
      .json(new ApiError(400, 'Project id and user id is required'));

  const { name, description, projectLead, IdleDeadline, priority, createdBy } =
    req.body;

  const prdfile = req.files?.prd[0]?.path;
  const projectImage = req.files?.projectImg[0]?.path;

  if (
    !name ||
    !description ||
    !projectLead ||
    !IdleDeadline ||
    !priority ||
    !createdBy
  )
    return res.status(400).json(new ApiError(400, 'No changes found'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res.status(404).json(new ApiError(404, 'User not found'));

    const dbProject = await Project.findById(projectid);
    if (!dbProject)
      return res.status(404).json(new ApiError(404, 'Project not found'));

    if (dbProject.createdBy.toString() !== user.toString())
      return res
        .status(403)
        .json(
          new ApiError(403, 'You are not authorized to update this project')
        );

    let prdfileImageLink = dbProject.prd;
    let projectImageLink = dbProject.imageUrl;

    if (prdfile) {
      const response = await CloudinaryUpload(prdfile);
      if (!response)
        return res.status(500).json(new ApiError(500, 'PRD file not uploaded'));

      prdfileImageLink = response.secure_url;
    }
    if (projectImageLink) {
      const response = await CloudinaryUpload(projectImage);
      if (!response)
        return res
          .status(500)
          .json(new ApiError(500, 'Project image not uploaded'));

      projectImageLink = response.secure_url;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      dbProject._id,
      {
        name,
        description,
        projectLead,
        deadline: IdleDeadline,
        priority,
        prd: prdfileImageLink,
        imageUrl: projectImageLink,
        createdBy,
      },
      { new: true }
    );

    if (!updatedProject)
      return res.status(500).json(new ApiError(500, 'Project not updated'));

    return res
      .status(200)
      .json(
        new ApiResponse(200, 'Project updated successfully', updatedProject)
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};
const findProjectById = async (req, res) => {
  const projectId = req.user._id;

  if (!projectId)
    return res.status(400).json(new ApiError(400, 'Project id is required'));

  try {
    const dbProject = await Project.findById(projectId);
    if (!dbProject)
      return res.status(404).json(new ApiError(404, 'Project not found'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'Project found', dbProject));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};
const findByProjectStatus = async (req, res) => {
  const status = req.params.status;

  if (!status)
    return res.status(400).json(new ApiError(400, 'Status is required'));

  const user = req.user._id;

  try {
    const dbUser = await User.findById(user);
    if (!dbUser) {
      return res
        .status(400)
        .json(new ApiError(400, 'no registered user in the database'));
    }

    const dbProjects = await Project.find({
      projectStatus: status,
      organizationId: dbUser.organization,
    });

    if (!dbProjects) {
      return res.status(400).json(new ApiError(400, 'no user Projects found'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          2000,
          'project has been created Successfully',
          dbProjects
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'error in craeting the projects'));
  }
};
const findByPriortiy = async (req, res) => {
  const priority = req.params.priority;

  if (!priority)
    return res.status(400).json(new ApiError(400, 'Status is required'));

  const user = req.user._id;

  try {
    const dbUser = await User.findById(user);
    if (!dbUser) {
      return res
        .status(400)
        .json(new ApiError(400, 'no registered user in the database'));
    }

    const dbProjects = await Project.find({
      priority: priority,
      organizationId: dbUser.organization,
    });

    if (!dbProjects) {
      return res.status(400).json(new ApiError(400, 'no user Projects found'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          2000,
          'project has been created Successfully',
          dbProjects
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'error in craeting the projects'));
  }
};

const changeProjectStatus = async (req, res) => {
  const user = req.user._id;
  const projectid = req.params.id;
  const { status } = req.body;
  if (!status)
    return res.status(400).json(new ApiError(400, 'updated status required'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res
        .status(400)
        .json(new ApiError(400, 'no registered user in the database'));

    const dbProject = await Project.findById(projectid);
    if (!dbProject)
      return res
        .status(400)
        .json(new ApiError(400, ' error in creation of user project'));

    if (dbProject.createdBy.toString() !== user.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, 'You are not authorized to update this project')
        );
    }

    if (dbProject.status === status) {
      return res
        .status(200)
        .json(new ApiResponse(200, 'status is already the same', dbProject));
    }

    const updatedProject = await Project.findByIdAndUpdate(
      dbProject._id,
      {
        status: status,
      },
      { new: true }
    );

    if (!updatedProject)
      return res
        .status(500)
        .json(new ApiError(500, 'error in updaing the project status'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'project status updated', updatedProject));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'error in changing the status'));
  }
};
const changePriority = async (req, res) => {
  const user = req.user._id;
  const projectid = req.params.id;
  const { priority } = req.body;
  if (!priority)
    return res.status(400).json(new ApiError(400, 'updated status required'));

  try {
    const dbUser = await User.findById(user);
    if (!dbUser)
      return res
        .status(400)
        .json(new ApiError(400, 'no registered user in the database'));

    const dbProject = await Project.findById(projectid);
    if (!dbProject)
      return res
        .status(400)
        .json(new ApiError(400, ' error in creation of user project'));

    if (dbProject.createdBy.toString() !== user.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, 'You are not authorized to update this project')
        );
    }

    if (dbProject.priority === priority) {
      return res
        .status(200)
        .json(new ApiResponse(200, 'priority is already the same', dbProject));
    }

    const updatedProject = await Project.findByIdAndUpdate(
      dbProject._id,
      {
        priority: priority,
      },
      { new: true }
    );

    if (!updatedProject)
      return res
        .status(500)
        .json(new ApiError(500, 'error in updaing the project priority'));

    return res
      .status(200)
      .json(new ApiResponse(200, 'project priority updated', updatedProject));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'error in changing the status'));
  }
};
export {
  createProject,
  updateProject,
  findProjectById,
  findByProjectStatus,
  findByPriortiy,
  changeProjectStatus,
  changePriority,
};
