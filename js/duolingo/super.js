const url = $request.url;
const body = JSON.parse($response.body);

if (url.includes("/users/")) {
    console.log(`🔓 Unlocking Super Duolingo for: ${body.username}`);

    // Gán trạng thái Super Duolingo
    body.subscription = {
        "productId": "com.duolingo.super.yearly",
        "isActive": true,
        "isLifetime": true,
        "expiryDate": "2099-12-31T23:59:59Z",
        "tier": "Super"
    };

    // Nếu API trả về khóa học hoặc cài đặt user
    if (body.hasOwnProperty("user")) {
        body.user = {
            ...body.user,
            "isSuper": true,
            "hasSuper": true
        };
    }

    $done({ body: JSON.stringify(body) });
} else if (url.includes("/subscribers/")) {
    console.log(`🔓 Fake Subscription Active`);
    
    // Trả về trạng thái subscription hợp lệ
    body = {
        "subscriber": {
            "subscriptions": {
                "com.duolingo.super.yearly": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "purchase_date": "2024-01-01T00:00:00Z"
                }
            },
            "entitlements": {
                "Super": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "product_identifier": "com.duolingo.super.yearly",
                    "purchase_date": "2024-01-01T00:00:00Z"
                }
            }
        }
    };

    $done({ body: JSON.stringify(body) });
} else {
    $done({});
}