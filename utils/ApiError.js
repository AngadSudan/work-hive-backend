class ApiError {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = false;
  }
}

export default ApiError;
