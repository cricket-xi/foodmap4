export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface MenuItem {
  name: string;
  price: number;
  recommended?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  university: string;
  category: string;
  rating: number;
  price: number;
  emoji: string;
  discount: string;
  reviews: Review[];
  tags: string[];
  coordinates: { x: number; y: number }; // x, y percentages for static map
  menu: MenuItem[];
  dietaryFeatures: string[]; // e.g., 'spicy', 'cilantro', 'seafood', 'beef'
}

export const UNIVERSITIES = [
  "全部",
  "广州大学",
  "中山大学",
  "华南理工大学",
  "广东外语外贸大学",
  "华南师范大学",
  "贝岗村",
];

export const CATEGORIES = [
  "全部",
  "快餐简餐",
  "火锅烤肉",
  "奶茶饮品",
  "地方小吃",
  "粉面粥饭",
  "西餐日料",
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "广大商业中心·正宗烤肉拌饭",
    location: "广州大学商业中心二楼",
    university: "广州大学",
    category: "快餐简餐",
    rating: 4.8,
    price: 18,
    emoji: "🍱",
    discount: "凭学生证送煎蛋一份",
    tags: ["量大管饱", "出餐快", "神仙拌饭"],
    coordinates: { x: 25, y: 65 },
    menu: [
      { name: "招牌烤肉拌饭", price: 18, recommended: true },
      { name: "脆皮鸡拌饭", price: 16 },
      { name: "双拼拌饭", price: 20, recommended: true },
      { name: "奥尔良烤翅", price: 8 }
    ],
    dietaryFeatures: ["meat"],
    reviews: [
      {
        id: "r1",
        user: "广大干饭王",
        avatar: "https://picsum.photos/seed/u1/100/100",
        rating: 5,
        content: "每次下课必吃，老板给的肉超级多，拌饭酱绝了！",
        date: "2023-10-15",
      },
      {
        id: "r2",
        user: "不想早起",
        avatar: "https://picsum.photos/seed/u2/100/100",
        rating: 4.5,
        content: "味道不错，就是饭点人太多要排队。",
        date: "2023-10-12",
      },
    ],
  },
  {
    id: "2",
    name: "Gogo新天地·柳州螺蛳粉",
    location: "Gogo新天地负一楼美食街",
    university: "广东外语外贸大学",
    category: "粉面粥饭",
    rating: 4.6,
    price: 15,
    emoji: "🍜",
    discount: "加粉免费",
    tags: ["又臭又香", "辣得过瘾", "夜宵首选"],
    coordinates: { x: 45, y: 25 },
    menu: [
      { name: "招牌原味螺蛳粉", price: 15, recommended: true },
      { name: "炸蛋螺蛳粉", price: 18, recommended: true },
      { name: "鸭脚螺蛳粉", price: 20 },
      { name: "绿豆沙", price: 5 }
    ],
    dietaryFeatures: ["spicy"],
    reviews: [
      {
        id: "r3",
        user: "广外辣妹",
        avatar: "https://picsum.photos/seed/u3/100/100",
        rating: 5,
        content: "大学城最好吃的螺蛳粉，没有之一！炸蛋吸满汤汁绝绝子。",
        date: "2023-10-18",
      },
    ],
  },
  {
    id: "3",
    name: "贝岗村·东北烧烤",
    location: "贝岗村大街中段",
    university: "贝岗村",
    category: "火锅烤肉",
    rating: 4.7,
    price: 45,
    emoji: "🍢",
    discount: "全场8.8折（限周一至周四）",
    tags: ["社团聚餐", "烟火气", "烤茄子必点"],
    coordinates: { x: 55, y: 40 },
    menu: [
      { name: "羊肉串(10串)", price: 30, recommended: true },
      { name: "蒜蓉烤茄子", price: 12, recommended: true },
      { name: "烤鸡翅", price: 8 },
      { name: "烤韭菜", price: 5 }
    ],
    dietaryFeatures: ["meat", "beef_mutton"],
    reviews: [
      {
        id: "r4",
        user: "夜猫子",
        avatar: "https://picsum.photos/seed/u4/100/100",
        rating: 4.5,
        content: "社团聚餐常来，氛围很好，烤肉串很正宗。",
        date: "2023-10-20",
      },
    ],
  },
  {
    id: "4",
    name: "华工一饭·明炉烧鸭饭",
    location: "华南理工大学第一食堂一楼",
    university: "华南理工大学",
    category: "快餐简餐",
    rating: 4.9,
    price: 12,
    emoji: "🦆",
    discount: "校内食堂无额外优惠",
    tags: ["性价比之王", "皮脆肉嫩", "去晚没得吃"],
    coordinates: { x: 70, y: 45 },
    menu: [
      { name: "明炉烧鸭饭", price: 12, recommended: true },
      { name: "蜜汁叉烧饭", price: 14, recommended: true },
      { name: "烧鸭拼叉烧饭", price: 16 },
      { name: "老火靓汤", price: 3 }
    ],
    dietaryFeatures: ["meat"],
    reviews: [
      {
        id: "r5",
        user: "工科男",
        avatar: "https://picsum.photos/seed/u5/100/100",
        rating: 5,
        content: "12块钱要什么自行车，而且真的很好吃，皮很脆！",
        date: "2023-10-22",
      },
    ],
  },
  {
    id: "5",
    name: "中大东门·潮汕砂锅粥",
    location: "中山大学东门外小吃街",
    university: "中山大学",
    category: "粉面粥饭",
    rating: 4.5,
    price: 35,
    emoji: "🍲",
    discount: "送小菜两份",
    tags: ["养生", "海鲜新鲜", "暖胃"],
    coordinates: { x: 80, y: 75 },
    menu: [
      { name: "鲜虾干贝粥", price: 35, recommended: true },
      { name: "膏蟹鲜虾粥", price: 58, recommended: true },
      { name: "田鸡粥", price: 30 },
      { name: "普宁豆干", price: 15 }
    ],
    dietaryFeatures: ["seafood", "cilantro"],
    reviews: [
      {
        id: "r6",
        user: "养生达人",
        avatar: "https://picsum.photos/seed/u6/100/100",
        rating: 4.5,
        content: "虾蟹粥很鲜甜，冬天吃一锅太舒服了。",
        date: "2023-10-25",
      },
    ],
  },
  {
    id: "6",
    name: "广大商业中心·霸王茶姬",
    location: "广州大学商业中心一楼外围",
    university: "广州大学",
    category: "奶茶饮品",
    rating: 4.8,
    price: 18,
    emoji: "🧋",
    discount: "学生认证9折",
    tags: ["伯牙绝弦", "清爽解腻", "排队王"],
    coordinates: { x: 28, y: 70 },
    menu: [
      { name: "伯牙绝弦", price: 18, recommended: true },
      { name: "寻香山茶", price: 16 },
      { name: "花田乌龙", price: 16 },
      { name: "桂馥兰香", price: 18, recommended: true }
    ],
    dietaryFeatures: ["sweet"],
    reviews: [
      {
        id: "r7",
        user: "奶茶续命",
        avatar: "https://picsum.photos/seed/u7/100/100",
        rating: 5,
        content: "伯牙绝弦yyds，每次逛街必买。",
        date: "2023-10-26",
      },
    ],
  },
  {
    id: "7",
    name: "华师西门·重庆小面",
    location: "华南师范大学西门小吃街",
    university: "华南师范大学",
    category: "粉面粥饭",
    rating: 4.7,
    price: 14,
    emoji: "🍜",
    discount: "满20减2",
    tags: ["麻辣鲜香", "地道重庆味", "面条劲道"],
    coordinates: { x: 60, y: 60 },
    menu: [
      { name: "招牌重庆小面", price: 12, recommended: true },
      { name: "豌杂面", price: 16, recommended: true },
      { name: "红油抄手", price: 15 },
      { name: "冰粉", price: 6 }
    ],
    dietaryFeatures: ["spicy", "cilantro"],
    reviews: [
      {
        id: "r8",
        user: "无辣不欢",
        avatar: "https://picsum.photos/seed/u8/100/100",
        rating: 5,
        content: "辣得很过瘾，豌杂面绝了！",
        date: "2023-11-01",
      },
    ],
  },
  {
    id: "8",
    name: "广大二饭·轻食沙拉",
    location: "广州大学第二食堂二楼",
    university: "广州大学",
    category: "西餐日料",
    rating: 4.4,
    price: 22,
    emoji: "🥗",
    discount: "自带餐盒减1元",
    tags: ["减脂餐", "健康", "低卡"],
    coordinates: { x: 30, y: 55 },
    menu: [
      { name: "经典鸡胸肉沙拉", price: 20, recommended: true },
      { name: "龙利鱼荞麦面", price: 24, recommended: true },
      { name: "全素减脂沙拉", price: 18 },
      { name: "低卡油醋汁", price: 0 }
    ],
    dietaryFeatures: ["vegetarian_friendly"],
    reviews: [
      {
        id: "r9",
        user: "健身狂魔",
        avatar: "https://picsum.photos/seed/u9/100/100",
        rating: 4.5,
        content: "减脂期必备，鸡胸肉不柴，蔬菜很新鲜。",
        date: "2023-11-05",
      },
    ],
  },
  {
    id: "9",
    name: "贝岗村·正宗隆江猪脚饭",
    location: "贝岗村美食城一楼",
    university: "贝岗村",
    category: "快餐简餐",
    rating: 4.6,
    price: 16,
    emoji: "🍛",
    discount: "免费加饭加卤汁",
    tags: ["男人的浪漫", "软糯入味", "性价比高"],
    coordinates: { x: 50, y: 35 },
    menu: [
      { name: "招牌猪脚饭", price: 16, recommended: true },
      { name: "猪脚拼白切鸡饭", price: 20 },
      { name: "四点金饭", price: 22, recommended: true },
      { name: "卤水豆腐", price: 3 }
    ],
    dietaryFeatures: ["meat"],
    reviews: [
      {
        id: "r10",
        user: "干饭人",
        avatar: "https://picsum.photos/seed/u10/100/100",
        rating: 5,
        content: "猪脚炖得很烂，入口即化，卤汁拌饭能吃三大碗！",
        date: "2023-11-08",
      },
    ],
  },
  {
    id: "10",
    name: "中大南门·深夜豆浆",
    location: "中山大学南门外",
    university: "中山大学",
    category: "地方小吃",
    rating: 4.8,
    price: 15,
    emoji: "🥛",
    discount: "无",
    tags: ["夜宵好去处", "现磨豆浆", "油条绝配"],
    coordinates: { x: 85, y: 80 },
    menu: [
      { name: "现磨原味豆浆", price: 5, recommended: true },
      { name: "香酥大油条", price: 3, recommended: true },
      { name: "鲜肉小笼包", price: 10 },
      { name: "茶叶蛋", price: 2 }
    ],
    dietaryFeatures: ["vegetarian_friendly"],
    reviews: [
      {
        id: "r11",
        user: "熬夜冠军",
        avatar: "https://picsum.photos/seed/u11/100/100",
        rating: 5,
        content: "复习到半夜出来喝碗热豆浆，感觉整个人都活过来了。",
        date: "2023-11-10",
      },
    ],
  },
  {
    id: "11",
    name: "广外北门·新疆烤肉大盘鸡",
    location: "广外北门美食街",
    university: "广东外语外贸大学",
    category: "火锅烤肉",
    rating: 4.7,
    price: 45,
    emoji: "🍗",
    discount: "满100减10",
    tags: ["大盘鸡", "正宗新疆味", "聚餐首选"],
    coordinates: { x: 48, y: 20 },
    menu: [
      { name: "新疆大盘鸡(中份)", price: 68, recommended: true },
      { name: "红柳烤肉串", price: 12, recommended: true },
      { name: "烤包子", price: 6 },
      { name: "手工皮带面", price: 10 }
    ],
    dietaryFeatures: ["meat", "beef_mutton", "spicy", "cilantro"],
    reviews: [
      {
        id: "r12",
        user: "大胃王",
        avatar: "https://picsum.photos/seed/u12/100/100",
        rating: 5,
        content: "大盘鸡分量超级足，里面的土豆软糯入味，皮带面绝配！",
        date: "2023-11-12",
      },
    ],
  },
  {
    id: "12",
    name: "华工五山·老字号糖水铺",
    location: "华南理工大学五山校区东门",
    university: "华南理工大学",
    category: "甜品烘焙",
    rating: 4.9,
    price: 12,
    emoji: "🍧",
    discount: "第二份半价",
    tags: ["广式糖水", "清热解毒", "童年回忆"],
    coordinates: { x: 75, y: 50 },
    menu: [
      { name: "杨枝甘露", price: 15, recommended: true },
      { name: "双皮奶", price: 12, recommended: true },
      { name: "陈皮绿豆沙", price: 8 },
      { name: "香芋西米露", price: 10 }
    ],
    dietaryFeatures: ["sweet", "vegetarian_friendly"],
    reviews: [
      {
        id: "r13",
        user: "甜品控",
        avatar: "https://picsum.photos/seed/u13/100/100",
        rating: 5,
        content: "双皮奶很正宗，奶香浓郁，夏天来一碗绿豆沙太解暑了。",
        date: "2023-11-15",
      },
    ],
  },
  {
    id: "13",
    name: "广大商业中心·瑞幸咖啡",
    location: "广州大学商业中心一楼",
    university: "广州大学",
    category: "奶茶饮品",
    rating: 4.5,
    price: 16,
    emoji: "☕",
    discount: "9.9元特价券可用",
    tags: ["早八必备", "提神醒脑", "出杯快"],
    coordinates: { x: 26, y: 68 },
    menu: [
      { name: "生椰拿铁", price: 16, recommended: true },
      { name: "丝绒拿铁", price: 18 },
      { name: "陨石拿铁", price: 18, recommended: true },
      { name: "冰吸生椰拿铁", price: 18 }
    ],
    dietaryFeatures: ["sweet", "vegetarian_friendly"],
    reviews: [
      {
        id: "r14",
        user: "早八人",
        avatar: "https://picsum.photos/seed/u14/100/100",
        rating: 4.5,
        content: "每天早上必点一杯生椰拿铁，不然上课要睡着。",
        date: "2023-11-18",
      },
    ],
  },
  {
    id: "14",
    name: "贝岗村·潮汕牛肉火锅",
    location: "贝岗村美食街尽头",
    university: "贝岗村",
    category: "火锅烤肉",
    rating: 4.8,
    price: 65,
    emoji: "🥘",
    discount: "送手打牛筋丸一份",
    tags: ["现切牛肉", "沙茶酱绝赞", "聚餐"],
    coordinates: { x: 52, y: 42 },
    menu: [
      { name: "吊龙伴", price: 38, recommended: true },
      { name: "匙柄", price: 38 },
      { name: "手打牛肉丸", price: 28, recommended: true },
      { name: "牛骨清汤锅底", price: 20 }
    ],
    dietaryFeatures: ["meat", "beef_mutton", "cilantro"],
    reviews: [
      {
        id: "r15",
        user: "肉食动物",
        avatar: "https://picsum.photos/seed/u15/100/100",
        rating: 5,
        content: "牛肉很新鲜，涮几秒就能吃，蘸上沙茶酱简直绝了！",
        date: "2023-11-20",
      },
    ],
  },
  {
    id: "15",
    name: "华师石牌桥·老西关肠粉",
    location: "华师石牌桥地铁站旁",
    university: "华南师范大学",
    category: "地方小吃",
    rating: 4.6,
    price: 10,
    emoji: "🥟",
    discount: "加蛋加肉仅需2元",
    tags: ["皮薄馅多", "老广味道", "早餐首选"],
    coordinates: { x: 65, y: 55 },
    menu: [
      { name: "招牌瘦肉肠", price: 8, recommended: true },
      { name: "鲜虾肠粉", price: 12, recommended: true },
      { name: "鸡蛋肠", price: 6 },
      { name: "艇仔粥", price: 10 }
    ],
    dietaryFeatures: ["meat", "seafood"],
    reviews: [
      {
        id: "r16",
        user: "老广",
        avatar: "https://picsum.photos/seed/u16/100/100",
        rating: 4.5,
        content: "肠粉皮很滑，酱油调得刚刚好，有小时候的味道。",
        date: "2023-11-22",
      },
    ],
  },
  {
    id: "16",
    name: "中大东门·韩国炸鸡啤酒",
    location: "中山大学东门商业街",
    university: "中山大学",
    category: "日韩料理",
    rating: 4.7,
    price: 40,
    emoji: "🍗",
    discount: "双人套餐立减15",
    tags: ["韩剧同款", "外酥里嫩", "甜辣酱"],
    coordinates: { x: 82, y: 72 },
    menu: [
      { name: "甜辣无骨炸鸡", price: 35, recommended: true },
      { name: "雪花芝士炸鸡", price: 38, recommended: true },
      { name: "韩式部队锅", price: 58 },
      { name: "初饮初乐烧酒", price: 18 }
    ],
    dietaryFeatures: ["meat", "spicy"],
    reviews: [
      {
        id: "r17",
        user: "韩剧迷",
        avatar: "https://picsum.photos/seed/u17/100/100",
        rating: 5,
        content: "炸鸡外皮超级酥脆，甜辣酱的味道很正宗，配啤酒绝配！",
        date: "2023-11-25",
      },
    ],
  },
  {
    id: "17",
    name: "广外西门·意式手工披萨",
    location: "广东外语外贸大学西门",
    university: "广东外语外贸大学",
    category: "西餐日料",
    rating: 4.5,
    price: 55,
    emoji: "🍕",
    discount: "周二披萨半价",
    tags: ["芝士拉丝", "薄底披萨", "约会圣地"],
    coordinates: { x: 42, y: 28 },
    menu: [
      { name: "玛格丽特披萨", price: 48, recommended: true },
      { name: "榴莲忘返披萨", price: 68, recommended: true },
      { name: "黑松露蘑菇意面", price: 38 },
      { name: "经典凯撒沙拉", price: 28 }
    ],
    dietaryFeatures: ["meat", "vegetarian_friendly"],
    reviews: [
      {
        id: "r18",
        user: "披萨爱好者",
        avatar: "https://picsum.photos/seed/u18/100/100",
        rating: 4.5,
        content: "榴莲披萨的榴莲肉很多，芝士拉丝效果满分，薄底吃起来不腻。",
        date: "2023-11-28",
      },
    ],
  },
  {
    id: "18",
    name: "广大商业中心·探鱼烤鱼",
    location: "广州大学商业中心三楼",
    university: "广州大学",
    category: "地方菜系",
    rating: 4.6,
    price: 75,
    emoji: "🐟",
    discount: "学生证8.5折",
    tags: ["鲜香麻辣", "聚餐必选", "配菜丰富"],
    coordinates: { x: 25, y: 65 },
    menu: [
      { name: "重庆豆花烤鱼", price: 128, recommended: true },
      { name: "鲜青椒烤鱼", price: 138, recommended: true },
      { name: "烤茄子", price: 12 },
      { name: "冰粉", price: 8 }
    ],
    dietaryFeatures: ["seafood", "spicy", "cilantro"],
    reviews: [
      {
        id: "r19",
        user: "吃鱼达人",
        avatar: "https://picsum.photos/seed/u19/100/100",
        rating: 5,
        content: "豆花烤鱼永远的神！豆花吸满了汤汁，比鱼肉还好吃。",
        date: "2023-12-01",
      },
    ],
  },
  {
    id: "19",
    name: "华工三饭·自选麻辣烫",
    location: "华南理工大学第三食堂",
    university: "华南理工大学",
    category: "快餐简餐",
    rating: 4.4,
    price: 18,
    emoji: "🍢",
    discount: "无",
    tags: ["菜品丰富", "汤底浓郁", "丰俭由人"],
    coordinates: { x: 72, y: 48 },
    menu: [
      { name: "骨汤锅底", price: 2, recommended: true },
      { name: "番茄锅底", price: 3, recommended: true },
      { name: "荤菜自选(50g)", price: 3.5 },
      { name: "素菜自选(50g)", price: 1.5 }
    ],
    dietaryFeatures: ["meat", "spicy", "vegetarian_friendly"],
    reviews: [
      {
        id: "r20",
        user: "随便吃点",
        avatar: "https://picsum.photos/seed/u20/100/100",
        rating: 4.5,
        content: "番茄锅底很浓郁，每次不知道吃什么就来吃麻辣烫。",
        date: "2023-12-05",
      },
    ],
  },
  {
    id: "20",
    name: "贝岗村·深夜大排档炒粉",
    location: "贝岗村夜市街",
    university: "贝岗村",
    category: "宵夜大排档",
    rating: 4.8,
    price: 15,
    emoji: "🥡",
    discount: "加粉不加价",
    tags: ["锅气十足", "灵魂宵夜", "猛火爆炒"],
    coordinates: { x: 55, y: 38 },
    menu: [
      { name: "干炒牛河", price: 15, recommended: true },
      { name: "湿炒牛河", price: 18 },
      { name: "三丝炒米粉", price: 12, recommended: true },
      { name: "炒花甲", price: 25 }
    ],
    dietaryFeatures: ["meat", "beef_mutton", "seafood"],
    reviews: [
      {
        id: "r21",
        user: "夜宵狂魔",
        avatar: "https://picsum.photos/seed/u21/100/100",
        rating: 5,
        content: "大排档的炒粉就是有灵魂，锅气十足，牛肉也很嫩。",
        date: "2023-12-08",
      },
    ],
  }
];
