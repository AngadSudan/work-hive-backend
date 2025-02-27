import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Organization from '../models/Organization.models.js';
//create organization
const createOrganization = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const organization = await Organization.create({
      name,
      email,
      password,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, 'Organization created successfully', organization)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(new ApiResponse(400, 'Error creating organization'));
  }
};

const updateOrganization = async (req, res) => {};

const deleteOrganization = async (req, res) => {};

const getOrganizationById = async (req, res) => {};

export {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
};
