# Tài liệu API Backend (Với Ví dụ JSON)

### Chạy File .md
```html
    ctrl + shift + v
```


Tài liệu này cung cấp thông tin chi tiết về các API endpoint của hệ thống backend, bao gồm ví dụ dữ liệu JSON đầy đủ.

**Base URL:** `http://127.0.0.1:3000` (Thay thế bằng domain thực tế)

**Authentication:** Nhiều endpoint yêu cầu JWT token trong header `Authorization: Bearer <your_jwt_token>`.

**Định dạng Response Chung:**
* **Thành công:**
    ```json
    {
      "status": "success",
      "message": "Thông báo thành công",
      "data": { ... } // Hoặc [ ... ] hoặc null hoặc string
    }
    ```
* **Lỗi:**
    ```json
    {
      "status": "error",
      "error": {
          "message": "Thông báo lỗi",
          "type": "LOAI_LOI", // Ví dụ: SERVER_ERROR, VALIDATION_ERROR, AUTH_ERROR
          "code": 500 // HTTP status code (ví dụ: 400, 401, 403, 404, 500)
      }
    }
    ```

---

## Authentication (`/auth`)

### `GET /auth/google`
* **Mục đích:** Chuyển hướng đến trang đăng nhập Google.

### `GET /auth/google/callback`
* **Mục đích:** Xử lý callback từ Google sau khi đăng nhập thành công.
* **Ví dụ Đầu vào:** Không áp dụng (Google redirect với query params).
* **Ví dụ Đầu ra:** Redirect HTTP về Frontend (thường kèm token trong URL hoặc cookie).

### `POST /auth/login`
* **Mục đích:** Đăng nhập bằng tài khoản thông thường.
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Login successfully",
      "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" // Ví dụ JWT Token
    }
    ```

### `POST /auth/signup`
* **Mục đích:** Đăng ký tài khoản mới.
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "username": "newuser",
      "password": "strongPassword!@#",
      "email": "newemail01@gmail.com"
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Signup successfully",
      "data": null
    }
    ```

### `POST /auth/changepassword`
* **Mục đích:** Thay đổi mật khẩu cho người dùng đã đăng nhập.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "oldpassword": "current_password",
      "newpassword": "new_secure_password"
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Change password successfully",
      "data": {
         "_id": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')", // Ví dụ ID User
         "username": "testuser",
         "email": "[đã xoá địa chỉ email]"
         // Có thể có hoặc không có các trường khác tùy vào implementation
      }
      // Hoặc data có thể là null tùy implementation
      // "data": null
    }
    ```

### `GET /auth/me`
* **Mục đích:** Lấy thông tin chi tiết của người dùng đang đăng nhập.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get info user successfully",
      "data": {
        "_id": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')",
        "username": "testuser",
        "email": "[đã xoá địa chỉ email]",
        "avatar": "[http://your-api-domain.com/uploads/avatars/avatar_default.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/avatars/avatar_default.png)",
        "cv": "[http://your-api-domain.com/uploads/cvs/user_cv.pdf](https://www.google.com/search?q=http://your-api-domain.com/uploads/cvs/user_cv.pdf)",
        "isActive": true,
        "company": { // Có thể là null nếu user không thuộc công ty nào
            "_id": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
            "name": "Test Company Inc.",
            "taxCode": "0123456789",
            "websiteUrl": "[https://company.example.com](https://www.google.com/search?q=https://company.example.com)",
            "description": "A leading tech company.",
            "image": "[http://your-api-domain.com/uploads/companies/company_logo.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/company_logo.png)",
            "address": "123 Tech Street, Silicon Valley"
            // ... các trường khác của company
         },
        "role": {
            "_id": "ObjectId('605c7f0a3f8b9a1b7c8d9e2b')",
            "name": "User",
            "permissions": ["CREATE_JOB", "UPDATE_OWN_JOB", "DELETE_OWN_JOB"] // Ví dụ
        },
        "createdAt": "2025-04-01T10:00:00.000Z",
        "updatedAt": "2025-04-02T11:30:00.000Z"
        // ... các trường khác của user
      }
    }
    ```

### `POST /auth/forgotpassword`
* **Mục đích:** Gửi yêu cầu đặt lại mật khẩu qua email.
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "email": "[đã xoá địa chỉ email]"
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Gui mail thanh cong",
      "data": {
          // URL có thể không được trả về trong môi trường production
          "url": "http://localhost:3000/auth/reset_password/a1b2c3d4e5f6..."
      }
    }
    ```

### `POST /auth/reset_password/:token`
* **Mục đích:** Đặt lại mật khẩu bằng token nhận được qua email.
* **Ví dụ Đầu vào:**
    * Path Parameter: `token` (Ví dụ: `a1b2c3d4e5f6...`)
    * Request Body (JSON):
        ```json
        {
          "password": "new_reset_password"
        }
        ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Change password successfully",
      "data": {
         "_id": "ObjectId('605c800a3f8b9a1b7c8d9e3c')", // ID user tương ứng với token
         "username": "user_forgot",
         "email": "[đã xoá địa chỉ email]"
         // ... các trường cần thiết khác
      }
    }
    ```

---

## Companies (`/companies`)

### `GET /companies`
* **Mục đích:** Lấy danh sách tất cả công ty.
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get all companies successfully",
      "data": [
        {
          "_id": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
          "name": "Test Company Inc.",
          "taxCode": "0123456789",
          "websiteUrl": "[https://company.example.com](https://www.google.com/search?q=https://company.example.com)",
          "description": "A leading tech company.",
          "image": "[http://your-api-domain.com/uploads/companies/company_logo.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/company_logo.png)",
          "address": "123 Tech Street, Silicon Valley",
          "user": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')", // User liên kết (nếu có)
          "createdAt": "2025-04-01T11:00:00.000Z",
          "updatedAt": "2025-04-02T10:00:00.000Z"
        },
        {
          "_id": "ObjectId('605c810a3f8b9a1b7c8d9e4d')",
          "name": "Another Company Ltd.",
          "taxCode": "9876543210",
          "websiteUrl": "[https://another.example.com](https://www.google.com/search?q=https://another.example.com)",
          "description": "Startup in innovation.",
          "image": "[http://your-api-domain.com/uploads/companies/another_logo.jpg](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/another_logo.jpg)",
          "address": "456 Innovation Ave, Tech Park",
          "user": "ObjectId('605c820a3f8b9a1b7c8d9e5e')",
          "createdAt": "2025-03-20T09:00:00.000Z",
          "updatedAt": "2025-04-01T15:00:00.000Z"
        }
        // ... Thêm các công ty khác
      ]
    }
    ```

### `GET /companies/:id`
* **Mục đích:** Lấy thông tin chi tiết của một công ty.
* **Ví dụ Đầu vào:** Path Parameter `id` (Ví dụ: `605c7e1a3f8b9a1b7c8d9e1a`).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get company successfully",
      "data": {
        "_id": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
        "name": "Test Company Inc.",
        "taxCode": "0123456789",
        "websiteUrl": "[https://company.example.com](https://www.google.com/search?q=https://company.example.com)",
        "description": "A leading tech company.",
        "image": "[http://your-api-domain.com/uploads/companies/company_logo.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/company_logo.png)",
        "address": "123 Tech Street, Silicon Valley",
        "user": { // Có thể populate thông tin user
           "_id": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')",
           "username": "company_admin_user",
           "email": "[đã xoá địa chỉ email]"
        },
        "createdAt": "2025-04-01T11:00:00.000Z",
        "updatedAt": "2025-04-02T10:00:00.000Z"
        // ... các trường khác nếu có
      }
    }
    ```

### `PUT /companies/:id/:taxCode`
* **Mục đích:** Cập nhật thông tin công ty.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền COMPANY.
* **Ví dụ Đầu vào:**
    * Path Parameters: `id` (Ví dụ: `605c7e1a3f8b9a1b7c8d9e1a`), `taxCode` (Ví dụ: `0123456789`).
    * Request Body (`multipart/form-data`):
        * `image`: (Optional) File ảnh mới.
        * `name`: (Optional) "Updated Test Company Name" (form field).
        * `description`: (Optional) "Updated company description." (form field).
        * `websiteUrl`: (Optional) "https://updated.example.com" (form field).
        * `address`: (Optional) "456 New Address, City" (form field).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Update company successfully",
      "data": {
        "_id": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
        "name": "Updated Test Company Name", // Dữ liệu đã cập nhật
        "taxCode": "0123456789",
        "websiteUrl": "[https://updated.example.com](https://updated.example.com)", // Dữ liệu đã cập nhật
        "description": "Updated company description.", // Dữ liệu đã cập nhật
        "image": "[http://your-api-domain.com/uploads/companies/new_company_logo.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/new_company_logo.png)", // URL ảnh mới nếu upload
        "address": "456 New Address, City", // Dữ liệu đã cập nhật
        "user": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')",
        "createdAt": "2025-04-01T11:00:00.000Z",
        "updatedAt": "2025-04-03T09:15:00.000Z" // Thời gian cập nhật mới
      }
    }
    ```

---

## Jobs (`/jobs`)

### `GET /jobs`
* **Mục đích:** Lấy danh sách tất cả công việc.
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get all jobs successfully",
      "data": [
        {
          "_id": "ObjectId('605c8a0a3f8b9a1b7c8d9f0a')",
          "title": "Senior Backend Developer",
          "description": "Develop and maintain server-side logic.",
          "salary": "3000-5000 USD",
          "location": "Ho Chi Minh City",
          "company": { // Populated company info
            "_id": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
            "name": "Test Company Inc.",
            "image": "[http://your-api-domain.com/uploads/companies/company_logo.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/company_logo.png)"
          },
          "jobType": { // Populated job type
             "_id": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')",
             "name": "Full-time"
          },
          "positionType": { // Populated position type
             "_id": "ObjectId('605c8d0a3f8b9a1b7c8d9f2c')",
             "name": "Senior"
          },
          "createdBy": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')", // User ID
          "status": "Open", // Trạng thái tin tuyển dụng
          "createdAt": "2025-04-02T14:00:00.000Z",
          "updatedAt": "2025-04-02T14:00:00.000Z"
        },
        {
          "_id": "ObjectId('605c8b0a3f8b9a1b7c8d9f0b')",
          "title": "Frontend Intern",
          "description": "Learn and assist in building user interfaces.",
          "salary": "Negotiable",
          "location": "Remote",
          "company": {
            "_id": "ObjectId('605c810a3f8b9a1b7c8d9e4d')",
            "name": "Another Company Ltd.",
            "image": "[http://your-api-domain.com/uploads/companies/another_logo.jpg](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/another_logo.jpg)"
          },
          "jobType": {
             "_id": "ObjectId('605c8c1a3f8b9a1b7c8d9f1c')",
             "name": "Internship"
          },
          "positionType": {
             "_id": "ObjectId('605c8d1a3f8b9a1b7c8d9f2d')",
             "name": "Intern"
          },
          "createdBy": "ObjectId('605c820a3f8b9a1b7c8d9e5e')",
          "status": "Open",
          "createdAt": "2025-04-01T16:30:00.000Z",
          "updatedAt": "2025-04-01T16:30:00.000Z"
        }
        // ... Thêm các job khác
      ]
    }
    ```

### `GET /jobs/:id`
* **Mục đích:** Lấy thông tin chi tiết của một công việc.
* **Ví dụ Đầu vào:** Path Parameter `id` (Ví dụ: `605c8a0a3f8b9a1b7c8d9f0a`).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get job successfully",
      "data": {
        "_id": "ObjectId('605c8a0a3f8b9a1b7c8d9f0a')",
        "title": "Senior Backend Developer",
        "description": "Develop and maintain server-side logic. Requirements: Node.js, MongoDB, AWS.",
        "salary": "3000-5000 USD",
        "location": "Ho Chi Minh City",
        "company": {
          "_id": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
          "name": "Test Company Inc.",
          "taxCode": "0123456789",
          "websiteUrl": "[https://company.example.com](https://www.google.com/search?q=https://company.example.com)",
          "description": "A leading tech company.",
          "image": "[http://your-api-domain.com/uploads/companies/company_logo.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/company_logo.png)",
          "address": "123 Tech Street, Silicon Valley"
          // ... có thể populate thêm thông tin công ty
        },
        "jobType": {
           "_id": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')",
           "name": "Full-time"
        },
        "positionType": {
           "_id": "ObjectId('605c8d0a3f8b9a1b7c8d9f2c')",
           "name": "Senior"
        },
        "createdBy": { // Có thể populate thông tin user tạo
           "_id": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')",
           "username": "recruiter_user",
           "email": "[đã xoá địa chỉ email]"
        },
        "status": "Open",
        "deadline": "2025-05-31T23:59:59.000Z", // Ví dụ hạn nộp
        "skills": ["Node.js", "MongoDB", "AWS", "REST API"], // Ví dụ skills
        "createdAt": "2025-04-02T14:00:00.000Z",
        "updatedAt": "2025-04-03T10:00:00.000Z"
      }
    }
    ```

### `POST /jobs`
* **Mục đích:** Tạo một công việc mới.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER.
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "title": "Marketing Specialist",
      "description": "Plan and execute marketing campaigns.",
      "salary": "1500 USD",
      "location": "Hanoi",
      "companyId": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')", // ID công ty đăng tuyển
      "jobTypeId": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')", // ID loại hình (Full-time)
      "positionTypeId": "ObjectId('605c8d2a3f8b9a1b7c8d9f2e')", // ID vị trí (Junior)
      "status": "Open",
      "deadline": "2025-06-15T23:59:59.000Z",
      "skills": ["Digital Marketing", "SEO", "Content Creation"]
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Create job successfully",
      "data": {
        "_id": "ObjectId('605c900a3f8b9a1b7c8d9f5a')", // ID của job mới tạo
        "title": "Marketing Specialist",
        "description": "Plan and execute marketing campaigns.",
        "salary": "1500 USD",
        "location": "Hanoi",
        "company": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')", // ID hoặc populated object
        "jobType": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')",
        "positionType": "ObjectId('605c8d2a3f8b9a1b7c8d9f2e')",
        "createdBy": "ObjectId('current_user_id')", // ID user tạo job (từ token)
        "status": "Open",
        "deadline": "2025-06-15T23:59:59.000Z",
        "skills": ["Digital Marketing", "SEO", "Content Creation"],
        "createdAt": "2025-04-03T11:00:00.000Z", // Thời gian tạo
        "updatedAt": "2025-04-03T11:00:00.000Z"
      }
    }
    ```

### `PUT /jobs/:id`
* **Mục đích:** Cập nhật thông tin công việc.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER (chỉ chủ job hoặc Admin).
* **Ví dụ Đầu vào:**
    * Path Parameter: `id` (Ví dụ: `605c900a3f8b9a1b7c8d9f5a`).
    * Request Body (JSON) - chỉ chứa các trường cần cập nhật:
        ```json
        {
          "salary": "1600 USD",
          "status": "Closed", // Ví dụ: Đóng tin tuyển dụng
          "description": "Plan and execute marketing campaigns. Update: Focus on social media.",
          "skills": ["Digital Marketing", "SEO", "Content Creation", "Social Media Ads"]
        }
        ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Update job successfully", // Message trong code có thể là "Create...", nên sửa lại
      "data": {
        "_id": "ObjectId('605c900a3f8b9a1b7c8d9f5a')",
        "title": "Marketing Specialist", // Không đổi
        "description": "Plan and execute marketing campaigns. Update: Focus on social media.", // Cập nhật
        "salary": "1600 USD", // Cập nhật
        "location": "Hanoi", // Không đổi
        "company": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')",
        "jobType": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')",
        "positionType": "ObjectId('605c8d2a3f8b9a1b7c8d9f2e')",
        "createdBy": "ObjectId('current_user_id')",
        "status": "Closed", // Cập nhật
        "deadline": "2025-06-15T23:59:59.000Z", // Không đổi
        "skills": ["Digital Marketing", "SEO", "Content Creation", "Social Media Ads"], // Cập nhật
        "createdAt": "2025-04-03T11:00:00.000Z",
        "updatedAt": "2025-04-03T11:30:00.000Z" // Thời gian cập nhật mới
      }
    }
    ```

### `DELETE /jobs/:id`
* **Mục đích:** Xóa một công việc.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER (chỉ chủ job hoặc Admin).
* **Ví dụ Đầu vào:** Path Parameter `id` (Ví dụ: `605c900a3f8b9a1b7c8d9f5a`).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Delete job successfully",
      "data": {
        // Trả về object đã xóa
        "_id": "ObjectId('605c900a3f8b9a1b7c8d9f5a')",
        "title": "Marketing Specialist",
        // ... các trường khác của job đã xóa
      }
      // Hoặc data có thể là null tùy implementation
      // "data": null
    }
    ```

---

## Job Types (`/jobTypes`)

### `GET /jobTypes`
* **Mục đích:** Lấy danh sách các loại hình công việc.
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get all job types successfully",
      "data": [
        { "_id": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')", "name": "Full-time" },
        { "_id": "ObjectId('605c9a0a3f8b9a1b7c8d9f6b')", "name": "Part-time" },
        { "_id": "ObjectId('605c8c1a3f8b9a1b7c8d9f1c')", "name": "Internship" },
        { "_id": "ObjectId('605c9a1a3f8b9a1b7c8d9f6c')", "name": "Contract" },
        { "_id": "ObjectId('605c9a2a3f8b9a1b7c8d9f6d')", "name": "Remote" }
        // ...
      ]
    }
    ```

### `GET /jobTypes/:id`
* **Mục đích:** Lấy chi tiết một loại hình công việc.
* **Ví dụ Đầu vào:** Path Parameter `id` (Ví dụ: `605c8c0a3f8b9a1b7c8d9f1b`).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get job type successfully", // Nên sửa message trong code
      "data": {
        "_id": "ObjectId('605c8c0a3f8b9a1b7c8d9f1b')",
        "name": "Full-time",
        "description": "Standard full-time employment.", // Ví dụ có thêm description
        "createdAt": "2025-04-01T00:00:00.000Z",
        "updatedAt": "2025-04-01T00:00:00.000Z"
      }
    }
    ```

### `POST /jobTypes`
* **Mục đích:** Tạo loại hình công việc mới.
* **Authentication:** Không yêu cầu (theo code hiện tại - *Nên cân nhắc thêm quyền Admin*).
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "name": "Freelance",
      "description": "Project-based independent work." // Ví dụ
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Create job type successfully",
      "data": {
        "_id": "ObjectId('605c9b0a3f8b9a1b7c8d9f7e')", // ID mới tạo
        "name": "Freelance",
        "description": "Project-based independent work.",
        "createdAt": "2025-04-03T12:00:00.000Z",
        "updatedAt": "2025-04-03T12:00:00.000Z"
      }
    }
    ```

---

## Position Types (`/positionTypes`)

### `GET /positionTypes`
* **Mục đích:** Lấy danh sách các loại vị trí công việc.
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get all position types successfully",
      "data": [
        { "_id": "ObjectId('605c8d1a3f8b9a1b7c8d9f2d')", "name": "Intern" },
        { "_id": "ObjectId('605c8d2a3f8b9a1b7c8d9f2e')", "name": "Junior" },
        { "_id": "ObjectId('605c9c0a3f8b9a1b7c8d9f8f')", "name": "Mid-level" },
        { "_id": "ObjectId('605c8d0a3f8b9a1b7c8d9f2c')", "name": "Senior" },
        { "_id": "ObjectId('605c9c1a3f8b9a1b7c8d9f90')", "name": "Lead" },
        { "_id": "ObjectId('605c9c2a3f8b9a1b7c8d9f91')", "name": "Manager" }
        // ...
      ]
    }
    ```

### `GET /positionTypes/:id`
* **Mục đích:** Lấy chi tiết một loại vị trí công việc.
* **Ví dụ Đầu vào:** Path Parameter `id` (Ví dụ: `605c8d0a3f8b9a1b7c8d9f2c`).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get position type successfully", // Nên sửa message trong code
      "data": {
        "_id": "ObjectId('605c8d0a3f8b9a1b7c8d9f2c')",
        "name": "Senior",
        "level": 4, // Ví dụ có thêm level
        "createdAt": "2025-04-01T00:10:00.000Z",
        "updatedAt": "2025-04-01T00:10:00.000Z"
      }
    }
    ```

### `POST /positionTypes`
* **Mục đích:** Tạo loại vị trí công việc mới.
* **Authentication:** Không yêu cầu (theo code hiện tại - *Nên cân nhắc thêm quyền Admin*).
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "name": "Director",
      "level": 6 // Ví dụ
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Create position type successfully",
      "data": {
        "_id": "ObjectId('605c9d0a3f8b9a1b7c8d9fa2')", // ID mới tạo
        "name": "Director",
        "level": 6,
        "createdAt": "2025-04-03T12:10:00.000Z",
        "updatedAt": "2025-04-03T12:10:00.000Z"
      }
    }
    ```

---

## Roles (`/roles`)

### `GET /roles`
* **Mục đích:** Lấy danh sách các vai trò người dùng.
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Get all roles successfully",
      "data": [
        {
           "_id": "ObjectId('605c7f0a3f8b9a1b7c8d9e2b')",
           "name": "User",
           "permissions": ["READ_JOBS", "APPLY_JOB", "UPDATE_OWN_PROFILE", "CREATE_JOB", "UPDATE_OWN_JOB", "DELETE_OWN_JOB"]
        },
        {
           "_id": "ObjectId('605ca00a3f8b9a1b7c8d9fb3')",
           "name": "Company",
           "permissions": ["READ_JOBS", "UPDATE_COMPANY_PROFILE", "MANAGE_COMPANY_JOBS"]
        },
        {
           "_id": "ObjectId('605ca01a3f8b9a1b7c8d9fb4')",
           "name": "Admin",
           "permissions": ["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_JOBS", "MANAGE_COMPANIES", "MANAGE_JOB_TYPES", "MANAGE_POSITION_TYPES"]
        }
        // ...
      ]
    }
    ```

### `POST /roles`
* **Mục đích:** Tạo vai trò người dùng mới.
* **Authentication:** Không yêu cầu (theo code hiện tại - *Lưu ý: API này CỰC KỲ NÊN được bảo vệ chỉ cho Admin*).
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "name": "Moderator",
      "permissions": ["APPROVE_JOBS", "FLAG_CONTENT", "READ_USERS"] // Ví dụ danh sách quyền
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Create role successfully",
      "data": {
        "_id": "ObjectId('605ca10a3f8b9a1b7c8d9fc5')", // ID mới tạo
        "name": "Moderator",
        "permissions": ["APPROVE_JOBS", "FLAG_CONTENT", "READ_USERS"],
        "createdAt": "2025-04-03T12:20:00.000Z",
        "updatedAt": "2025-04-03T12:20:00.000Z"
      }
    }
    ```

---

## Users (`/users`)

### `GET /users`
* **Mục đích:** Lấy danh sách tất cả người dùng (chỉ Admin).
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền ADMIN.
* **Ví dụ Đầu vào:** Không áp dụng (GET).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      // Message trong code là "Get info user successfully", nên sửa thành "Get all users..."
      "message": "Get info user successfully",
      "data": [
        {
          "_id": "ObjectId('605c7d5a3f8b9a1b7c8d9e0f')",
          "username": "testuser",
          "email": "[đã xoá địa chỉ email]",
          "avatar": "[http://your-api-domain.com/uploads/avatars/avatar_default.png](https://www.google.com/search?q=http://your-api-domain.com/uploads/avatars/avatar_default.png)",
          "isActive": true,
          "role": { // Populated role
             "_id": "ObjectId('605c7f0a3f8b9a1b7c8d9e2b')",
             "name": "User"
          },
          "company": null, // User này không thuộc công ty nào
          "createdAt": "2025-04-01T10:00:00.000Z",
          "updatedAt": "2025-04-02T11:30:00.000Z"
        },
        {
          "_id": "ObjectId('605c820a3f8b9a1b7c8d9e5e')",
          "username": "company_user",
          "email": "[đã xoá địa chỉ email]",
          "avatar": null,
          "isActive": true,
           "role": {
             "_id": "ObjectId('605ca00a3f8b9a1b7c8d9fb3')",
             "name": "Company"
          },
          "company": { // Populated company
            "_id": "ObjectId('605c810a3f8b9a1b7c8d9e4d')",
            "name": "Another Company Ltd."
          },
          "createdAt": "2025-03-20T09:00:00.000Z",
          "updatedAt": "2025-04-01T15:00:00.000Z"
        },
        {
          "_id": "ObjectId('admin_user_id')",
          "username": "admin",
          "email": "[đã xoá địa chỉ email]",
          "avatar": null,
          "isActive": true,
          "role": {
             "_id": "ObjectId('605ca01a3f8b9a1b7c8d9fb4')",
             "name": "Admin"
          },
          "company": null,
          "createdAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-01-01T00:00:00.000Z"
        }
        // ... Thêm users khác
      ]
    }
    ```

### `POST /users`
* **Mục đích:** Tạo người dùng mới.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) (*Lưu ý: Nên có thêm check quyền Admin*).
* **Ví dụ Đầu vào (Request Body - JSON):**
    ```json
    {
      "username": "new_employee",
      "password": "employeePass1!",
      "email": "[đã xoá địa chỉ email]",
      "role": "ObjectId('605c7f0a3f8b9a1b7c8d9e2b')", // ID của Role "User"
      // "role": "User" // Hoặc tên Role tùy implementation
      "isActive": true // Optional, default có thể là true/false
    }
    ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Create user successfully",
      "data": {
        "_id": "ObjectId('605ca20a3f8b9a1b7c8d9fd6')", // ID user mới
        "username": "new_employee",
        "email": "[đã xoá địa chỉ email]",
        "avatar": null, // Default avatar hoặc null
        "cv": null,
        "isActive": true,
        "company": null, // Chưa gán công ty
        "role": "ObjectId('605c7f0a3f8b9a1b7c8d9e2b')", // ID Role đã gán
        // Password hash không được trả về
        "createdAt": "2025-04-03T12:30:00.000Z",
        "updatedAt": "2025-04-03T12:30:00.000Z"
      }
    }
    ```

### `PUT /users/:id`
* **Mục đích:** Cập nhật thông tin người dùng.
* **Authentication:** **KHÔNG CÓ** (theo code hiện tại - *Lưu ý: RỦI RO BẢO MẬT NGHIÊM TRỌNG. Cần bổ sung check quyền Admin hoặc chủ sở hữu profile*).
* **Ví dụ Đầu vào:**
    * Path Parameter: `id` (Ví dụ: `605ca20a3f8b9a1b7c8d9fd6`).
    * Request Body (JSON) - chỉ chứa các trường cần cập nhật:
        ```json
        {
          "email": "[đã xoá địa chỉ email]",
          "isActive": false, // Ví dụ: Khóa tài khoản
          "role": "ObjectId('605ca00a3f8b9a1b7c8d9fb3')", // Ví dụ: đổi Role thành "Company"
          "company": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')" // Ví dụ: gán vào công ty
        }
        ```
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Update user successfully",
      "data": {
        "_id": "ObjectId('605ca20a3f8b9a1b7c8d9fd6')",
        "username": "new_employee", // Username thường không đổi ở đây
        "email": "[đã xoá địa chỉ email]", // Cập nhật
        "avatar": null,
        "cv": null,
        "isActive": false, // Cập nhật
        "company": "ObjectId('605c7e1a3f8b9a1b7c8d9e1a')", // Cập nhật
        "role": "ObjectId('605ca00a3f8b9a1b7c8d9fb3')", // Cập nhật
        "createdAt": "2025-04-03T12:30:00.000Z",
        "updatedAt": "2025-04-03T12:45:00.000Z" // Thời gian cập nhật mới
      }
    }
    ```

### `POST /users/upCompanies/:taxCode`
* **Mục đích:** Tạo hoặc cập nhật hồ sơ công ty liên kết với tài khoản người dùng đang đăng nhập.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`).
* **Ví dụ Đầu vào:**
    * Path Parameter: `taxCode` (Ví dụ: `1122334455`).
    * Request Body (`multipart/form-data`):
        * `image`: File ảnh logo công ty (bắt buộc).
        * `description`: "Mô tả chi tiết về công ty mới này." (form field, bắt buộc).
        * `websiteUrl`: "https://my-new-company.com" (form field, bắt buộc).
        * `name`: "My New Company LLC" (form field, thường sẽ lấy từ MST nhưng có thể cho phép sửa đổi).
        * `address`: "789 Business Rd, Suite 100" (form field, optional).
* **Ví dụ Đầu ra (Success Response - Tạo mới):**
    ```json
    {
      "status": "success",
      "message": "Create company successfully", // Hoặc "Update..." nếu đã tồn tại
      "data": {
        "_id": "ObjectId('605ca30a3f8b9a1b7c8d9fe7')", // ID công ty mới tạo/cập nhật
        "name": "My New Company LLC",
        "taxCode": "1122334455",
        "websiteUrl": "[https://my-new-company.com](https://my-new-company.com)",
        "description": "Mô tả chi tiết về công ty mới này.",
        "image": "[http://your-api-domain.com/uploads/companies/1122334455_logo.jpg](https://www.google.com/search?q=http://your-api-domain.com/uploads/companies/1122334455_logo.jpg)", // URL ảnh đã upload
        "address": "789 Business Rd, Suite 100",
        "user": "ObjectId('current_user_id')", // ID user thực hiện request (từ token)
        "createdAt": "2025-04-03T13:00:00.000Z",
        "updatedAt": "2025-04-03T13:00:00.000Z"
      }
    }
    ```
    *Lưu ý:* Backend cũng cần cập nhật trường `company` trong document của User thực hiện request.

### `POST /users/uploadAvatar`
* **Mục đích:** Tải lên ảnh đại diện cho người dùng đang đăng nhập.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) + Quyền USER.
* **Ví dụ Đầu vào:** Request Body (`multipart/form-data`):
    * `avatar`: File ảnh (ví dụ: `my_avatar.jpg`, bắt buộc).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Update avatar user successfully",
      "data": {
        "_id": "ObjectId('current_user_id')",
        "username": "user_uploading",
        "email": "user@example.com",
        "avatar": "[http://your-api-domain.com/uploads/avatars/current_user_id_avatar.jpg](https://www.google.com/search?q=http://your-api-domain.com/uploads/avatars/current_user_id_avatar.jpg)", // URL avatar mới
        "cv": "[http://your-api-domain.com/uploads/cvs/user_cv.pdf](https://www.google.com/search?q=http://your-api-domain.com/uploads/cvs/user_cv.pdf)", // CV cũ (nếu có)
        "isActive": true,
        "company": { ... }, // Thông tin công ty (nếu có)
        "role": { ... }, // Thông tin role
        "createdAt": "...",
        "updatedAt": "2025-04-03T13:15:00.000Z" // Thời gian cập nhật mới
      }
    }
    ```

### `POST /users/uploadCV`
* **Mục đích:** Tải lên file CV cho người dùng đang đăng nhập.
* **Authentication:** Yêu cầu (`Authorization: Bearer <token>`) (*Lưu ý: Middleware đang bị comment trong code gốc, cần được bật lại*).
* **Ví dụ Đầu vào:** Request Body (`multipart/form-data`):
    * `CV`: File CV (ví dụ: `MyResume_2025.pdf`, bắt buộc).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Update avatar user successfully", // Message nên sửa thành "Update CV..."
      "data": "[http://your-api-domain.com/uploads/cvs/current_user_id_cv_2025.pdf](https://www.google.com/search?q=http://your-api-domain.com/uploads/cvs/current_user_id_cv_2025.pdf)" // URL của file CV mới upload
    }
    ```
    *Lưu ý:* Backend cũng cần cập nhật trường `cv` trong document của User.

### `DELETE /users/:id`
* **Mục đích:** Xóa người dùng.
* **Authentication:** **KHÔNG CÓ** (theo code hiện tại - *Lưu ý: RỦI RO BẢO MẬT NGHIÊM TRỌNG. Cần bổ sung check quyền Admin*).
* **Ví dụ Đầu vào:** Path Parameter `id` (Ví dụ: `605ca20a3f8b9a1b7c8d9fd6`).
* **Ví dụ Đầu ra (Success Response):**
    ```json
    {
      "status": "success",
      "message": "Delete user successfully",
      "data": {
        // Thông tin user vừa bị xóa
        "_id": "ObjectId('605ca20a3f8b9a1b7c8d9fd6')",
        "username": "new_employee",
        "email": "[đã xoá địa chỉ email]",
        // ... các trường khác
      }
      // Hoặc data có thể là null
      // "data": null
    }
    ```