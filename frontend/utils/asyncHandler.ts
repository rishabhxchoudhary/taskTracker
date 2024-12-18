import ApiError from "../services/ApiError";
import ApiResponse from "../services/ApiResponse";

export const asyncHandler = async (func) => {
    return Promise.resolve(func())
      .then((data) => {
        const responseData = data.data;
        return new ApiResponse(
          responseData.statusCode,
          responseData.data,
          responseData.message,
          responseData.success
        );
      })
      .catch((error) => {
        return new ApiError(error.message, error, error.response?.data);
      });
  };