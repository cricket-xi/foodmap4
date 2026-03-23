INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (1, 'student', '123456', 'user', 'https://picsum.photos/seed/user/200/200', '广州大学', 4, 450, 500);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (2, 'merchant', '123456', 'merchant', 'https://picsum.photos/seed/merchant/200/200', '广州大学', 1, 0, 100);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (3, 'admin', '123456', 'admin', 'https://picsum.photos/seed/admin/200/200', '平台管理', 99, 9999, 9999);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (4, 'student2', '123456', 'user', 'https://picsum.photos/seed/user2/200/200', '中山大学', 2, 120, 200);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (5, 'merchant2', '123456', 'merchant', 'https://picsum.photos/seed/merchant2/200/200', '中山大学', 1, 0, 100);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (6, 'student3', '123456', 'user', 'https://picsum.photos/seed/user3/200/200', '华南理工', 3, 250, 300);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (7, 'merchant3', '123456', 'merchant', 'https://picsum.photos/seed/merchant3/200/200', '华南理工', 2, 150, 200);
INSERT IGNORE INTO app_user (id, username, password, role, avatar, university, level, exp, next_level_exp) VALUES (8, 'student4', '123456', 'user', 'https://picsum.photos/seed/user4/200/200', '暨南大学', 1, 50, 100);

INSERT IGNORE INTO restaurant (id, name, emoji, university, category, rating, price, distance, latitude, longitude) VALUES (1, '阿强酸菜鱼', '🐟', '广州大学', '正餐', 4.8, 45, '500m', 23.045, 113.385);
INSERT IGNORE INTO restaurant_tags (restaurant_id, tags) VALUES (1, '分量大'), (1, '米饭免费'), (1, '重口味');
INSERT IGNORE INTO restaurant_dietary_features (restaurant_id, dietary_features) VALUES (1, 'spicy'), (1, 'seafood');

INSERT IGNORE INTO restaurant (id, name, emoji, university, category, rating, price, distance, latitude, longitude) VALUES (2, '东北饺子馆', '🥟', '中山大学', '快餐', 4.5, 18, '1.2km', 23.055, 113.395);
INSERT IGNORE INTO restaurant_tags (restaurant_id, tags) VALUES (2, '阿姨手抖'), (2, '上菜快'), (2, '性价比高');
INSERT IGNORE INTO restaurant_dietary_features (restaurant_id, dietary_features) VALUES (2, 'meat');

INSERT IGNORE INTO restaurant (id, name, emoji, university, category, rating, price, distance, latitude, longitude) VALUES (3, '深夜烧烤摊', '🍢', '华南理工', '烧烤', 4.2, 55, '800m', 23.048, 113.388);
INSERT IGNORE INTO restaurant_tags (restaurant_id, tags) VALUES (3, '夜猫子必去'), (3, '烟火气'), (3, '老板热情');
INSERT IGNORE INTO restaurant_dietary_features (restaurant_id, dietary_features) VALUES (3, 'meat'), (3, 'spicy');

INSERT IGNORE INTO restaurant (id, name, emoji, university, category, rating, price, distance, latitude, longitude) VALUES (4, '一点点', '🧋', '广州大学', '奶茶', 4.6, 15, '200m', 23.042, 113.382);
INSERT IGNORE INTO restaurant_tags (restaurant_id, tags) VALUES (4, '排队王'), (4, '波霸好吃'), (4, '免费加料');

INSERT IGNORE INTO restaurant (id, name, emoji, university, category, rating, price, distance, latitude, longitude) VALUES (5, '老麻抄手', '🍜', '暨南大学', '小吃', 4.7, 22, '300m', 23.125, 113.345);
INSERT IGNORE INTO restaurant_tags (restaurant_id, tags) VALUES (5, '巨麻'), (5, '地道川味');
INSERT IGNORE INTO restaurant_dietary_features (restaurant_id, dietary_features) VALUES (5, 'spicy');

INSERT IGNORE INTO review (id, restaurant_id, user, avatar, rating, content, date) VALUES (1, 1, '辣妹子', 'https://picsum.photos/seed/user1/100/100', 5, '味道绝了！酸菜比鱼还好吃，每次来都要干三大碗米饭。', '2023-10-15');
INSERT IGNORE INTO review (id, restaurant_id, user, avatar, rating, content, date) VALUES (2, 1, '不吃香菜', 'https://picsum.photos/seed/user2/100/100', 4, '鱼肉很嫩，就是稍微有点油。记得跟老板说不要香菜！', '2023-10-12');
INSERT IGNORE INTO review (id, restaurant_id, user, avatar, rating, content, date) VALUES (3, 2, 'student', 'https://picsum.photos/seed/user/200/200', 5, '饺子很好吃，分量很足！', '2023-10-20');
INSERT IGNORE INTO review (id, restaurant_id, user, avatar, rating, content, date) VALUES (4, 1, 'student2', 'https://picsum.photos/seed/user2/200/200', 5, '真的很好吃，强烈推荐！', '2023-10-25');
INSERT IGNORE INTO review (id, restaurant_id, user, avatar, rating, content, date) VALUES (5, 5, 'student4', 'https://picsum.photos/seed/user4/200/200', 5, '太麻了，爽！', '2023-10-28');

INSERT IGNORE INTO user_favorites (user_id, restaurant_id) VALUES (1, 1);
INSERT IGNORE INTO user_favorites (user_id, restaurant_id) VALUES (1, 2);
INSERT IGNORE INTO user_favorites (user_id, restaurant_id) VALUES (4, 1);
INSERT IGNORE INTO user_favorites (user_id, restaurant_id) VALUES (6, 3);
INSERT IGNORE INTO user_favorites (user_id, restaurant_id) VALUES (8, 5);

INSERT IGNORE INTO menu_item (id, restaurant_id, name, price, description, image, status) VALUES (1, 1, '招牌酸菜鱼', 45, '鲜嫩鱼片，酸爽开胃', 'https://picsum.photos/seed/fish/200/200', 'AVAILABLE');
INSERT IGNORE INTO menu_item (id, restaurant_id, name, price, description, image, status) VALUES (2, 1, '口水鸡', 28, '麻辣鲜香，肉质细嫩', 'https://picsum.photos/seed/chicken/200/200', 'AVAILABLE');
INSERT IGNORE INTO menu_item (id, restaurant_id, name, price, description, image, status) VALUES (3, 1, '干锅包菜', 18, '香脆可口，下饭神器', 'https://picsum.photos/seed/cabbage/200/200', 'AVAILABLE');
INSERT IGNORE INTO menu_item (id, restaurant_id, name, price, description, image, status) VALUES (4, 5, '清汤抄手', 20, '原汁原味', 'https://picsum.photos/seed/soup/200/200', 'AVAILABLE');

INSERT IGNORE INTO coupon (id, restaurant_id, title, discount_amount, min_spend, total_quantity, remaining_quantity, valid_until, status) VALUES (1, 1, '满50减10', 10.00, 50.00, 100, 85, '2026-12-31', 'ACTIVE');
INSERT IGNORE INTO coupon (id, restaurant_id, title, discount_amount, min_spend, total_quantity, remaining_quantity, valid_until, status) VALUES (2, 2, '满20减3', 3.00, 20.00, 50, 20, '2026-12-31', 'ACTIVE');
INSERT IGNORE INTO coupon (id, restaurant_id, title, discount_amount, min_spend, total_quantity, remaining_quantity, valid_until, status) VALUES (3, 3, '夜宵特惠满100减20', 20.00, 100.00, 30, 15, '2026-12-31', 'ACTIVE');
INSERT IGNORE INTO coupon (id, restaurant_id, title, discount_amount, min_spend, total_quantity, remaining_quantity, valid_until, status) VALUES (4, 5, '新店尝鲜减5元', 5.00, 20.00, 200, 150, '2026-12-31', 'ACTIVE');

INSERT IGNORE INTO user_coupon (id, user_id, coupon_id, status) VALUES (1, 1, 1, 'UNUSED');
INSERT IGNORE INTO user_coupon (id, user_id, coupon_id, status) VALUES (2, 4, 1, 'USED');
INSERT IGNORE INTO user_coupon (id, user_id, coupon_id, status) VALUES (3, 6, 3, 'UNUSED');
INSERT IGNORE INTO user_coupon (id, user_id, coupon_id, status) VALUES (4, 8, 4, 'UNUSED');
INSERT IGNORE INTO user_coupon (id, user_id, coupon_id, status) VALUES (5, 1, 4, 'UNUSED');

INSERT IGNORE INTO platform_log (id, action_type, actor_id, actor_role, target_id, description) VALUES (1, 'PUBLISH_COUPON', 2, 'merchant', 1, '商家发布了满50减10优惠券');
INSERT IGNORE INTO platform_log (id, action_type, actor_id, actor_role, target_id, description) VALUES (2, 'CLAIM_COUPON', 1, 'user', 1, '用户领取了满50减10优惠券');
INSERT IGNORE INTO platform_log (id, action_type, actor_id, actor_role, target_id, description) VALUES (3, 'PUBLISH_COUPON', 7, 'merchant', 3, '商家发布了夜宵特惠满100减20优惠券');
INSERT IGNORE INTO platform_log (id, action_type, actor_id, actor_role, target_id, description) VALUES (4, 'CLAIM_COUPON', 6, 'user', 3, '用户领取了夜宵特惠满100减20优惠券');
INSERT IGNORE INTO platform_log (id, action_type, actor_id, actor_role, target_id, description) VALUES (5, 'SYSTEM_ALERT', 3, 'admin', 2, '系统检测到商家2异常发券行为，已标记');
INSERT IGNORE INTO platform_log (id, action_type, actor_id, actor_role, target_id, description) VALUES (6, 'CLAIM_COUPON', 8, 'user', 4, '用户领取了新店尝鲜减5元优惠券');
