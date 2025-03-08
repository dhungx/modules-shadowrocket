// ViBoss Studio - 08/03/2025
const version = 'V1.0.4';

/**
 * Hàm đặt giá trị cho header (tự động xử lý chữ hoa/thường)
 * @param {object} headers - Đối tượng chứa header của request
 * @param {string} headerName - Tên header cần chỉnh sửa
 * @param {string} value - Giá trị mới cần gán cho header
 */
function setHeaderValue(headers, headerName, value) {
    const lowerCaseHeader = headerName.toLowerCase();
    headers[lowerCaseHeader] = value;
}

// Lấy danh sách header từ request
let modifiedHeaders = { ...$request.headers };

// Danh sách các header cần chỉnh sửa
const headersToModify = {
    "X-RevenueCat-ETag": "",         // Xóa giá trị ETag (tránh cache)
    "X-Client-Version": "99.99.99",  // Giả mạo phiên bản client
    "X-Device-Model": "iPhone15,3",  // Giả lập thiết bị mới nhất
    "X-Custom-Debug": "Enabled"      // (Tùy chọn) Thêm header debug
};

// Áp dụng các chỉnh sửa header
Object.entries(headersToModify).forEach(([key, value]) => {
    setHeaderValue(modifiedHeaders, key, value);
});

// Ghi log để debug (có thể bỏ nếu không cần)
console.log(`[ViBoss Studio] Đã chỉnh sửa headers:`, JSON.stringify(headersToModify, null, 2));

// Hoàn tất request với header đã chỉnh sửa
$done({ headers: modifiedHeaders });