const fs = require("fs").promises; // Sử dụng fs promises
const path = require("path");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const { uploadCV } = require("../utils/file");


const templatePath = path.join(__dirname, "cv_templatev1.hbs");
const outputDir = path.join(__dirname, "output"); // Thư mục lưu PDF

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
            browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();

            console.log("Đang tạo nội dung PDF trong bộ nhớ...");
            // Set nội dung HTML cho trang và đợi các tài nguyên mạng tải xong
            await page.setContent(finalHtml, { waitUntil: "networkidle0" });
            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "25mm",
                    right: "20mm",
                    bottom: "25mm",
                    left: "20mm",
                },
            });
            console.log("Đóng Puppeteer.");
            await browser.close();
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
