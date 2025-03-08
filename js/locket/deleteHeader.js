// ViBoss Studio - 02/09/2024
const version = 'V1.0.3';

/**
 * Hàm đặt giá trị cho header (tự động xử lý chữ hoa/thường)
 * @param {object} headers - Đối tượng chứa header của request
 * @param {string} headerName - Tên header cần chỉnh sửa
 * @param {string} value - Giá trị mới cần gán cho header
 */
function setHeaderValue(headers, headerName, value) {
    const lowerCaseHeader = headerName.toLowerCase();
    if (lowerCaseHeader in headers) {
        headers[lowerCaseHeader] = value;
    } else {
        headers[headerName] = value;
    }
}

// Lấy danh sách header từ request
let modifiedHeaders = { ...$request.headers };

// Danh sách các header cần chỉnh sửa
const headersToModify = {
    "X-RevenueCat-ETag": "",      // Xóa giá trị ETag (tránh cache)
    "X-Custom-Debug": "Enabled"   // (Tùy chọn) Thêm header debug
};

// Áp dụng các chỉnh sửa header
for (const [key, value] of Object.entries(headersToModify)) {
    setHeaderValue(modifiedHeaders, key, value);
}

// Hoàn tất request với header đã chỉnh sửa
$done({ headers: modifiedHeaders });