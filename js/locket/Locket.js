var request = $request;

// Cấu hình tùy chỉnh
const CONFIG = {
    EXPIRATION_YEARS: 10, // Số năm subscription sẽ được gia hạn (mặc định 10 năm)
    USE_SANDBOX: false // Bật/tắt chế độ Sandbox (false = Production, true = Sandbox)
};

// Hàm tạo UUID ngẫu nhiên nếu thiếu user ID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Lấy timestamp hiện tại & tính toán thời gian hết hạn
const now = new Date();
const expiresDate = new Date(now.setFullYear(now.getFullYear() + CONFIG.EXPIRATION_YEARS)).toISOString();

// Cấu hình request lấy danh sách entitlement
const options = {
    url: "https://api.revenuecat.com/v1/product_entitlement_mapping",
    headers: {
        'Authorization': request.headers["authorization"],
        'X-Platform': 'iOS',
        'User-Agent': request.headers["user-agent"]
    }
};

// Gửi request để lấy danh sách entitlement
$httpClient.get(options, function (error, newResponse, data) {
    if (error || !data) {
        console.log("❌ Lỗi khi lấy entitlement:", error);
        return $done({});
    }

    try {
        const ent = JSON.parse(data);
        if (!ent || !ent.product_entitlement_mapping) {
            console.log("⚠️ Dữ liệu entitlement không hợp lệ.");
            return $done({});
        }

        // Tạo dữ liệu giả mạo đăng ký
        let fakeResponse = {
            "request_date_ms": Date.now(),
            "request_date": new Date().toISOString(),
            "subscriber": {
                "entitlements": {},
                "subscriptions": {},
                "first_seen": "2024-07-26T01:01:01Z",
                "original_application_version": "9692",
                "last_seen": new Date().toISOString(),
                "original_purchase_date": "2024-07-26T01:01:01Z",
                "original_app_user_id": generateUUID(),
                "non_subscriptions": {}
            }
        };

        console.log("📌 Entitlements đang xử lý:", Object.keys(ent.product_entitlement_mapping));

        // Xử lý danh sách entitlement
        fakeResponse.subscriber = Object.entries(ent.product_entitlement_mapping).reduce((acc, [entitlementId, productInfo]) => {
            const productIdentifier = productInfo.product_identifier;

            productInfo.entitlements.forEach(entitlement => {
                acc.entitlements[entitlement] = {
                    "purchase_date": new Date().toISOString(),
                    "original_purchase_date": "2024-07-26T01:01:01Z",
                    "expires_date": expiresDate,
                    "is_sandbox": CONFIG.USE_SANDBOX,
                    "ownership_type": "PURCHASED",
                    "store": "app_store",
                    "product_identifier": productIdentifier
                };

                acc.subscriptions[productIdentifier] = {
                    "expires_date": expiresDate,
                    "original_purchase_date": "2024-07-26T01:01:01Z",
                    "purchase_date": new Date().toISOString(),
                    "is_sandbox": CONFIG.USE_SANDBOX,
                    "ownership_type": "PURCHASED",
                    "store": "app_store"
                };

                console.log(`✅ Fake Subscription: ${entitlement} -> ${productIdentifier}`);
            });

            return acc;
        }, fakeResponse.subscriber);

        // Chuyển thành JSON và trả về
        console.log("🎉 Fake Subscription Created Successfully!");
        $done({ body: JSON.stringify(fakeResponse) });

    } catch (err) {
        console.log("❌ Lỗi khi xử lý dữ liệu:", err);
        $done({});
    }
});