// ViBoss Studio - Cải tiến Unlock Premium
const mapping = {'%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],'Locket': ['Gold']}; 
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"], obj = JSON.parse($response.body); 
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!"; 
var dohungx = {is_sandbox: false, ownership_type: "PURCHASED", billing_issues_detected_at: null, period_type: "normal", expires_date: "2099-12-18T01:04:17Z", grace_period_expires_date: null, unsubscribe_detected_at: null, original_purchase_date: "2024-07-28T01:04:18Z", purchase_date: "2024-07-28T01:04:17Z", store: "app_store"}, premiumEntitlement = {grace_period_expires_date: null, purchase_date: "2024-07-28T01:04:17Z", product_identifier: "com.dohungx.premium.yearly", expires_date: "2099-12-18T01:04:17Z"}; 
const match = Object.keys(mapping).find(e => ua.includes(e)); 
if (match) {let [e, s] = mapping[match]; s ? (premiumEntitlement.product_identifier = s, obj.subscriber.subscriptions[s] = dohungx) : obj.subscriber.subscriptions["com.dohungx.premium.yearly"] = dohungx, obj.subscriber.entitlements[e] = premiumEntitlement;} 
else obj.subscriber.subscriptions["com.dohungx.premium.yearly"] = dohungx, obj.subscriber.entitlements.pro = premiumEntitlement; 
$done({body: JSON.stringify(obj)});