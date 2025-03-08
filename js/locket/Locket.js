// ViBoss Studio - Script cấp quyền Premium miễn phí

const mapping = {
    '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
    'Locket': ['Gold'],
};

// Lấy thông tin User-Agent từ request
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
let obj = JSON.parse($response.body);

// Thêm thông báo cảnh báo vào phản hồi
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

// Tạo ngày mua ngẫu nhiên trong 1 năm gần đây
function randomPurchaseDate() {
    let now = new Date();
    let pastDate = new Date(now);
    pastDate.setFullYear(now.getFullYear() - Math.floor(Math.random() * 2)); // Trừ ngẫu nhiên từ 0-1 năm
    return pastDate.toISOString();
}

// Đối tượng mô phỏng dữ liệu giao dịch premium
const dohungx = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    period_type: "normal",
    expires_date: "2099-12-18T01:04:17Z",
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: randomPurchaseDate(),
    purchase_date: randomPurchaseDate(),
    store: ua.includes("Android") ? "google_play" : "app_store" // Xác định nền tảng
};

// Kiểm tra User-Agent để xác định quyền hạn
const match = Object.keys(mapping).find(key => ua.includes(key));

if (match) {
    let [entitlement, product] = mapping[match];

    if (product) {
        obj.subscriber.subscriptions[product] = { ...dohungx, product_identifier: product };
    } else {
        obj.subscriber.subscriptions["com.dohungx.premium.yearly"] = dohungx;
    }

    obj.subscriber.entitlements[entitlement] = {
        grace_period_expires_date: null,
        purchase_date: randomPurchaseDate(),
        product_identifier: product || "com.dohungx.premium.yearly",
        expires_date: "2099-12-18T01:04:17Z"
    };
} else {
    obj.subscriber.subscriptions["com.dohungx.premium.yearly"] = dohungx;
    obj.subscriber.entitlements.pro = {
        grace_period_expires_date: null,
        purchase_date: randomPurchaseDate(),
        product_identifier: "com.dohungx.premium.yearly",
        expires_date: "2099-12-18T01:04:17Z"
    };
}

// Ghi log để debug
console.log(`[ViBoss Studio] Đã kích hoạt premium cho: ${ua}`);
console.log(`[ViBoss Studio] Thời gian xử lý: ${new Date().toISOString()}`);
console.log(`[ViBoss Studio] Subscription:`, obj.subscriber.subscriptions);

// Trả về phản hồi đã chỉnh sửa
$done({ body: JSON.stringify(obj) });