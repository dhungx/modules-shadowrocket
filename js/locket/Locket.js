const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

var locket02 = {
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

var dohungx = {
  grace_period_expires_date: null,
  purchase_date: "2024-07-28T01:04:17Z",
  product_identifier: "com.locket02.premium.yearly",
  expires_date: "2099-12-18T01:04:17Z"
};

const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let [e, s] = mapping[match];
  
  if (s) {
    dohungx.product_identifier = s;
    obj.subscriber.subscriptions[s] = locket02;
  } else {
    obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locket02;
  }

  obj.subscriber.entitlements[e] = dohungx;
} else {
  obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locket02;
  obj.subscriber.entitlements.pro = dohungx;
}

$done({ body: JSON.stringify(obj) });