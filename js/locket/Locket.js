// ========= ID Mapping ========= //
const mapping = {
    '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
    'Locket': ['Gold']
};

// ========= Xử lý User-Agent ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj;

try {
    obj = JSON.parse($response.body);
} catch (error) {
    console.log("🚨 Lỗi khi phân tích JSON:", error);
    return $done({});
}

// ========= Thêm Thông Báo ========= //
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

// ========= Dữ Liệu Gói Đăng Ký Giả ========= //
const fakeSubscription = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    period_type: "normal",
    expires_date: "2099-12-18T01:04:17Z",
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: "2025-03-08T01:04:18Z",
    purchase_date: "2025-03-08T01:04:17Z",
    store: "app_store"
};

const fakeEntitlement = {
    grace_period_expires_date: null,
    purchase_date: "2025-03-08T01:04:17Z",
    expires_date: "2099-12-18T01:04:17Z"
};

// ========= Xác Định Ứng Dụng & Gán Gói ========= //
const matchedApp = Object.keys(mapping).find(key => ua.includes(key));

if (matchedApp) {
    let [entitlementKey, productIdentifier] = mapping[matchedApp];

    if (productIdentifier) {
        fakeEntitlement.product_identifier = productIdentifier;
        obj.subscriber.subscriptions[productIdentifier] = fakeSubscription;
    } else {
        obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = fakeSubscription;
    }

    obj.subscriber.entitlements[entitlementKey] = fakeEntitlement;
} else {
    // Mặc định nếu không tìm thấy ứng dụng
    obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = fakeSubscription;
    obj.subscriber.entitlements.pro = fakeEntitlement;
}

// ========= Log Debug ========= //
console.log("🛠 Đã cập nhật đăng ký cho:", ua);

// ========= Trả Về Dữ Liệu Đã Chỉnh Sửa ========= //
$done({ body: JSON.stringify(obj) });