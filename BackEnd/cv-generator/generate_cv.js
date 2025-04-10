const fs = require("fs").promises; // Sử dụng fs promises
const path = require("path");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const { uploadCV } = require("../utils/file");

// --- Dữ liệu CV của bạn ---
const cvData = {
  personalInfo: {
    name: "Nguyễn Văn A",
    email: "nva@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP HCM",
    linkedin: "https://www.linkedin.com/in/nguyenvana",
    github: "https://github.com/nguyenvana",
    portfolio: "https://nguyenvana.dev",
  },
  education: [
    {
      degree: "Cử nhân Công nghệ Thông tin",
      school: "Đại học B",
      year: "2015 - 2019",
      gpa: 3.7,
      relevantCourses: ["Lập trình Web", "Cơ sở dữ liệu", "Trí tuệ nhân tạo"],
    },
  ],
  experience: [
    {
      title: "Lập trình viên Backend",
      company: "Công ty C",
      duration: "2019 - Hiện tại",
      description:
        "Phát triển và bảo trì API sử dụng Node.js và MongoDB. Tối ưu hóa hiệu suất hệ thống.",
      technologies: ["Node.js", "Express.js", "MongoDB", "Redis"],
    },
    {
      title: "Thực tập sinh lập trình",
      company: "Công ty D",
      duration: "2018 - 2019",
      description:
        "Hỗ trợ phát triển các module nhỏ trong dự án. Viết tài liệu kỹ thuật.",
      technologies: ["JavaScript", "MySQL", "REST API"],
    },
  ],
  projects: [
    {
      name: "Ứng dụng Quản lý Công việc",
      description:
        "Xây dựng ứng dụng giúp người dùng quản lý công việc cá nhân, có tính năng thêm, sửa, xóa và sắp xếp công việc.",
      technologies: ["React", "Node.js", "MongoDB"],
      github: "https://github.com/nguyenvana/task-manager",
    },
    {
      name: "Hệ thống Đặt Phòng Khách Sạn",
      description:
        "Phát triển hệ thống đặt phòng khách sạn trực tuyến, tích hợp cổng thanh toán.",
      technologies: ["Vue.js", "Firebase", "Cloud Functions"],
      github: "https://github.com/nguyenvana/hotel-booking",
    },
  ],
  skills: [
    "Node.js",
    "JavaScript",
    "MongoDB",
    "API Design",
    "RESTful API",
    "GraphQL",
    "Docker",
    "AWS",
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      year: "2022",
      issuer: "Amazon Web Services",
    },
    {
      name: "Node.js Developer Certification",
      year: "2021",
      issuer: "OpenJS Foundation",
    },
  ],
  languages: [
    {
      language: "Tiếng Việt",
      level: "Bản ngữ",
    },
    {
      language: "Tiếng Anh",
      level: "Trung cấp (Intermediate)",
    },
  ],
  hobbies: [
    "Đọc sách",
    "Chơi cờ vua",
    "Du lịch",
    "Lập trình các dự án cá nhân",
  ],
};
// --------------------------

const templatePath = path.join(__dirname, "cv_templatev1.hbs");
const outputDir = path.join(__dirname, "output"); // Thư mục lưu PDF
const outputPdfPath = path.join(
  outputDir,
  `CV_${cvData.personalInfo.name.replace(/\s+/g, "_")}.pdf`
);

module.exports = {
    // generatePdf: async function (cvData, templatePath) { 
    generatePdf: async function (cvData) { 
        let browser; // Khai báo để có thể đóng nếu lỗi
        try {
            console.log("Đang đọc template...");
            // 1. Đọc template HTML
            const templateHtml = await fs.readFile(templatePath, "utf8");

            // 2. Compile template Handlebars
            const template = Handlebars.compile(templateHtml);

            // 3. Render HTML với dữ liệu CV
            const finalHtml = template(cvData);
            console.log("Đã render HTML xong.");

            // 5. Sử dụng Puppeteer để tạo PDF
            console.log("Khởi chạy Puppeteer...");
            browser = await puppeteer.launch({ // Gán vào biến browser
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();

            console.log("Đang tạo nội dung PDF trong bộ nhớ...");
            // Set nội dung HTML cho trang và đợi các tài nguyên mạng tải xong
            await page.setContent(finalHtml, { waitUntil: "networkidle0" });

            // *** THAY ĐỔI CHÍNH Ở ĐÂY ***
            // Tạo PDF buffer thay vì lưu vào file bằng cách bỏ tùy chọn 'path'
            const pdfBuffer = await page.pdf({
                // path: outputPdfPath, // <-- BỎ TÙY CHỌN NÀY
                format: "A4",
                printBackground: true,
                margin: {
                    top: "25mm",
                    right: "20mm",
                    bottom: "25mm",
                    left: "20mm",
                },
            });
            // *** KẾT THÚC THAY ĐỔI CHÍNH ***

            console.log("Đóng Puppeteer.");
            await browser.close();

            // --- GHI CHÚ CHO BẠN ---
            // Tại thời điểm này, biến 'pdfBuffer' đang chứa toàn bộ nội dung
            // của file PDF dưới dạng Buffer (một dãy byte).
            // Đây chính là "file" bạn cần để gửi lên Cloudinary hoặc xử lý tiếp.
            console.log(`\n-----> Tạo PDF Buffer thành công! <-----`);
            console.log(`===> Dữ liệu file PDF nằm trong biến 'pdfBuffer' (kiểu Buffer) <===`);
            console.log(`Kích thước Buffer: ${pdfBuffer.length} bytes.`);
            return pdfBuffer;

        } catch (error) {
            console.error("Lỗi trong quá trình tạo PDF Buffer:", error);
            if (browser) {
                // Đảm bảo đóng trình duyệt nếu có lỗi xảy ra sau khi đã khởi tạo
                try {
                    await browser.close();
                    console.log("Đã đóng Puppeteer sau khi gặp lỗi.");
                } catch (closeError) {
                    console.error("Lỗi khi đóng Puppeteer sau lỗi:", closeError);
                }
            }
            return null; // Hoặc ném lỗi: throw error;
        }
    },
};
