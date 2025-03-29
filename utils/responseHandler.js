const sendResponse = (res, statusCode, success, payload) => {
    const response = {
      success,
      ...(success ? { data: payload.data, message: payload.message || 'Success' } : { error: payload }),
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        ...(payload.count !== undefined && { count: payload.count }),
      },
    };
    return res.status(statusCode).json(response);
  };
  
  module.exports = {
    sendSuccess: (res, data, message, statusCode = 200, count) => {
      return sendResponse(res, statusCode, true, { data, message, count });
      // cách sử dụng 
      // sendSuccess(res, users, 'Users retrieved successfully', 200, users.length);
      // res là dữ liệu trả về, users là dữ liệu truyền vào, 'Users retrieved successfully' là message trả về, 200 là status code, users.length là số lượng phần tử
    },
    sendError: (res, message, code, statusCode, details) => {
      return sendResponse(res, statusCode, false, { code, message, details });
      // cách sử dụng
      // sendError(res, 'Internal server error', 'SERVER_ERROR', 500);
      // res là dữ liệu trả về, 'Internal server error' là message trả về, 'SERVER_ERROR' la code, 500 la status code
    },
  };