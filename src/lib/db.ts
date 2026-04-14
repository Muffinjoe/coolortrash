import { neon } from "@neondatabase/serverless";

let initialized = false;

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

// Format: [shortTitle, imageUrl, affiliateUrl, price, cool_votes, trash_votes]
const SEED_DATA: [string, string, string, string, number, number][] = [
  ["Chubby Seal Pillow", "https://m.media-amazon.com/images/I/61rE1xp-8jL._AC_SX679_.jpg", "https://www.amazon.com/dp/B082413MWQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.49", 3, 2],
  ["MAGA Sock Squad", "https://m.media-amazon.com/images/I/616dsy8W5XL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C651W4PT?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Tortilla Blanket", "https://m.media-amazon.com/images/I/71Y-n6tMjgL._AC_SX679_.jpg", "https://www.amazon.com/dp/B082SHCSH6?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.99", 3, 2],
  ["Chicken Egg Lamp", "https://m.media-amazon.com/images/I/71IEoqENz9L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BZS1ZVXF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Squirrel Puppet", "https://m.media-amazon.com/images/I/81KDPZ3GLxL._AC_SX679_.jpg", "https://www.amazon.com/dp/B08SBN1YJD?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$6.99", 3, 2],
  ["Toilet Mug", "https://m.media-amazon.com/images/I/51ODnD6iWjL._AC_SX679_.jpg", "https://www.amazon.com/dp/B002SQG4TU?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$15.99", 3, 2],
  ["Splatypus Spatula", "https://m.media-amazon.com/images/I/61kSyC6HXDL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07H7ZDBV4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.95", 3, 2],
  ["Receipt Scarf", "https://m.media-amazon.com/images/I/611lmXI-ZpL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07NF96R47?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Fried Chicken Keychain", "https://m.media-amazon.com/images/I/5131MEjgE7L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BV671TFK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Fake Beer Belly", "https://m.media-amazon.com/images/I/51httXoZhfL._AC_SX679_.jpg", "https://www.amazon.com/dp/B075S2ZCYQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$7.59", 3, 2],
  ["Prescription Coffee Mug", "https://m.media-amazon.com/images/I/61VPNTpHFeL._SX679_.jpg", "https://www.amazon.com/dp/B0085MQPSG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.95", 3, 2],
  ["Recycle Bin Mug", "https://m.media-amazon.com/images/I/61YsWpEMLdL._SX679_.jpg", "https://www.amazon.com/dp/B0085MX3DG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.99", 3, 2],
  ["Bacon Air Freshener", "https://m.media-amazon.com/images/I/712ltOlH34L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0095UVKRI?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Toilet Golf Game", "https://m.media-amazon.com/images/I/71e9WUGbzTL._AC_SY879_.jpg", "https://www.amazon.com/dp/B0BBCHQJSN?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Candy Covert", "https://m.media-amazon.com/images/I/71NuSCxuD7L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CX5G8MM6?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.99", 3, 2],
  ["Empty Promise", "https://m.media-amazon.com/images/I/81U-AMvZ0BL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D9FR5FYF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Food Decision Dice", "https://m.media-amazon.com/images/I/71xTowPQTkL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F917BNQJ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$6.99", 3, 2],
  ["Bald Man's Comb", "https://m.media-amazon.com/images/I/719OmVjnXdL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DHD1DH9Y?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.99", 3, 2],
  ["Ear Trumpet Horn", "https://m.media-amazon.com/images/I/71EwLDPI0FL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FBG3T5GL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$31.98", 3, 2],
  ["Birthday Trucker", "https://m.media-amazon.com/images/I/612rZD1yYqL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B1PPD7GG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Moon Bum Decal", "https://m.media-amazon.com/images/I/71j+W5+howL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FSCCCGFF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$11.99", 3, 2],
  ["Poo in a Gift", "https://m.media-amazon.com/images/I/817XQbvIVJL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07W4FLX96?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Inflatable Giant", "https://m.media-amazon.com/images/I/71MVnOoXUVL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CV8261M2?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Cricket Caper", "https://m.media-amazon.com/images/I/71eung7GlAL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DYSTGKHD?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$15.49", 3, 2],
  ["Fake Lottery Tickets", "https://m.media-amazon.com/images/I/81Df9o2t4dL._AC_SX679_.jpg", "https://www.amazon.com/dp/B082BG37HR?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Sensory Sox", "https://m.media-amazon.com/images/I/61QawTB9tuL._AC_SX679_.jpg", "https://www.amazon.com/dp/B01MRRW91H?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$22.96", 3, 2],
  ["Dick Swinging Game", "https://m.media-amazon.com/images/I/61iPpunFoML._AC_SX679_.jpg", "https://www.amazon.com/dp/B0G38D7V3Q?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Squishy Stress Ball", "https://m.media-amazon.com/images/I/71veZA43WOL._AC_SY879_.jpg", "https://www.amazon.com/dp/B0F7M16P52?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.96", 3, 2],
  ["Elephant Boxer", "https://m.media-amazon.com/images/I/610Qom--kDL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0G4CL8RHP?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Belly BBQ Apron", "https://m.media-amazon.com/images/I/716cKutIsuL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DCZ52R79?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Tiny Hands Gag", "https://m.media-amazon.com/images/I/71sSSE4oB5L._AC_SX679_.jpg", "https://www.amazon.com/dp/B09KB61XKY?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$25.87", 3, 2],
  ["Tiny Hands Puppet", "https://m.media-amazon.com/images/I/61W859M91pL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D9KV11HS?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.95", 3, 2],
  ["Tiny Hands Prank", "https://m.media-amazon.com/images/I/71QlcfPxinL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FMFQ4HD4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.99", 3, 2],
  ["Creepy Pigeon Mask", "https://m.media-amazon.com/images/I/71aPJGbxqOL._AC_SX679_.jpg", "https://www.amazon.com/dp/B010BRP7I6?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Creepy Horse Mask", "https://m.media-amazon.com/images/I/712NTFAqMJL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0107XRQ7E?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Creepy Poodle Mask", "https://m.media-amazon.com/images/I/510RBM-tzXL._AC_SX679_.jpg", "https://www.amazon.com/dp/B015PSIRW4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Bobbing Water Bird", "https://m.media-amazon.com/images/I/516BYgmfJ4L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0GHFHBP43?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.99", 3, 2],
  ["Pallas Cat Plush", "https://m.media-amazon.com/images/I/71eo8v8d3UL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BNCYFMDJ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$23.39", 3, 2],
  ["Emergency Underpants", "https://m.media-amazon.com/images/I/61Pokio17sL._AC_SX679_.jpg", "https://www.amazon.com/dp/B003DM3MN4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$6.99", 3, 2],
  ["Belly Button Brush", "https://m.media-amazon.com/images/I/61Da2GnMEPL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DK6P11QY?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$5.99", 3, 2],
  ["The Cleanus", "https://m.media-amazon.com/images/I/81J3VAdasxL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D9C65DRZ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Cat Hat Prank", "https://m.media-amazon.com/images/I/71WmTc-R9cL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CHT8XBG2?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.99", 3, 2],
  ["Nap Time Prank", "https://m.media-amazon.com/images/I/71+ibvXbyxL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00G4GQFMG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Mini Finger Hands", "https://m.media-amazon.com/images/I/71WGbzgiahL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DRTY8LGK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Magic Fortune Teller", "https://m.media-amazon.com/images/I/8192d2+qedL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CYKK1167?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.99", 3, 2],
  ["World's Smallest Violin", "https://m.media-amazon.com/images/I/81gLbYZjSzL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CQS1VK5N?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Meme Sound Button", "https://m.media-amazon.com/images/I/71EEZ9B3eHL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D97CPJ4P?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.89", 3, 2],
  ["Air Horn", "https://m.media-amazon.com/images/I/71oHU95DOfL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B5GGVPRX?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Squirrel Hot Tub", "https://m.media-amazon.com/images/I/71OY7W6B2NL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CK4DSZQL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Cast & Blast", "https://m.media-amazon.com/images/I/81neenm99cL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DHDWYP71?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$995", 3, 2],
  ["Wake & Bake", "https://m.media-amazon.com/images/I/81DKJD4DJdL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00A0RIXZW?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$31.98", 3, 2],
  ["Eye Bleach Meme", "https://m.media-amazon.com/images/I/81JsyWWy+hL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CJM2YLQK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$7.99", 3, 2],
  ["Fake Electrical Outlet", "https://m.media-amazon.com/images/I/61UPX4L5TDL._SX522_.jpg", "https://www.amazon.com/dp/B06XJJWHV6?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Parking Tickets", "https://m.media-amazon.com/images/I/81zEkVK19vL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07JNMFCYQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$7.25", 3, 2],
  ["Junk Hand Sanitizer", "https://m.media-amazon.com/images/I/81BQJdliToL._SX679_.jpg", "https://www.amazon.com/dp/B06XR2Z2KK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Fake Parking Ticket", "https://m.media-amazon.com/images/I/71oE0WaZH+L._AC_SX679_.jpg", "https://www.amazon.com/dp/B06XB4F93J?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$6.49", 3, 2],
  ["Gift of Nothing", "https://m.media-amazon.com/images/I/81fObUSDmqL._AC_SX679_.jpg", "https://www.amazon.com/dp/B09SBKLLTG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Dehydrated Water", "https://m.media-amazon.com/images/I/71TtgTzJ8kL._AC_SX679_.jpg", "https://www.amazon.com/dp/B072L38SGT?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Parking Fines", "https://m.media-amazon.com/images/I/71ZIZoGG9ML._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FMYCL7SH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.99", 3, 2],
  ["Horn Oil Can", "https://m.media-amazon.com/images/I/71FULdtvm6L._AC_SY879_.jpg", "https://www.amazon.com/dp/B0BBNGR983?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.99", 3, 2],
  ["Dumpster Fire Coin", "https://m.media-amazon.com/images/I/812xsWC5LNL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DF6JZB8M?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.99", 3, 2],
  ["MJ Rookie Card", "https://m.media-amazon.com/images/I/81L6RHLyaAL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CP2RV36B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$1,707.99", 3, 2],
  ["4D Massage Chair", "https://m.media-amazon.com/images/I/71889n9NYtL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BGR93LQK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$79.99", 3, 2],
  ["Green Submariner", "https://m.media-amazon.com/images/I/712BY6k-jJL._AC_SY695_.jpg", "https://www.amazon.com/dp/B00VMZ3TW8?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12,000", 3, 2],
  ["Grumpy Frog", "https://m.media-amazon.com/images/I/71T+WIBDVNL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DBVTF6LR?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.99", 3, 2],
  ["Banana Hat", "https://m.media-amazon.com/images/I/61OKSCNvi+L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C7CHVVMQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Oil Change Tube", "https://m.media-amazon.com/images/I/61UxjUenRzL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D6XYN8Z8?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$124.99", 3, 2],
  ["Handerpants", "https://m.media-amazon.com/images/I/51cCOq5+34L._AC_SX679_.jpg", "https://www.amazon.com/dp/B002Q0L6UK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.56", 3, 2],
  ["Unusual Knowledge", "https://m.media-amazon.com/images/I/81AbM2vPvPL._SY522_.jpg", "https://www.amazon.com/dp/1450845800?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Tibetan Singing Bowl", "https://m.media-amazon.com/images/I/51ljE2JfbbL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FDX3JSMQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$69.99", 3, 2],
  ["Blobfish Toy", "https://m.media-amazon.com/images/I/61V2nlrmn9L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07YSWXGLH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Didgeridoo", "https://m.media-amazon.com/images/I/911ZSjlboyL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0087HEO64?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$59.99", 3, 2],
  ["Shark Blanket", "https://m.media-amazon.com/images/I/51WyCFq0XUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CH9TWC91?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Chicken Leg Socks", "https://m.media-amazon.com/images/I/61-1GB4OUOL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DCG35WG5?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Horse Shark Toy", "https://m.media-amazon.com/images/I/71vVUZJSsnL._AC_SX679_.jpg", "https://www.amazon.com/dp/B08L287BQ8?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$15.95", 3, 2],
  ["Possum Car", "https://m.media-amazon.com/images/I/61lLOuTXhiL._AC_SX679_.jpg", "https://www.amazon.com/dp/B098BPP9F8?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$11.33", 3, 2],
  ["Thug Life Glasses", "https://m.media-amazon.com/images/I/51DjqZkxvpL._AC_SX679_.jpg", "https://www.amazon.com/dp/B074361MM5?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Muscle Duck", "https://m.media-amazon.com/images/I/61v0DeZ+mSL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FPXCBV4C?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.99", 3, 2],
  ["Finger Chopsticks", "https://m.media-amazon.com/images/I/71Rf3UfzoOL._AC_SX679_.jpg", "https://www.amazon.com/dp/B09PY2RC4B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$15.99", 3, 2],
  ["Lobster Claws", "https://m.media-amazon.com/images/I/61+SrXVvR9L._AC_SY695_.jpg", "https://www.amazon.com/dp/B07JKP993B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Extra Horrible Card Game", "https://m.media-amazon.com/images/I/81bxkboACmL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D2JG7873?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$24.97", 3, 2],
  ["People of Walmart Book", "https://m.media-amazon.com/images/I/819lHzOP-1L._SY522_.jpg", "https://www.amazon.com/dp/1945056088?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Dino Nuggets Pillow", "https://m.media-amazon.com/images/I/715Qc6ve0pL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CT2MFJ23?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.99", 3, 2],
  ["Magnetic Sock Holders", "https://m.media-amazon.com/images/I/61r1AVicG4L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C9X67ZWH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Butter Toast Bag", "https://m.media-amazon.com/images/I/81D1IjfJC+L._AC_SY695_.jpg", "https://www.amazon.com/dp/B07Y72N47M?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Magnetic Goose Holder", "https://m.media-amazon.com/images/I/619L2DWE4eL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BGN1NGXL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$22.98", 3, 2],
  ["Wild Paw Socks", "https://m.media-amazon.com/images/I/51O-UiNm8+L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07J19MSPY?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Ketchup Pillow", "https://m.media-amazon.com/images/I/811OmZb+GXL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FQR3B91M?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$39.97", 3, 2],
  ["Bigfoot Hat", "https://m.media-amazon.com/images/I/71OG0ZkHwtL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0GCH47KRL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Creepy Human Mask", "https://m.media-amazon.com/images/I/61xVbKGwkHL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0108FTHA0?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.99", 3, 2],
  ["Horror Props", "https://m.media-amazon.com/images/I/51woXesqm1L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07VPTYGSB?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Banana Phone", "https://m.media-amazon.com/images/I/41KiRdhYfiL._AC_SY879_.jpg", "https://www.amazon.com/dp/B0761VVFDX?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$39.99", 3, 2],
  ["Dino Socks", "https://m.media-amazon.com/images/I/61EB1DcmzoL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BK164SFL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Alien Glasses", "https://m.media-amazon.com/images/I/41QCPLWBnlL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B73NMDX2?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Finger Glasses", "https://m.media-amazon.com/images/I/61BGMrkCZNL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00YPFGG3Q?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Alien Sunglasses", "https://m.media-amazon.com/images/I/718yXwKpTuL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07XYJLKHS?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Mosaic Mask", "https://m.media-amazon.com/images/I/41WYE2TOjaL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07HM3SSNH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["LED Light Mask", "https://m.media-amazon.com/images/I/81ioV6rTD4L._AC_SX679_.jpg", "https://www.amazon.com/dp/B09Z6LJFX4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Mullet Socks", "https://m.media-amazon.com/images/I/61QBBUytpFL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07JLSBDPZ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Giant Goose Pillow", "https://m.media-amazon.com/images/I/61dqYq8t6EL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BTPYP8KT?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$25.99", 3, 2],
  ["Cute Chicken Purse", "https://m.media-amazon.com/images/I/5158LDWn88L._AC_SY695_.jpg", "https://www.amazon.com/dp/B09NRHFHK3?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Chicken Calendar", "https://m.media-amazon.com/images/I/71VaP1JA8VL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F9GZ53LQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Otamatone Synthesizer", "https://m.media-amazon.com/images/I/71ezxHSKffL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00MRJ8GXK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$39.99", 3, 2],
  ["Butter Bag", "https://m.media-amazon.com/images/I/719OS45vYjL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FHPCFYJD?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.99", 3, 2],
  ["Foodie Bucket Hat", "https://m.media-amazon.com/images/I/61HAPP6NJUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B09YFYZTH9?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Fake Coffee Cup", "https://m.media-amazon.com/images/I/711xgkPWbjL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0G7JCLT76?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.98", 3, 2],
  ["Broken Glass Decal", "https://m.media-amazon.com/images/I/71HKVdkOA0L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C8HT6V21?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$47.47", 3, 2],
  ["Granny Panties", "https://m.media-amazon.com/images/I/617EZqdl3zL._AC_.jpg", "https://www.amazon.com/dp/B0D2NYNRMC?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Telescopic Fork", "https://m.media-amazon.com/images/I/41qyHPwXdwL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C375LMNF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$6.49", 3, 2],
  ["Ravioli Spoon Rest", "https://m.media-amazon.com/images/I/61wVerQWR8L._AC_SX679_.jpg", "https://www.amazon.com/dp/B00O2YTOFM?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.90", 3, 2],
  ["Retro Sack", "https://m.media-amazon.com/images/I/516MrlX89kL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CYBFTJTM?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["Cheeseburger Backpack", "https://m.media-amazon.com/images/I/71PHoq3egfL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CBJCHBF5?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$25.99", 3, 2],
  ["Murder of Crows", "https://m.media-amazon.com/images/I/61-yogQ3sUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B09TKPHTSV?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.45", 3, 2],
  ["Little Fox Plush", "https://m.media-amazon.com/images/I/51S8-B5qRZL._AC_SX679_.jpg", "https://www.amazon.com/dp/B016F1MNXO?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.55", 3, 2],
  ["Granny Pants Game", "https://m.media-amazon.com/images/I/714e1TlySwL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0G6BL4C9C?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$38.99", 3, 2],
  ["Trump Toilet Paper", "https://m.media-amazon.com/images/I/71y6IZK8r+L._AC_SX679_.jpg", "https://www.amazon.com/dp/B015L3RBQQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["AOC Toilet Paper", "https://m.media-amazon.com/images/I/71dTvI4-1NL._AC_SX679_.jpg", "https://www.amazon.com/dp/B085VJMN93?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.34", 3, 2],
  ["Crap Commander", "https://m.media-amazon.com/images/I/51I4vX8ISVL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07L8SM6F1?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.93", 3, 2],
  ["Sexy Party Glasses", "https://m.media-amazon.com/images/I/51+lG-bJEEL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DB458STR?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Oversized Sunglasses", "https://m.media-amazon.com/images/I/51bFrNmpN7L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DT6RBQ94?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Cryptid Magnet", "https://m.media-amazon.com/images/I/81Gn-3-S13L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CZYJ8Y3B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.95", 3, 2],
  ["Animal Caller", "https://m.media-amazon.com/images/I/711NKq112BL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FP4JMYCC?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Sequin Pillow", "https://m.media-amazon.com/images/I/81hoD5R5gpL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B66V8GMX?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.99", 3, 2],
  ["Danny Devito Pillow", "https://m.media-amazon.com/images/I/81IwvgBxBmL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B66VTLC8?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.99", 3, 2],
  ["Hot Dog Stapler", "https://m.media-amazon.com/images/I/71+3TWLAE8L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BV7FRD43?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$21.00", 3, 2],
  ["Emergency Kit", "https://m.media-amazon.com/images/I/712rheBbv-L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DR59YK7Z?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Inflatable Lion", "https://m.media-amazon.com/images/I/81WBunrdBDL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07SRDPC45?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$18.99", 3, 2],
  ["Frog Costume", "https://m.media-amazon.com/images/I/61ciJbVmifS._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DFY9TYBG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Ghillie Suit", "https://m.media-amazon.com/images/I/91p79fegnoL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07FVDKV5K?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$37.77", 3, 2],
  ["Hairy Swimsuit", "https://m.media-amazon.com/images/I/713qj7tY-6L._AC_SY879_.jpg", "https://www.amazon.com/dp/B0BX9JTPHL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Patriotic Goose", "https://m.media-amazon.com/images/I/71+GHTO9ZAL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FK45Q3QP?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.97", 3, 2],
["Griffin Invasion Rug", "https://m.media-amazon.com/images/I/71iktkwl7sL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0GH2GMKW8?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["World Domination Mat", "https://m.media-amazon.com/images/I/81dyKvC2RGL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0GH8KXMGX?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["Sneaker Plantation", "https://m.media-amazon.com/images/I/618lTMlf0CL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BMVK4RFD?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Tiger Fury Rug", "https://m.media-amazon.com/images/I/810DhJpSxUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DX1YFDZ3?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$49.99", 3, 2],
  ["G.O.A.T. Motivator", "https://m.media-amazon.com/images/I/71r9KqWjMML._AC_SX679_.jpg", "https://www.amazon.com/dp/B0GL62H2ZY?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$24.99", 3, 2],
  ["Cashew Flower Gate", "https://m.media-amazon.com/images/I/71mN4ee8kAL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DK58LTC5?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$25.99", 3, 2],
  ["Wet Grass Attack", "https://m.media-amazon.com/images/I/71PuIM9g07L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DNZ4D1WG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$26.99", 3, 2],
  ["Dream Big Canvas", "https://m.media-amazon.com/images/I/81OVSG-dfhL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F8HPFK2F?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$7.77", 3, 2],
  ["Love Money Bank", "https://m.media-amazon.com/images/I/614CEkNN-yL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C4D2S15Z?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$27.98", 3, 2],
  ["Happy Face Trap", "https://m.media-amazon.com/images/I/81lsp7GNv-L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D49FNYJ7?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$25.49", 3, 2],
  ["Hoops Holder", "https://m.media-amazon.com/images/I/41fhlsEYLTL._AC_.jpg", "https://www.amazon.com/dp/B0CHJXDBP4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$24.49", 3, 2],
  ["Skull Crusher Rug", "https://m.media-amazon.com/images/I/91rAtaTUsYL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DHGTJ756?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$34.99", 3, 2],
  ["Banana Buddy", "https://m.media-amazon.com/images/I/512t1F6UvFL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BH9C3B55?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["Rubber Band Rifle", "https://m.media-amazon.com/images/I/61VlI0Ta5UL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BZ4FW756?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$7.99", 3, 2],
  ["Torch Flame", "https://m.media-amazon.com/images/I/61VdBz3+QvL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CYWPQLD2?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.74", 3, 2],
  ["Gorilla Grip", "https://m.media-amazon.com/images/I/81O8c4ZRwJL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B2DPVBW3?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.88", 3, 2],
  ["Mario Masterpiece", "https://m.media-amazon.com/images/I/71AV0wHyDUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DX3J6MT7?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$58.00", 3, 2],
  ["Chicken Nugget Key", "https://m.media-amazon.com/images/I/61v+EUppuvL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FSXW9XS3?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Duck Squad Key", "https://m.media-amazon.com/images/I/51im+ADqJaL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F4KWKCQH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Fixer Sign", "https://m.media-amazon.com/images/I/61MfgqFO3mL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CZ3ZC8J3?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Floating Bonsai", "https://m.media-amazon.com/images/I/616wQJQ+XvL._AC_SX679_.jpg", "https://www.amazon.com/dp/B088D2QZDB?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$65.99", 3, 2],
  ["Run Buddy Vest", "https://m.media-amazon.com/images/I/81U-03NxnqL._AC_SX679_.jpg", "https://www.amazon.com/dp/B094DTHNHZ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$35.89", 3, 2],
  ["Earsy Face Mask", "https://m.media-amazon.com/images/I/617J0EcCxDL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F6L9WD53?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$7.99", 3, 2],
  ["Pop Rocket Trainer", "https://m.media-amazon.com/images/I/71qxAiLsU8L._AC_SX679_.jpg", "https://www.amazon.com/dp/B075SFCG15?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$30.36", 3, 2],
  ["Candy Crusher", "https://m.media-amazon.com/images/I/71GZ7uylAHL._SX522_.jpg", "https://www.amazon.com/dp/B0GH6JTNTN?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$92.90", 3, 2],
  ["Capsule Reward", "https://m.media-amazon.com/images/I/61tbGy81xyL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DRNPQM6T?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$89.99", 3, 2],
  ["Drum Machine Pro", "https://m.media-amazon.com/images/I/713J+0qiQ1L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0GJFH9V6W?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$329.00", 3, 2],
  ["Wireless Boombox", "https://m.media-amazon.com/images/I/61yma1I8GXL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CVNMYL45?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$629.00", 3, 2],
  ["Pixel Speaker", "https://m.media-amazon.com/images/I/717Wh8lpS2L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FRF3XGQ4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$50.39", 3, 2],
  ["Retro Soundbox", "https://m.media-amazon.com/images/I/61HZ3NmC3dL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0G22NDZ6N?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$59.99", 3, 2],
  ["Wild Sound Ranger", "https://m.media-amazon.com/images/I/61rfuNE-O4L._AC_SX679_.jpg", "https://www.amazon.com/dp/B08NT5K5KG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$89.99", 3, 2],
  ["Pokémon Pack", "https://m.media-amazon.com/images/I/71p-47sRv9L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0829FT44S?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.97", 3, 2],
  ["Cozy Relief Pad", "https://m.media-amazon.com/images/I/81B6SHHMz7L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DS6MHRK7?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$18.99", 3, 2],
  ["Spidey Launcher", "https://m.media-amazon.com/images/I/61yK15RMC+L._AC_SX679_.jpg", "https://www.amazon.com/dp/B09ZNZK6JS?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["Patriot Pack", "https://m.media-amazon.com/images/I/61+06NTJrWL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00W21BJ6E?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Neon Dare Pack", "https://m.media-amazon.com/images/I/61X-GQgXsVL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07MVPRXPY?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$27.95", 3, 2],
  ["Retro Dare Tee", "https://m.media-amazon.com/images/I/41hF6sXSBZL._AC_SX679_.jpg", "https://www.amazon.com/dp/B09JKN1VDW?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Hulkamania Tee", "https://m.media-amazon.com/images/I/81pkCQ+kAvS._AC_SX679_.jpg", "https://www.amazon.com/dp/B07BS3KH1V?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["New World Order Tee", "https://m.media-amazon.com/images/I/81J5OKAfG5L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07FK3WW19?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Glowing Baseball", "https://m.media-amazon.com/images/I/81Cye5psxxL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DK73DSTF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$31.99", 3, 2],
  ["Earzilla Explorer Kit", "https://m.media-amazon.com/images/I/71xbFz5f8pL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00EEZQPHO?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$39.99", 3, 2],
  ["Dunk Wars", "https://m.media-amazon.com/images/I/91Xec5JraWL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D4639MCS?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$14.24", 3, 2],
  ["Banjo Bonanza", "https://m.media-amazon.com/images/I/71aWKoWshYL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DSHZ3LBC?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$159.99", 3, 2],
  ["Duckie Nightlight", "https://m.media-amazon.com/images/I/61PAm1AriwL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CMPFV8DQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$25.99", 3, 2],
  ["Foam Fury Gun", "https://m.media-amazon.com/images/I/618iKU3XjmL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CVW2LZ34?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$39.99", 3, 2],
  ["Turtle Throne", "https://m.media-amazon.com/images/I/61AGD+E6wyL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0C88VP3CL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$34.28", 3, 2],
  ["Dartzilla Frenzy", "https://m.media-amazon.com/images/I/8156CWC9S8L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0BS4CDB59?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$49.99", 3, 2],
  ["Rockstar", "https://m.media-amazon.com/images/I/610hzLF-G8L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07KN9FK4B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["NoPhone Life", "https://m.media-amazon.com/images/I/614r61MyCWL._AC_SX679_.jpg", "https://www.amazon.com/dp/B01NCF4TDT?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$39.99", 3, 2],
  ["Lube Tank", "https://m.media-amazon.com/images/I/71Dyx6XZpPL._AC_SX679_.jpg", "https://www.amazon.com/dp/B005MR3IVO?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$212.24", 3, 2],
  ["Space Burger", "https://m.media-amazon.com/images/I/71ruCmpjhQL._SX679_.jpg", "https://www.amazon.com/dp/B09HSHFW8B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$468", 3, 2],
  ["Judgy Maps", "https://m.media-amazon.com/images/I/8148u4S2rVL._SY522_.jpg", "https://www.amazon.com/dp/1250068541?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$17.36", 3, 2],
  ["Safehouse Wallet", "https://m.media-amazon.com/images/I/61gx+NSomhL._AC_SX679_.jpg", "https://www.amazon.com/dp/B006C8TPNM?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$8.99", 3, 2],
  ["Pterodactyl Alphabet", "https://m.media-amazon.com/images/I/81O9EWOoFPL._SY522_.jpg", "https://www.amazon.com/dp/1492674311?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Frozen Smoke Jar", "https://m.media-amazon.com/images/I/61aShAJsUWL._AC_SX679_.jpg", "https://www.amazon.com/dp/B01CTB0EMG?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$29.99", 3, 2],
  ["Cluckin' Arms", "https://m.media-amazon.com/images/I/710krDjVchL._AC_SX679_.jpg", "https://www.amazon.com/dp/B08KH2GGSR?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.95", 3, 2],
  ["Prism Readers", "https://m.media-amazon.com/images/I/51DYRIbFRTL._AC_SX679_.jpg", "https://www.amazon.com/dp/B01MXF4QXP?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$21.59", 3, 2],
  ["Licki Cat Brush", "https://m.media-amazon.com/images/I/71gVrT4Y-mL._AC_SY879_.jpg", "https://www.amazon.com/dp/B01M0UXYHE?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$11.98", 3, 2],
  ["Snowflake Hat", "https://m.media-amazon.com/images/I/71y8eakMZuL._AC_SX679_.jpg", "https://www.amazon.com/dp/B081YGDKQP?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$26.99", 3, 2],
  ["Fish Feet Slippers", "https://m.media-amazon.com/images/I/615KGUaZ39L._AC_SY695_.jpg", "https://www.amazon.com/dp/B0CSP6QH3X?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Whisker Whirlwind", "https://m.media-amazon.com/images/I/71sf0YLNHDL._AC_SX679_.jpg", "https://www.amazon.com/dp/B003VVJBQO?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$24.98", 3, 2],
  ["Flip Camo Flops", "https://m.media-amazon.com/images/I/81zuNcSwFwL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00JLWHVEQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$28.95", 3, 2],
  ["Spider Hatch", "https://m.media-amazon.com/images/I/81XOV2sUMEL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07VZ2HB6P?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Pussy Pencil Party", "https://m.media-amazon.com/images/I/91CFZUcr+eL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07HYZM9S4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.95", 3, 2],
  ["Mini Maestro", "https://m.media-amazon.com/images/I/61TDXULS3aS._AC_SX679_.jpg", "https://www.amazon.com/dp/B0963RKZP9?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Inflatable Moo Cow", "https://m.media-amazon.com/images/I/61Wd8kV5RCL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07RN8ZRSZ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.95", 3, 2],
  ["Booty Lift", "https://m.media-amazon.com/images/I/51OSa469XUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F3CC9N5N?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$26.39", 3, 2],
  ["Corgi Rides Dino", "https://m.media-amazon.com/images/I/71Y3XlalCVL._AC_SX679_.jpg", "https://www.amazon.com/dp/B075ZK2JZN?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$16.99", 3, 2],
  ["Mini Fridge", "https://m.media-amazon.com/images/I/510g-cwJNBL._AC_.jpg", "https://www.amazon.com/dp/B00KE7FM3O?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$42.11", 3, 2],
  ["Butt Buddy Pillow", "https://m.media-amazon.com/images/I/51X9kU+3wQL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07MDL64GD?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$35.99", 3, 2],
  ["Pasta Party Singer", "https://m.media-amazon.com/images/I/71i3s-FEH3L._AC_SY879_.jpg", "https://www.amazon.com/dp/B00PFZL59K?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$24.99", 3, 2],
  ["Lester's Wild Sodas", "https://m.media-amazon.com/images/I/71J8cee4XfL._SX679_PIbundle-6,TopRight,0,0_SX679SY815SH20_.jpg", "https://www.amazon.com/dp/B01M5DJ6PZ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$813", 3, 2],
  ["Snail Face Mask", "https://m.media-amazon.com/images/I/71vChlqb-HL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07C4LPPHB?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Snake in a Can", "https://m.media-amazon.com/images/I/71DawbUDc4L._SY879_.jpg", "https://www.amazon.com/dp/B01BLR13G0?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$999", 3, 2],
  ["Dog Dryer Deluxe", "https://m.media-amazon.com/images/I/81QvkTYKoIL._AC_SX679_.jpg", "https://www.amazon.com/dp/B00JEG3FYE?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$19.99", 3, 2],
  ["Beefy Bath Soak", "https://m.media-amazon.com/images/I/71SL-qxdiUL._AC_SX679_.jpg", "https://www.amazon.com/dp/B075CWYXRH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$22.99", 3, 2],
  ["Screaming Goat Show", "https://m.media-amazon.com/images/I/71TCi2fUmFL._SX679_.jpg", "https://www.amazon.com/dp/0762459816?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Shower Tablet Holder", "https://m.media-amazon.com/images/I/81PU53+TFhL._SX522_.jpg", "https://www.amazon.com/dp/B075HG56QH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$10.98", 3, 2],
  ["Hot Dog Toaster", "https://m.media-amazon.com/images/I/71pJg-m2RlL._AC_SX679_.jpg", "https://www.amazon.com/dp/B005Q8X6IO?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$32.99", 3, 2],
  ["Clucking Chicken Bag", "https://m.media-amazon.com/images/I/61eiIozbjeL._AC_SY695_.jpg", "https://www.amazon.com/dp/B001G8N95I?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$27.99", 3, 2],
  ["Stranger Search Party", "https://m.media-amazon.com/images/I/81QrT5q732L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07RYBM9BV?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$9.99", 3, 2],
  ["Cat Butt Holder", "https://m.media-amazon.com/images/I/619Lme7ghEL._AC_SX679_.jpg", "https://www.amazon.com/dp/B018MPT3PW?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$5.59", 3, 2],
  ["Cage Celebrity Candle", "https://m.media-amazon.com/images/I/61NMPgSTMPL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07BTDJHLJ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$15.95", 3, 2],
  ["Skeleton Snuggle", "https://m.media-amazon.com/images/I/71GxkXX7hBL._AC_SX679_.jpg", "https://www.amazon.com/dp/B091YJ25XN?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$49.99", 3, 2],
  ["Banana Bandit", "https://m.media-amazon.com/images/I/81GFFLiZOCL._AC_SX679_.jpg", "https://www.amazon.com/dp/B08CPSCLSW?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$28.99", 3, 2],
  ["Pizza Night Light", "https://m.media-amazon.com/images/I/61AEmcKP8rL._AC_SX679_.jpg", "https://www.amazon.com/dp/B01BPN7VU2?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Snail Soap Saver", "https://m.media-amazon.com/images/I/61Cz59i3MVL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07MB1SH1G?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£19.57", 3, 2],
  ["Dustache Deluxe", "https://m.media-amazon.com/images/I/51dOsYrHpIL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg", "https://www.amazon.com/dp/B0957ZYBLF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£13.17", 3, 2],
  ["Flame Desk Dump", "https://m.media-amazon.com/images/I/619i-ksMRlL._AC_SX679_.jpg", "https://www.amazon.com/dp/B08VN8VTQQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£16.30", 3, 2],
  ["Can Crusher King", "https://m.media-amazon.com/images/I/71JfpKkjIsL._AC_SX679_.jpg", "https://www.amazon.com/dp/B09MM224B4?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£10.49", 3, 2],
  ["Fan Girl Power", "https://m.media-amazon.com/images/I/61j1KdNT8HL._AC_SY879_.jpg", "https://www.amazon.com/dp/B07QK9C9KT?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$17.99", 3, 2],
  ["Key Master Tool", "https://m.media-amazon.com/images/I/71rZAYEi0nL._AC_SX679_.jpg", "https://www.amazon.com/dp/B07T5JZD9H?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£25.85", 3, 2],
  ["Clock Flipper", "https://m.media-amazon.com/images/I/61ShOGXCwnL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DB4W675B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£44.48", 3, 2],
  ["Guitar Hero Holder", "https://m.media-amazon.com/images/I/71GKz5VIJaL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0B3N4FHHL?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£10.99", 3, 2],
  ["Money Stool", "https://m.media-amazon.com/images/I/81tRe24B7-L._AC_SY879_.jpg", "https://www.amazon.com/dp/B00XM09APQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£108.86", 3, 2],
  ["Pixel Puzzle Clock", "https://m.media-amazon.com/images/I/51PaVlLSppL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0D9XS6F1Y?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£52.99", 3, 2],
  ["Chiller Buddy", "https://m.media-amazon.com/images/I/A12KVD3PYoL._AC_SX679_.jpg", "https://www.amazon.com/dp/B08YJ26Q4B?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$21.24", 3, 2],
  ["Dirty Dish Sign", "https://m.media-amazon.com/images/I/717X9Jo7+GL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CRHVH7NF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$699", 3, 2],
  ["Viewfinder Frenzy", "https://m.media-amazon.com/images/I/71l5ziDzj9L._AC_SX679_.jpg", "https://www.amazon.com/dp/B07W4Y78S5?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$34.95", 3, 2],
  ["Selfie Screen Pro", "https://m.media-amazon.com/images/I/616WYIxDDOL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FMK53WVV?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$49.99", 3, 2],
  ["Mini Movie Maker", "https://m.media-amazon.com/images/I/51d4Esi79-L._AC_SY879_.jpg", "https://www.amazon.com/dp/B0CG19FGQ5?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$84.13", 3, 2],
  ["Flip Cam Pro", "https://m.media-amazon.com/images/I/818MP2K8OAL._AC_SX679_.jpg", "https://www.amazon.com/gp/aw/d/B0F993NLS1/?_encoding=UTF8&pd_rd_plhdr=t&aaxitk=34705c39e7dc952673365c04bf7b05b8&hsa_cr_id=0&qid=1776162206&sr=1-1-f02f01d6-adaf-4bef-9a7c-29308eff9043&ref_=sbx__sbtcd2_asin_0_img&pd_rd_w=lPrlF&content-id=amzn1.sym.d3360101-5266-4e0e-8e4a-de7eb0be6ed9%3Aamzn1.sym.d3360101-5266-4e0e-8e4a-de7eb0be6ed9&pf_rd_p=d3360101-5266-4e0e-8e4a-de7eb0be6ed9&pf_rd_r=ZBSE1ZBW05SHBDJXSC8Q&pd_rd_wg=1x30g&pd_rd_r=cfb52d23-ee9b-4409-a28e-1e633f486d05&th=1", "$49.99", 3, 2],
  ["Mathewson Mint", "https://m.media-amazon.com/images/I/8195hUXQTFL._AC_SY879_.jpg", "https://www.amazon.com/dp/B081D5NWNJ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$419.00", 3, 2],
  ["Money Master", "https://m.media-amazon.com/images/I/81xCbBqQeCL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CWNCXQCT?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$284.95", 3, 2],
  ["Bidet Throne", "https://m.media-amazon.com/images/I/71nj2qsMpuL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0F7XKGNRR?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$1,299.99", 3, 2],
  ["London Gold", "https://m.media-amazon.com/images/I/71f69YHCY9L._AC_SY879_.jpg", "https://www.amazon.com/dp/B07HCLTBRF?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$180,600.00", 3, 2],
  ["Diamond Halo", "https://m.media-amazon.com/images/I/317D+rTrxcL._AC_.jpg", "https://www.amazon.com/dp/B0083VPML0?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Red Revival", "https://m.media-amazon.com/images/I/61TWnRe8YyL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0CGC8HB5P?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$419.00", 3, 2],
  ["Golden Angel", "https://m.media-amazon.com/images/I/71adB5mV7OL._AC_SY695_.jpg", "https://www.amazon.com/dp/B0GNNYC1BD?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$81.91", 3, 2],
  ["Heat Vision", "https://m.media-amazon.com/images/I/61qeUtRhQGL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0DDPZ8QQK?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£459.00", 3, 2],
  ["Night Stalker", "https://m.media-amazon.com/images/I/71jHnmIhPsL._AC_SX679_.jpg", "https://www.amazon.com/dp/B0FJ8F9G31?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£139.99", 3, 2],
  ["Tough Cuffs", "https://m.media-amazon.com/images/I/71OZHNdsZdL._SX522_.jpg", "https://www.amazon.com/dp/B0GFXNDWGH?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "£64.99", 3, 2],
  ["Map Fail", "https://m.media-amazon.com/images/I/61PtryK3osL._SY522_.jpg", "https://www.amazon.com/dp/0008641595?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$13.40", 3, 2],
  ["Knife Guard", "https://m.media-amazon.com/images/I/81Zfq92Tk8L._AC_SX679_.jpg", "https://www.amazon.com/dp/B0963SBR1K?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$12.99", 3, 2],
  ["Steel Gauntlets", "https://m.media-amazon.com/images/I/71N8PLWJLRL._AC_SY879_.jpg", "https://www.amazon.com/dp/B0BNHR9JXX?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "", 3, 2],
  ["Templar Helmet", "https://m.media-amazon.com/images/I/61h-jmm7ioL._AC_SY879_.jpg", "https://www.amazon.com/dp/B07DHHS7P9?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$59.99", 3, 2],
  ["Knight Armor", "https://m.media-amazon.com/images/I/51hU+YFvvmL._AC_SX679_.jpg", "https://www.amazon.com/dp/B01CCE50AQ?tag=solvedstuff-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", "$69.00", 3, 2],
["", "/products/01521e1111bef0dd1eb1cb949577c922.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/0391465a22566d34f587a9570ddac447.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/057dc6f490ceb64825b55790515c09f7.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/059ae36d01353b1863987f648bbc6882.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/05a73dea9969c6be88d0686a5846a129.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/068607f2d436498bf20c9089f6f01eb0.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/075941e6b022706e31ea736d163211c8.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/092a523bd2a13743fcbfb52678c29bb3.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/0a11fa9a426874a36ecc7b658ca5ce88.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/0a94e67297275790457c85054b664602.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/0c67fa58f8713044974e2599242cb354.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/0ea810ade3210aeb275228c5d98e2c48.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/1019885e60f0932a0dc83649eb3f7d8f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/1088a9df501a66ec0359927d33551383.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/10ff86acff6e89a9a8bceebae872be19.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/11147f74df5ec3b7e88e8290458c7cd5.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/12e1159ae6bedd88443ec18352c86eb0.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/146ac38ef0167f8a0f343acf7dcb1736.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/157e9c7b3030081e43d9a5f28c856612.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/19f1fdaa71b8fe6f5e33e5913dc2670f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/1a8bd6be6e8063b92bbb5fbf51560773.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/1befd95b68cb42f2d36c049fc61e8ce6.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/1e60aae454efd3a69a58bdf0f1c3e9a6.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/1f87e195c2ccadc0a4644e0166c2c010.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/245a7caffc0e4861e73281d26ca58dfe.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/29f16a9ec0ff93f6c9096605a3b015b3.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/2bd2ba847d1b8d1db903eb0f6060163e.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/2f379844b4010a8e38ac325254096bd7.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/344178e354c5a2b963e68e9f9a1ad588.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/36c774821a403faff9bc21eb5f666f6d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/36d0bf4666b70a7afb8ba64630808740.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/38a0eb940b87210749916cc3c08b7a33.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/3be9b63f4cae7bd216e90372e34a6c4a.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/3c7066df18b731c6cd7bbaa99b73415e.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/3f14d40086a3bb8bd4d00cee4bab3d36.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/3f8c1854f23ca4739c9275053ce86b12.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/40e1994b7b29e5562f9ba2efacef795f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/441cc0862b3a99e4a7981a6cabfbe873.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/4445286742d3da66cdbcf814f812b7f0.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/48e95094dcb5606bc72cd9635b5b55fd.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/49a89dcf18ebd827b13c3709ba6b045c.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/52a265dfb3575c919f508e4f2eeeb793.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/53b549c2d35f869c7a6c91275a11ba45.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/54f8d96ca1af8b17bc39de173ef7ceea.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/5748abe84fb2d78170971d7c874f09d2.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/57b78d17d24d3904bfb36dc82fe7e816.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/5a191510f4648fbc11fa9490064f6477.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/5c31d1486e90e5a7c3df92d066b7614d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/5f04090e58f5f1f488796a984bfa36b6.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/5f2b6d1d67f6206182873cba7d193d3c.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/600bb956ca57215c562655a11087c9cb.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/62eee3eda2a783b944620a0ef047ccb1.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/633c685ac34fe48f45f7475801443445.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/64da7676cb2de00b43a5343d08b55f12.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/651950e9a793ef7238bb62a685d5d5be.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/6635ca9d3f28914c60f5e2c2d981a01f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/69a6485eb3c9988b7372c8fd4fc2fb65.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/6d9da337355bd1f1fcef24ec6f7fc970.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/6df73ab7cd12cb8c40dca0729b258880.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/6f378fbd933fdf5673c3ec1a40e739a7.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/6faccc84fcb4edfb920a8ebce3d83521.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/7372cf9000bc2913c7e6ee96fe0ad0f1.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/76efdac78f76f408cd1248e246eb5646.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/773d6d8caef5f424b4e7b504977a130f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/775b6520cd72aa874b789f9d96ca6e9f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/77b77c7b1e2bf0a15b9dfcafe88aff7e.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/7a37ca4ee942d0f80c2780c59b5fc149.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/7a6b57053f1fd484a43c71f778c89def.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/7bdec3cadb0b2b981dd2152812cd8e67.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/7c24c69b53adca58c8e242d882b82498.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/7d887621c80e97bb006c5027b9b09c32.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/82b10d630759516f1c9fe108acc77f6b.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8549f264930828b8ec94ae790a012cd0.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8579e410b390fffb83620e862d3ef864.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8af805bbb4b9c0f741a15413a603dbb4.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8b0a5dd1f327043657b7b60ff15703f4.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8c3347c7c808e50f76b5ff4e3d353088.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8c6ed5f95473fecf7641049e2cab8ab8.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8c9ebfa571566aef963f6b03059c3ab4.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8d7e112eed242f3e0aae58d5c4a23936.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/8df7245126dcf8be384eb3b5ed4ae82a.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/91e80c32ae054f6be042a5ede9eaf8ab.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/925117dc66e82d0fd3c420a858456708.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/98029730e89837cab24eba0a9ab03168.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/98d88b51c27d79edac3261efcec15d5d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/9a29c79e620fea74fccffa5951be6911.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/9a7b6cd6a711b0b5a68e9dd50ff3940c.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/9ee1fd520507e292d4d162d86dbf65e0.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/9f50fca68d7f08abe59228edd866f762.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/Cool cat.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/a385c6d8dc74c61c09a2f46dab964392.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/a3991327d589611e383cf8eb8a9f692f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/a3be1e0880576ef02274ec01c202afdb.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/a8eb1f4fcb14a492a4a982e61b00db65.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/a8f08285fe888b765d86bdd7564019f1.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/aac5a131272aba11ec4ac34ff5624027.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ad839ee01d09d9a8e9208defc45033c2.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ae17bb524735988cebffd8087a8c3811.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ae5e6eb9bd2398d7a0a372064ed3c1b6.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ae72b3475e2371773b3c5d291abac8b3.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ae7d7cec7b1e6ec15fb4a3f740b7ac79.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/aea73f1e3258f0e1422a108cd363c1ca.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/aebc0b925c5708f6fa3b5dffca4cb9bf.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/b03bf9f466b1140b67f9f4f1f1219d17.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/b1387dbf356d3af7f96241ebe904f502.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/b13e3f2ac12af4f79a2d345ec4dbc4cb.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/b279b4d886324e89a8d3db025fb34e84.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/b498707b18091dab6d7a4a9ab2c22e76.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/b8673efd0450c33955075a05715705a5.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/banana car.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/bedd83f0a0d8412b7f30148baacc11c0.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/bf2f1ff783c6306384506d7e2b1a2c4d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/c3fad2969110db3e5954dd4c9663f6ac.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/c61cca2fa4e86a56f30913f3d996aa82.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/c6b244bc5a5734e0364a7a0143f9fba7.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/c753a3b564521af7facef848835e5615.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/c9ffd669226bf600f479e0537a5f7732.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ccc285f6fdfe343fa224c16657665100.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d0b2b6ee5f3d4e425c70b5428dc46c0f.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d10cfca5e86cb1ca1756a42d5d429496.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d1da9df769db11cf1684792fadf10020.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d1e1502a0730c2b3fe68257a47eb9fc9.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d3501f8c666983da947baee77b9ae5b4.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d5bde0d1c1c736d135c076f3ae6befbf.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d741ae46b90bd163aa1017a5d2eac863.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/d7f692af31f5ffc2513368ec5d2f3398.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/da13f0c0139aa512d984d95985e3dc03.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/dc00531dc25f0d14c1abbeb1b7c3e970.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/dc34878a56a6ecf842796290a2b58696.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/dd4710f6e89cb7d34574c488fb058737.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ddee95e55ea50b910177d727a54b1e17.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/df7010f85ddd29664791ba3cdeda7c78.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/e06602159c0c97badc83a5336704f4eb.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/e21ef3c24e5845c3b07763df05fab5fb.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/e3ffa9c738b2cd18605743ca7d175d3b.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/e44d224f7aedb571ae1fab1a77da5ac3.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/e5c98b87b0cf8ec68f0883eb8dfb0d9d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ec6592b3ce4662c8f4a868af79c76c89.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ed2908c64760010821d4773ad5b62709.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/ed7d44e4678432d1c6bda720fabe7e6b.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f0339dbf2eb479c0bc50b9019a9cf001.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f16cc7ec7235a12a99bf92505040bfdb.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f3a904984530898798ff8113092ff5f9.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f3be74678425d2ee96b5e0924fe07c75.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f74101407f64594129bcb0b18b823f78.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f7af3b7bfbca40555ffe6402d42de3c6.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/f99c8356c40be3841518423e0059f10d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/fa513a093e003ac3fd4f6c5042975971.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/fa6ec593fd1c643c65cdb092fa43eb8d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/fb190beb553cf9290c47d75cda93fbea.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/house on island.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/shoe car.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/shrek.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/updside down house.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/4afd98e5620847111bae2279d801fb8b.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/F5IuUo4_d.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HF0bOQSasAE9TVm.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HF1JPREasAMftNc.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HFLIt06aQAAPft2.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HFQ1zlIbkAA9giB.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HFQyXOFbcAEMjUk.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HFRbZHZasAAbBXr.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HFVDFL6aEAAYbMu.webp", "https://amzn.to/4cImG3j", "", 3, 2],
  ["", "/products/HFWQH6oWMAA-wBZ.webp", "https://amzn.to/4cImG3j", "", 3, 2],
];

export interface Product {
  id: number;
  title: string;
  image_url: string;
  affiliate_url: string;
  price: string;
  category: string;
  cool_votes: number;
  trash_votes: number;
  created_at: string;
}

export async function initDb() {
  if (initialized) return;
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      affiliate_url TEXT NOT NULL,
      price TEXT DEFAULT '',
      category TEXT DEFAULT 'funny',
      cool_votes INTEGER DEFAULT 0,
      trash_votes INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      list TEXT NOT NULL DEFAULT 'cool',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(email, list)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      event TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const count = await sql`SELECT COUNT(*) as c FROM products`;
  if (Number(count[0].c) === 0) {
    for (const [title, imageUrl, affiliateUrl, price, cool, trash] of SEED_DATA) {
      await sql`INSERT INTO products (title, image_url, affiliate_url, price, cool_votes, trash_votes) VALUES (${title}, ${imageUrl}, ${affiliateUrl}, ${price}, ${cool}, ${trash})`;
    }
  }
  initialized = true;
}

export async function getRandomBatch(excludeIds: number[], count: number): Promise<Product[]> {
  const sql = getDb();
  // 70% images (no title), 30% products (with title)
  const imageCount = Math.round(count * 0.7);
  const productCount = count - imageCount;

  const ex = excludeIds.length > 0 ? excludeIds : [0];

  const images = await sql`SELECT * FROM products WHERE id != ALL(${ex}) AND title = '' ORDER BY RANDOM() LIMIT ${imageCount}`;
  const products = await sql`SELECT * FROM products WHERE id != ALL(${ex}) AND title != '' ORDER BY RANDOM() LIMIT ${productCount}`;

  // Combine and shuffle
  const combined = [...(images as unknown as Product[]), ...(products as unknown as Product[])];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  // If either pool ran out, we still return what we got
  if (combined.length === 0) {
    const fallback = await sql`SELECT * FROM products WHERE id != ALL(${ex}) ORDER BY RANDOM() LIMIT ${count}`;
    return fallback as unknown as Product[];
  }

  return combined;
}

export async function vote(id: number, isCool: boolean): Promise<Product | null> {
  const sql = getDb();
  if (isCool) {
    await sql`UPDATE products SET cool_votes = cool_votes + 1 WHERE id = ${id}`;
  } else {
    await sql`UPDATE products SET trash_votes = trash_votes + 1 WHERE id = ${id}`;
  }
  const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
  return (rows[0] as unknown as Product) || null;
}

export async function getStuffList(): Promise<(Product & { cool_pct: number })[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT *,
      CASE WHEN (cool_votes + trash_votes) > 0
        THEN ROUND(cool_votes * 100.0 / (cool_votes + trash_votes))
        ELSE 0
      END as cool_pct
    FROM products
    WHERE (cool_votes + trash_votes) > 0
    ORDER BY cool_pct DESC, (cool_votes + trash_votes) DESC
  `;
  return rows as unknown as (Product & { cool_pct: number })[];
}

export async function saveEmail(email: string, list: string = "cool"): Promise<boolean> {
  const sql = getDb();
  try {
    await sql`INSERT INTO emails (email, list) VALUES (${email}, ${list}) ON CONFLICT (email, list) DO NOTHING`;
    return true;
  } catch {
    return false;
  }
}

export async function trackEvent(event: string): Promise<void> {
  const sql = getDb();
  await sql`INSERT INTO events (event) VALUES (${event})`;
}

export async function getAdminStats() {
  const sql = getDb();

  const emails = await sql`SELECT id, email, list, created_at FROM emails ORDER BY created_at DESC`;

  const totalVotes = await sql`SELECT SUM(cool_votes + trash_votes) as total FROM products`;

  const totalProducts = await sql`SELECT COUNT(*) as count FROM products`;

  const todayHits = await sql`
    SELECT COUNT(*) as count FROM events
    WHERE event = 'page_view' AND created_at >= CURRENT_DATE
  `;
  const totalHits = await sql`
    SELECT COUNT(*) as count FROM events WHERE event = 'page_view'
  `;

  const todayBuyClicks = await sql`
    SELECT COUNT(*) as count FROM events
    WHERE event = 'buy_click' AND created_at >= CURRENT_DATE
  `;
  const totalBuyClicks = await sql`
    SELECT COUNT(*) as count FROM events WHERE event = 'buy_click'
  `;

  const totalVideos = await sql`
    SELECT COUNT(*) as count FROM events WHERE event = 'video_made'
  `;
  const todayVideos = await sql`
    SELECT COUNT(*) as count FROM events
    WHERE event = 'video_made' AND created_at >= CURRENT_DATE
  `;

  const dailyHits = await sql`
    SELECT DATE(created_at) as day, COUNT(*) as count
    FROM events WHERE event = 'page_view'
    GROUP BY DATE(created_at)
    ORDER BY day DESC
    LIMIT 30
  `;

  const dailyBuyClicks = await sql`
    SELECT DATE(created_at) as day, COUNT(*) as count
    FROM events WHERE event = 'buy_click'
    GROUP BY DATE(created_at)
    ORDER BY day DESC
    LIMIT 30
  `;

  const topCool = await sql`
    SELECT title, cool_votes, trash_votes,
      CASE WHEN (cool_votes + trash_votes) > 0
        THEN ROUND(cool_votes * 100.0 / (cool_votes + trash_votes))
        ELSE 0
      END as cool_pct
    FROM products
    WHERE (cool_votes + trash_votes) >= 3
    ORDER BY cool_pct DESC
    LIMIT 5
  `;

  const topTrash = await sql`
    SELECT title, cool_votes, trash_votes,
      CASE WHEN (cool_votes + trash_votes) > 0
        THEN ROUND(cool_votes * 100.0 / (cool_votes + trash_votes))
        ELSE 0
      END as cool_pct
    FROM products
    WHERE (cool_votes + trash_votes) >= 3
    ORDER BY cool_pct ASC
    LIMIT 5
  `;

  return {
    emails: emails as unknown as { id: number; email: string; list: string; created_at: string }[],
    totalVotes: Number(totalVotes[0]?.total || 0),
    totalProducts: Number(totalProducts[0]?.count || 0),
    todayHits: Number(todayHits[0]?.count || 0),
    totalHits: Number(totalHits[0]?.count || 0),
    todayBuyClicks: Number(todayBuyClicks[0]?.count || 0),
    totalBuyClicks: Number(totalBuyClicks[0]?.count || 0),
    totalVideos: Number(totalVideos[0]?.count || 0),
    todayVideos: Number(todayVideos[0]?.count || 0),
    dailyHits: dailyHits as unknown as { day: string; count: number }[],
    dailyBuyClicks: dailyBuyClicks as unknown as { day: string; count: number }[],
    topCool: topCool as unknown as { title: string; cool_votes: number; trash_votes: number; cool_pct: number }[],
    topTrash: topTrash as unknown as { title: string; cool_votes: number; trash_votes: number; cool_pct: number }[],
  };
}
