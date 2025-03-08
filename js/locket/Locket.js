// ViBoss Studio - Script cấp quyền Premium miễn phí

const mapping = {
    '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
    'Locket': ['Gold']
};

// Lấy thông tin User-Agent từ request
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
let obj = JSON.parse($response.body);

// Thêm thông báo cảnh báo vào phản hồi
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

// Đối tượng mô phỏng dữ liệu giao dịch premium
const dohungx = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    period_type: "normal",
    expires_date: "2099-12-18T01:04:17Z",
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: "2024-07-28T01:04:18Z",
    purchase_date: "2024-07-28T01:04:17Z",
    store: "app_store"
};

// Đối tượng mô phỏng gói đăng ký premium
const premiumEntitlement = {
    grace_period_expires_date: null,
    purchase_date: "2024-07-28T01:04:17Z",
    product_identifier: "com.dohungx.premium.yearly",
    expires_date: "2099-12-18T01:04:17Z"
};

// Kiểm tra User-Agent để xác định quyền hạn
const match = Object.keys(mapping).find(key => ua.includes(key));

if (match) {
    let [entitlement, product] = mapping[match];

    if (product) {
        premiumEntitlement.product_identifier = product;
        obj.subscriber.subscriptions[product] = dohungx;
    } else {
        obj.subscriber.subscriptions["com.dohungx.premium.yearly"] = dohungx;
    }

    obj.subscriber.entitlements[entitlement] = premiumEntitlement;
} else {
    obj.subscriber.subscriptions["com.dohungx.premium.yearly"] = dohungx;
    obj.subscriber.entitlements.pro = premiumEntitlement;
}

// Trả về phản hồi đã chỉnh sửa
$done({ body: JSON.stringify(obj) });