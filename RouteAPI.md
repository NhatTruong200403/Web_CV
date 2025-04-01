# Tài liệu API Backend

Tài liệu này mô tả các API endpoint được cung cấp bởi backend. Frontend có thể sử dụng tài liệu này để hiểu cách tương tác với API.

**Lưu ý chung:**

* **Base URL:** Giả sử base URL là `http://your-api-domain.com/api` (Thay thế bằng domain thực tế). Các đường dẫn dưới đây là phần nối tiếp theo sau base URL.
* **Authentication:** Nhiều endpoint yêu cầu xác thực bằng JWT. Khi gọi các API này, cần gửi kèm header `Authorization: Bearer <your_jwt_token>`. Token này thường được nhận sau khi đăng nhập thành công.
* **Response Format:**
    * **Thành công (Success):** Các response thành công thường theo cấu trúc:
        ```json
        {
          "status": "success",
          "message": "Thông báo thành công",
          "data": { ... } // Dữ liệu trả về (có thể là object, array, hoặc null)
        }
        ```
        (Dựa trên hàm `sendSuccess` trong code)
    * **Lỗi (Error):** Các response lỗi thường theo cấu trúc:
        ```json
        {
          "status": "error",
          "error": {
              "message": "Thông báo lỗi chi tiết",
              "type": "LOAI_LOI", // Ví dụ: "SERVER_ERROR", "VALIDATION_ERROR"
              "code": 500 // HTTP status code
          }
        }
        ```
        (Dựa trên hàm `sendError` trong code)

---

## Authentication (`/auth`)

Các API liên quan đến xác thực người dùng.

### 1. Đăng nhập Google

* **Method:** `GET`
* **Path:** `/auth/google`
* **Description:** Chuyển hướng người dùng đến trang đăng nhập của Google để xác thực. (FE thường chỉ cần gọi đến URL này).
* **Authentication:** Không yêu cầu.
* **Response:** Chuyển hướng (Redirect) đến trang Google.

### 2. Google Callback

* **Method:** `GET`
* **Path:** `/auth/google/callback`
* **Description:** Endpoint mà Google gọi lại sau khi người dùng xác thực thành công. Backend xử lý thông tin và trả về token. (FE thường không gọi trực tiếp, chỉ nhận kết quả sau khi được redirect về từ backend).
* **Authentication:** Không yêu cầu trực tiếp (Google cung cấp mã).
* **Response:** Thường là redirect về trang FE kèm theo token hoặc lỗi.

### 3. Đăng nhập thông thường

* **Method:** `POST`
* **Path:** `/auth/login`
* **Description:** Đăng nhập bằng username và password.
* **Authentication:** Không yêu cầu.
* **Request Body:**
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Login successfully",
      "data": "<jwt_token>" // JWT Token dùng cho các request sau
    }
    ```
* **Error Response (500):** Thông tin đăng nhập sai hoặc lỗi server.

### 4. Đăng ký

* **Method:** `POST`
* **Path:** `/auth/signup`
* **Description:** Tạo tài khoản người dùng mới.
* **Authentication:** Không yêu cầu.
* **Request Body:**
    ```json
    {
      "username": "new_username",
      "password": "new_password",
      "email": "user@example.com"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Signup successfully",
      "data": null
    }
    ```
* **Error Response:** Lỗi validation (username/email đã tồn tại) hoặc lỗi server.

### 5. Thay đổi mật khẩu

* **Method:** `POST`
* **Path:** `/auth/changepassword`
* **Description:** Cho phép người dùng đã đăng nhập thay đổi mật khẩu.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Request Body:**
    ```json
    {
      "oldpassword": "current_password",
      "newpassword": "new_password_chosen"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Change password successfully",
      "data": { ... } // Có thể là thông tin user hoặc null
    }
    ```
* **Error Response:** Sai mật khẩu cũ, lỗi server, chưa đăng nhập (401/403).

### 6. Lấy thông tin người dùng hiện tại

* **Method:** `GET`
* **Path:** `/auth/me`
* **Description:** Lấy thông tin chi tiết của người dùng đang đăng nhập (dựa trên token).
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get info user successfully",
      "data": {
        "_id": "user_id",
        "username": "user_name",
        "email": "user@example.com",
        "role": { ... }, // Chi tiết role
        // ... các trường khác của user
      }
    }
    ```
* **Error Response:** Chưa đăng nhập (401/403).

### 7. Quên mật khẩu

* **Method:** `POST`
* **Path:** `/auth/forgotpassword`
* **Description:** Gửi yêu cầu reset mật khẩu qua email. Backend sẽ tạo token và gửi link reset.
* **Authentication:** Không yêu cầu.
* **Request Body:**
    ```json
    {
      "email": "registered_email@example.com"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Gui mail thanh cong",
      "data": {
          "url": "http://localhost:3000/auth/reset_password/<reset_token>" // Link reset (có thể không trả về trong production)
      }
    }
    ```
* **Error Response (500):** Email không tồn tại.

### 8. Đặt lại mật khẩu

* **Method:** `POST`
* **Path:** `/auth/reset_password/:token`
* **Description:** Đặt lại mật khẩu mới bằng token nhận được qua email.
* **Authentication:** Không yêu cầu (token dùng để xác thực).
* **Path Parameters:**
    * `token`: Token reset mật khẩu nhận được qua email.
* **Request Body:**
    ```json
    {
      "password": "new_password"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Change password successfully",
      "data": { ... } // Thông tin user đã cập nhật password
    }
    ```
* **Error Response (500):** Token không hợp lệ hoặc đã hết hạn.

---

## Companies (`/companies`)

Các API liên quan đến thông tin công ty.

### 1. Lấy danh sách công ty

* **Method:** `GET`
* **Path:** `/companies`
* **Description:** Lấy danh sách tất cả công ty.
* **Authentication:** Không yêu cầu.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get all companies successfully",
      "data": [
        { /* Company object 1 */ },
        { /* Company object 2 */ },
        // ...
      ]
    }
    ```

### 2. Lấy chi tiết công ty

* **Method:** `GET`
* **Path:** `/companies/:id`
* **Description:** Lấy thông tin chi tiết của một công ty bằng ID.
* **Authentication:** Không yêu cầu.
* **Path Parameters:**
    * `id`: ID của công ty.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get company successfully",
      "data": { /* Company object */ }
    }
    ```

### 3. Cập nhật thông tin công ty

* **Method:** `PUT`
* **Path:** `/companies/:id/:taxCode`
* **Description:** Cập nhật thông tin công ty. Yêu cầu quyền COMPANY_PERMISSION.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền COMPANY.
* **Path Parameters:**
    * `id`: ID của công ty cần cập nhật.
    * `taxCode`: Mã số thuế của công ty (có vẻ dùng để xác thực thêm).
* **Request Body:** `multipart/form-data`
    * `image`: File ảnh logo/hình ảnh công ty (optional).
    * Các trường thông tin khác của công ty (ví dụ: `name`, `description`, `address`, `websiteUrl`, ... gửi dưới dạng form fields).
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Update company successfully",
      "data": { /* Company object đã cập nhật */ }
    }
    ```
* **Error Response (500, 401, 403):** Lỗi server, không có quyền, chưa đăng nhập.

---

## Jobs (`/jobs`)

Các API liên quan đến tin tuyển dụng/công việc.

### 1. Lấy danh sách công việc

* **Method:** `GET`
* **Path:** `/jobs`
* **Description:** Lấy danh sách tất cả công việc/tin tuyển dụng.
* **Authentication:** Không yêu cầu.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get all jobs successfully",
      "data": [
        { /* Job object 1 */ },
        { /* Job object 2 */ },
        // ...
      ]
    }
    ```

### 2. Lấy chi tiết công việc

* **Method:** `GET`
* **Path:** `/jobs/:id`
* **Description:** Lấy thông tin chi tiết của một công việc bằng ID.
* **Authentication:** Không yêu cầu.
* **Path Parameters:**
    * `id`: ID của công việc.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get job successfully",
      "data": { /* Job object */ }
    }
    ```

### 3. Tạo công việc mới

* **Method:** `POST`
* **Path:** `/jobs`
* **Description:** Tạo một tin tuyển dụng/công việc mới. Yêu cầu quyền USER_PERMISSION.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER.
* **Request Body:**
    ```json
    {
      "title": "Job Title",
      "description": "Job Description",
      "salary": "Thỏa thuận",
      "companyId": "company_id",
      // ... các trường khác của job
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Create job successfully",
      "data": { /* Job object vừa tạo */ }
    }
    ```
* **Error Response:** Lỗi validation, lỗi server, không có quyền (403), chưa đăng nhập (401).

### 4. Cập nhật công việc

* **Method:** `PUT`
* **Path:** `/jobs/:id`
* **Description:** Cập nhật thông tin một công việc. Yêu cầu quyền USER_PERMISSION.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER.
* **Path Parameters:**
    * `id`: ID của công việc cần cập nhật.
* **Request Body:**
    ```json
    {
      // Các trường cần cập nhật
      "title": "Updated Job Title",
      "description": "Updated Description",
      // ...
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Update job successfully", // Message trong code ghi là "Create..." -> nên sửa lại
      "data": { /* Job object đã cập nhật */ }
    }
    ```
* **Error Response:** Lỗi validation, lỗi server, không có quyền (403), chưa đăng nhập (401).

### 5. Xóa công việc

* **Method:** `DELETE`
* **Path:** `/jobs/:id`
* **Description:** Xóa một công việc. Yêu cầu quyền USER_PERMISSION.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER.
* **Path Parameters:**
    * `id`: ID của công việc cần xóa.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Delete job successfully",
      "data": { /* Job object đã xóa */ } // Hoặc có thể là null
    }
    ```
* **Error Response:** Lỗi server, không có quyền (403), chưa đăng nhập (401).

---

## Job Types (`/jobTypes`)

Các API quản lý loại hình công việc.

### 1. Lấy danh sách loại hình công việc

* **Method:** `GET`
* **Path:** `/jobTypes`
* **Description:** Lấy danh sách tất cả các loại hình công việc.
* **Authentication:** Không yêu cầu.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get all job types successfully",
      "data": [
        { "_id": "...", "name": "Full-time" },
        { "_id": "...", "name": "Part-time" },
        // ...
      ]
    }
    ```

### 2. Lấy chi tiết loại hình công việc

* **Method:** `GET`
* **Path:** `/jobTypes/:id`
* **Description:** Lấy thông tin chi tiết của một loại hình công việc bằng ID.
* **Authentication:** Không yêu cầu.
* **Path Parameters:**
    * `id`: ID của loại hình công việc.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get job type successfully", // Sửa message cho khớp
      "data": { "_id": "...", "name": "..." }
    }
    ```

### 3. Tạo loại hình công việc mới

* **Method:** `POST`
* **Path:** `/jobTypes`
* **Description:** Tạo một loại hình công việc mới.
* **Authentication:** Không yêu cầu (Dựa trên code không có middleware check_auth).
* **Request Body:**
    ```json
    {
      "name": "New Job Type Name" // Ví dụ: "Remote"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Create job type successfully",
      "data": { "_id": "...", "name": "New Job Type Name" }
    }
    ```
* **Error Response:** Lỗi validation (tên trùng), lỗi server.

---

## Position Types (`/positionTypes`)

Các API quản lý loại vị trí công việc (ví dụ: Intern, Junior, Senior).

### 1. Lấy danh sách loại vị trí

* **Method:** `GET`
* **Path:** `/positionTypes`
* **Description:** Lấy danh sách tất cả các loại vị trí công việc.
* **Authentication:** Không yêu cầu.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get all position types successfully",
      "data": [
        { "_id": "...", "name": "Intern" },
        { "_id": "...", "name": "Junior" },
        // ...
      ]
    }
    ```

### 2. Lấy chi tiết loại vị trí

* **Method:** `GET`
* **Path:** `/positionTypes/:id`
* **Description:** Lấy thông tin chi tiết của một loại vị trí bằng ID.
* **Authentication:** Không yêu cầu.
* **Path Parameters:**
    * `id`: ID của loại vị trí.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get position type successfully", // Sửa message cho khớp
      "data": { "_id": "...", "name": "..." }
    }
    ```

### 3. Tạo loại vị trí mới

* **Method:** `POST`
* **Path:** `/positionTypes`
* **Description:** Tạo một loại vị trí công việc mới.
* **Authentication:** Không yêu cầu (Dựa trên code không có middleware check_auth).
* **Request Body:**
    ```json
    {
      "name": "New Position Type Name" // Ví dụ: "Lead"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Create position type successfully",
      "data": { "_id": "...", "name": "New Position Type Name" }
    }
    ```
* **Error Response:** Lỗi validation (tên trùng), lỗi server.

---

## Roles (`/roles`)

Các API quản lý vai trò người dùng (User, Admin, Company).

### 1. Lấy danh sách vai trò

* **Method:** `GET`
* **Path:** `/roles`
* **Description:** Lấy danh sách tất cả các vai trò người dùng.
* **Authentication:** Không yêu cầu.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get all roles successfully",
      "data": [
        { "_id": "...", "name": "Admin" },
        { "_id": "...", "name": "User" },
        // ...
      ]
    }
    ```

### 2. Tạo vai trò mới

* **Method:** `POST`
* **Path:** `/roles`
* **Description:** Tạo một vai trò người dùng mới.
* **Authentication:** Không yêu cầu (Dựa trên code không có middleware check_auth). *Lưu ý: API này nên được bảo vệ chỉ cho Admin.*
* **Request Body:**
    ```json
    {
      "name": "New Role Name" // Ví dụ: "Moderator"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Create role successfully",
      "data": { "_id": "...", "name": "New Role Name" }
    }
    ```
* **Error Response:** Lỗi validation (tên trùng), lỗi server.

---

## Users (`/users`)

Các API quản lý người dùng.

### 1. Lấy danh sách người dùng (Admin)

* **Method:** `GET`
* **Path:** `/users`
* **Description:** Lấy danh sách tất cả người dùng. Chỉ dành cho Admin.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền ADMIN.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Get info user successfully",
      "data": [
        { /* User object 1 */ },
        { /* User object 2 */ },
        // ...
      ]
    }
    ```
* **Error Response (500, 401, 403):** Lỗi server, không có quyền, chưa đăng nhập.

### 2. Tạo người dùng mới (Admin/Authenticated User?)

* **Method:** `POST`
* **Path:** `/users`
* **Description:** Tạo người dùng mới với vai trò cụ thể. Yêu cầu đăng nhập. *Lưu ý: Middleware chỉ check_authentication, có thể cần thêm check_authorization nếu chỉ Admin được tạo user.*
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Request Body:**
    ```json
    {
      "username": "another_username",
      "password": "user_password",
      "email": "another@example.com",
      "role": "RoleName or RoleID" // Ví dụ: "User", "Company"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Create user successfully",
      "data": { /* User object vừa tạo */ }
    }
    ```
* **Error Response (500, 401):** Lỗi validation, lỗi server, chưa đăng nhập.

### 3. Cập nhật người dùng

* **Method:** `PUT`
* **Path:** `/users/:id`
* **Description:** Cập nhật thông tin người dùng bằng ID. *Lưu ý: API này không có middleware xác thực trong code, có thể là lỗi bảo mật. Cần kiểm tra lại.*
* **Authentication:** **KHÔNG CÓ** (Cần xem xét bổ sung).
* **Path Parameters:**
    * `id`: ID của người dùng cần cập nhật.
* **Request Body:**
    ```json
    {
      // Các trường cần cập nhật, ví dụ:
      "email": "updated_email@example.com",
      "isActive": true
      // ... không nên cho phép cập nhật password ở đây
    }
    ```
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Update user successfully",
      "data": { /* User object đã cập nhật */ }
    }
    ```
* **Error Response (500):** Lỗi server.

### 4. Tạo/Cập nhật thông tin công ty cho User

* **Method:** `POST`
* **Path:** `/users/upCompanies/:taxCode`
* **Description:** Cho phép người dùng đã đăng nhập tạo hoặc cập nhật hồ sơ công ty liên kết với tài khoản của họ.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Path Parameters:**
    * `taxCode`: Mã số thuế của công ty.
* **Request Body:** `multipart/form-data`
    * `image`: File ảnh (bắt buộc).
    * `description`: Mô tả công ty (bắt buộc, form field).
    * `websiteUrl`: URL website công ty (bắt buộc, form field).
    * Các trường thông tin khác của công ty (nếu có, form fields).
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Update company successfully", // Hoặc "Create company successfully"
      "data": { /* Company object đã tạo/cập nhật */ }
    }
    ```
* **Error Response (500, 401):** Thiếu thông tin bắt buộc, lỗi server, chưa đăng nhập.

### 5. Upload Avatar

* **Method:** `POST`
* **Path:** `/users/uploadAvatar`
* **Description:** Cho phép người dùng đã đăng nhập tải lên ảnh đại diện. Yêu cầu quyền USER_PERMISSION.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER.
* **Request Body:** `multipart/form-data`
    * `avatar`: File ảnh đại diện (bắt buộc).
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Update avatar user successfully",
      "data": { /* User object đã cập nhật avatar */ }
    }
    ```
* **Error Response (500, 401, 403):** Không có file, lỗi server, chưa đăng nhập, không có quyền.

### 6. Upload CV

* **Method:** `POST`
* **Path:** `/users/uploadCV`
* **Description:** Cho phép người dùng tải lên file CV. *Lưu ý: Middleware xác thực đang bị comment trong code.*
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) (Khi middleware được bật lại).
* **Request Body:** `multipart/form-data`
    * `CV`: File CV (pdf, docx,...) (bắt buộc).
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Update avatar user successfully", // Message nên sửa thành "Update CV..."
      "data": "<url_cv>" // URL của file CV đã upload
    }
    ```
* **Error Response (500, 401, 403):** Không có file, lỗi server, chưa đăng nhập (khi bật lại auth).

### 7. Xóa người dùng

* **Method:** `DELETE`
* **Path:** `/users/:id`
* **Description:** Xóa người dùng bằng ID. *Lưu ý: API này không có middleware xác thực trong code, có thể là lỗi bảo mật. Cần kiểm tra lại và chỉ cho phép Admin thực hiện.*
* **Authentication:** **KHÔNG CÓ** (Cần xem xét bổ sung).
* **Path Parameters:**
    * `id`: ID của người dùng cần xóa.
* **Success Response (200):**
    ```json
    {
      "status": "success",
      "message": "Delete user successfully",
      "data": { /* User object đã xóa */ } // Hoặc có thể là null
    }
    ```
* **Error Response:** Lỗi server.