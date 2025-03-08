// ViBoss Studio - 08/03/2025
const version = 'V1.0.1';

try {
    let body = $response.body;
    let obj = JSON.parse(body);

    // Cập nhật thông tin gói Premium (Go+)
    obj.plan = {
        "vendor": "apple",
        "id": "high_tier",
        "manageable": true,
        "plan_id": "go-plus",
        "plan_name": "SoundCloud Go+",
        "expires_at": "2099-12-31T23:59:59Z",  // Thêm ngày hết hạn
        "is_trial": false
    };

    // Danh sách tính năng cần bật (tự động mở khóa)
    const premiumFeatures = [
        "offline_sync",
        "no_audio_ads",
        "hq_audio",
        "system_playlist_in_library",
        "new_home",
        "unlimited_skips",
        "background_playback"
    ];

    // Cập nhật tính năng với trạng thái `enabled: true`
    obj.features = premiumFeatures.map(feature => ({
        "name": feature,
        "enabled": true,
        "plans": ["high_tier"]
    }));

    // Vô hiệu hóa quảng cáo
    obj.features.push({
        "name": "ads_krux",
        "enabled": false,
        "plans": []
    });

    // Chặn tính năng Spotlight nếu cần
    obj.features.push({
        "name": "spotlight",
        "enabled": false,
        "plans": []
    });

    // Chuyển đổi lại thành JSON và trả về kết quả
    $done({ body: JSON.stringify(obj) });

} catch (error) {
    console.log(`[ViBoss Studio] Lỗi khi xử lý dữ liệu: ${error.message}`);
    $done({});
}