// --- INTERFACES & TYPES ---
interface Variant {
  id: number;
  name: string;
  price?: number;
  salePrice?: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  description: string;
  image?: string; // Base64 string
  variants: Variant[];
}

interface Promotion {
    isActive: boolean;
    headline: string;
    description: string;
    endDate: string;
    primaryOffer: {
        text: string;
        discountPercent: number;
        category: string;
    }
}

// --- DATABASE SERVICE (localStorage wrapper) ---
const DB = {
    init: () => {
        if (!localStorage.getItem('sparkxProducts')) {
            localStorage.setItem('sparkxProducts', JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem('sparkxPromotionConfig')) {
            localStorage.setItem('sparkxPromotionConfig', JSON.stringify(DEFAULT_PROMOTION));
        }
        if (!localStorage.getItem('sparkxOrders')) {
            localStorage.setItem('sparkxOrders', JSON.stringify([]));
        }
        if (!localStorage.getItem('sparkxOrdCounter')) {
            localStorage.setItem('sparkxOrdCounter', '1000');
        }
        if (!localStorage.getItem('productRatings')) {
            localStorage.setItem('productRatings', JSON.stringify({}));
        }
        if (!localStorage.getItem('sparkxCompareList')) {
            localStorage.setItem('sparkxCompareList', JSON.stringify([]));
        }
    },
    getProducts: (): Product[] => JSON.parse(localStorage.getItem('sparkxProducts') || '[]'),
    saveProducts: (products: Product[]) => localStorage.setItem('sparkxProducts', JSON.stringify(products)),
    getPromotion: (): Promotion => JSON.parse(localStorage.getItem('sparkxPromotionConfig')!),
    savePromotion: (promo: Promotion) => localStorage.setItem('sparkxPromotionConfig', JSON.stringify(promo)),
    getOrders: () => JSON.parse(localStorage.getItem('sparkxOrders') || '[]'),
    saveOrders: (orders: any[]) => localStorage.setItem('sparkxOrders', JSON.stringify(orders)),
    getRatings: () => JSON.parse(localStorage.getItem('productRatings') || '{}'),
    saveRatings: (ratings: any) => localStorage.setItem('productRatings', JSON.stringify(ratings)),
    getCompareList: (): number[] => JSON.parse(localStorage.getItem('sparkxCompareList') || '[]'),
    saveCompareList: (list: number[]) => localStorage.setItem('sparkxCompareList', JSON.stringify(list)),
};


// --- INITIAL DATABASE STATE ---
const DEFAULT_PRODUCTS: Product[] = [
    { id: 1, name: "Aura High-Speed Ceiling Fan", category: "Fan", price: 1199, description: "A high-performance ceiling fan for maximum airflow.", image: "https://images.pexels.com/photos/8581005/pexels-photo-8581005.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 2, name: "Breeze Portable Table Fan", category: "Fan", price: 799, description: "Compact and powerful fan, perfect for personal cooling.", image: "https://images.pexels.com/photos/7772633/pexels-photo-7772633.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 3, name: "Frost Personal Air Cooler", category: "Cooler", price: 3499, description: "Efficient air cooler with honeycomb pads for quick cooling.", image: "https://images.pexels.com/photos/8472911/pexels-photo-8472911.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 4, name: "Lumina 9W LED Bulb (Pack of 4)", category: "Lighting", price: 299, description: "Energy-saving bright white LED bulbs for your home.", image: "https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 5, name: "FlexiCore 1.5mm Copper Wire (90m)", category: "Wiring", price: 1299, description: "High-quality, insulated copper wire for safe electrical wiring.", image: "https://images.pexels.com/photos/8346033/pexels-photo-8346033.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 6, name: "VoltCheck Digital Multimeter", category: "Tools", price: 499, description: "A must-have tool for any electronics enthusiast or professional.", image: "https://images.pexels.com/photos/5638153/pexels-photo-5638153.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    // --- 101 NEW PRODUCTS START HERE ---
    { id: 101, name: "Aero Series Ceiling Fan", category: "Fan", price: 2499, description: "Aerodynamic blades for silent operation and superior air delivery.", image: "https://images.pexels.com/photos/16694189/pexels-photo-16694189/free-photo-of-white-ceiling-fan-in-the-room.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 102, name: "CoolWave Desert Air Cooler", category: "Cooler", price: 8999, description: "Large capacity desert cooler for large spaces, with powerful air throw.", image: "https://images.pexels.com/photos/713297/pexels-photo-713297.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 103, name: "GlowTube 20W LED Batten", category: "Lighting", price: 450, description: "Sleek and bright LED batten light, perfect for kitchens and offices.", image: "https://images.pexels.com/photos/1125280/pexels-photo-1125280.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 104, name: "SafeGuard 4-Way Power Strip", category: "Wiring", price: 599, description: "Surge-protected power strip with 4 universal sockets and a long cord.", image: "https://images.pexels.com/photos/4012581/pexels-photo-4012581.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 105, name: "Cyclone Pedestal Fan", category: "Fan", price: 1999, description: "High-speed pedestal fan with adjustable height and oscillation.", image: "https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 106, name: "AquaChill Tower Cooler", category: "Cooler", price: 6499, description: "Slim and stylish tower cooler with remote control and ice chamber.", image: "https://images.pexels.com/photos/8992923/pexels-photo-8992923.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 107, name: "Sparkle Decorative LED String Lights", category: "Lighting", price: 399, description: "10-meter warm white LED string lights for festive decoration.", image: "https://images.pexels.com/photos/3227984/pexels-photo-3227984.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 108, name: "DuraFlex 2.5mm Copper Wire (90m)", category: "Wiring", price: 1899, description: "Heavy-duty insulated copper wire for high-load applications.", image: "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 109, name: "Ventil-8 Exhaust Fan", category: "Fan", price: 999, description: "High-velocity exhaust fan for kitchens and bathrooms.", image: "https://images.pexels.com/photos/8354524/pexels-photo-8354524.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 110, name: "Pro-Grip Soldering Iron Kit", category: "Tools", price: 750, description: "25W soldering iron kit with stand, flux, and solder wire.", image: "https://images.pexels.com/photos/6157053/pexels-photo-6157053.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 111, name: "Radiant Panel LED Light", category: "Lighting", price: 1299, description: "2x2 ceiling-mounted LED panel light for uniform, glare-free lighting.", image: "https://images.pexels.com/photos/6625923/pexels-photo-6625923.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 112, name: "Modular Anchor Switch (Single)", category: "Wiring", price: 89, description: "Elegant and durable single modular switch for modern homes.", image: "https://images.pexels.com/photos/1797436/pexels-photo-1797436.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 113, name: "Mini-Breeze USB Desk Fan", category: "Fan", price: 499, description: "Quiet and portable USB-powered fan for your workspace.", image: "https://images.pexels.com/photos/403565/pexels-photo-403565.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 114, name: "ArcticBlast Window AC (1.5 Ton)", category: "Cooler", price: 28999, description: "Powerful 1.5 Ton window air conditioner with energy saving mode.", image: "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 115, name: "Outdoor Flood Light (50W)", category: "Lighting", price: 1499, description: "Waterproof high-power LED flood light for outdoor security.", image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 116, name: "PVC Insulation Tape (Pack of 5)", category: "Wiring", price: 150, description: "Multi-colored electrical insulation tape for various wiring tasks.", image: "https://images.pexels.com/photos/7845123/pexels-photo-7845123.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 117, name: "Classic Wall-Mounted Fan", category: "Fan", price: 1599, description: "3-speed wall fan with pull cords and oscillation feature.", image: "https://images.pexels.com/photos/690407/pexels-photo-690407.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 118, name: "Precision Wire Stripper", category: "Tools", price: 350, description: "Self-adjusting wire stripper and cutter for clean and easy work.", image: "https://images.pexels.com/photos/843226/pexels-photo-843226.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 119, name: "Smart LED Bulb (Wi-Fi)", category: "Lighting", price: 699, description: "Color-changing smart bulb, controllable via app and voice assistants.", image: "https://images.pexels.com/photos/8099344/pexels-photo-8099344.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 120, name: "Heavy Duty MCB (32A)", category: "Wiring", price: 299, description: "Single-pole Miniature Circuit Breaker for overload protection.", image: "https://images.pexels.com/photos/599988/pexels-photo-599988.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    //... continue for 101 products
    { id: 121, name: "Grandeur Chandelier Fan", category: "Fan", price: 12999, description: "Elegant ceiling fan with integrated crystal chandelier.", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 122, name: "Compact Room Heater", category: "Appliances", price: 1499, description: "2000W fan heater with two heat settings and safety cut-off.", image: "https://images.pexels.com/photos/6324707/pexels-photo-6324707.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 123, name: "Focus LED Spotlight", category: "Lighting", price: 550, description: "Adjustable track-mounted spotlight for accent lighting.", image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 124, name: "Junction Box (4x4)", category: "Wiring", price: 50, description: "Durable PVC concealed modular junction box for wiring connections.", image: "https://images.pexels.com/photos/906015/pexels-photo-906015.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 125, name: "Industrial Heavy-Duty Exhaust Fan", category: "Fan", price: 3999, description: "24-inch exhaust fan for factories and large workshops.", image: "https://images.pexels.com/photos/159291/beer-machine-beer-brewery-159291.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 126, name: "Digital Clamp Meter", category: "Tools", price: 1199, description: "Professional clamp meter for measuring AC/DC current without contact.", image: "https://images.pexels.com/photos/4317157/pexels-photo-4317157.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 127, name: "Emergency Rechargeable LED Lantern", category: "Lighting", price: 899, description: "Bright LED lantern with up to 8 hours of battery backup.", image: "https://images.pexels.com/photos/988914/pexels-photo-988914.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 128, name: "CAT6 Ethernet Cable (20m)", category: "Wiring", price: 799, description: "High-speed LAN cable for stable internet connections.", image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 129, name: "Stealth Black Ceiling Fan", category: "Fan", price: 3200, description: "Matt black designer fan for a modern aesthetic.", image: "https://images.pexels.com/photos/3773574/pexels-photo-3773574.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 130, name: "Automatic Voltage Stabilizer", category: "Appliances", price: 2199, description: "Protects your appliances from voltage fluctuations.", image: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 131, name: "Vintage Edison Bulb", category: "Lighting", price: 250, description: "Antique-style filament bulb for a warm, retro look.", image: "https://images.pexels.com/photos/132340/pexels-photo-132340.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 132, name: "Wire Sleeve Kit", category: "Wiring", price: 450, description: "Assorted heat-shrink wire sleeves for insulating connections.", image: "https://images.pexels.com/photos/5088008/pexels-photo-5088008.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 133, name: "Mini Air Cooler", category: "Cooler", price: 1999, description: "Compact personal cooler for small rooms and offices.", image: "https://images.pexels.com/photos/5998132/pexels-photo-5998132.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 134, name: "Heat Gun (2000W)", category: "Tools", price: 1399, description: "Dual temperature heat gun for various applications.", image: "https://images.pexels.com/photos/7238779/pexels-photo-7238779.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 135, name: "LED Downlight (12W)", category: "Lighting", price: 350, description: "Recessed ceiling downlight with a clean, modern look.", image: "https://images.pexels.com/photos/1118428/pexels-photo-1118428.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 136, name: "Doorbell Chime Kit", category: "Wiring", price: 499, description: "Wireless doorbell with multiple chime options and long range.", image: "https://images.pexels.com/photos/4239014/pexels-photo-4239014.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 137, name: "Turbo-Flo Wall Fan", category: "Fan", price: 2100, description: "High-performance wall fan with remote control.", image: "https://images.pexels.com/photos/3756883/pexels-photo-3756883.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 138, name: "Water Immersion Heater Rod", category: "Appliances", price: 599, description: "1500W immersion rod for quick water heating.", image: "https://images.pexels.com/photos/92994/pexels-photo-92994.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 139, name: "Motion Sensor LED Light", category: "Lighting", price: 799, description: "Battery-powered motion-activated light for closets and hallways.", image: "https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 140, name: "PVC Conduit Pipe (10ft)", category: "Wiring", price: 120, description: "Standard PVC pipe for protecting electrical wiring.", image: "https://images.pexels.com/photos/8961343/pexels-photo-8961343.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 141, name: "Low Profile Ceiling Fan", category: "Fan", price: 2899, description: "Hugger-style fan, perfect for rooms with low ceilings.", image: "https://images.pexels.com/photos/6625953/pexels-photo-6625953.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 142, name: "Electric Iron (1000W)", category: "Appliances", price: 750, description: "Dry iron with non-stick soleplate and temperature control.", image: "https://images.pexels.com/photos/6214389/pexels-photo-6214389.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 143, name: "COB Strip LED Light (5m)", category: "Lighting", price: 999, description: "High-density COB LED strip for dotless, continuous lighting.", image: "https://images.pexels.com/photos/314937/pexels-photo-314937.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 144, name: "Modular Socket with USB", category: "Wiring", price: 450, description: "Wall socket with two built-in USB charging ports.", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 145, name: "Rechargeable Table Fan", category: "Fan", price: 1899, description: "Portable fan with built-in battery for use during power cuts.", image: "https://images.pexels.com/photos/459762/pexels-photo-459762.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 146, name: "Cordless Drill Driver", category: "Tools", price: 3499, description: "12V cordless drill with two batteries and a charger kit.", image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 147, name: "Smart Downlight (Wi-Fi)", category: "Lighting", price: 850, description: "Smart recessed light with tunable white and color options.", image: "https://images.pexels.com/photos/2088998/pexels-photo-2088998.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 148, name: "HDMI Cable (3m)", category: "Wiring", price: 399, description: "High-speed 4K HDMI cable for connecting media devices.", image: "https://images.pexels.com/photos/34284/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 149, name: "Tower Fan with Remote", category: "Fan", price: 3499, description: "Slim tower fan with 3 speeds, timer, and oscillation.", image: "https://images.pexels.com/photos/3773578/pexels-photo-3773578.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 150, name: "Induction Cooktop", category: "Appliances", price: 2499, description: "2000W induction stove with push-button controls and timer.", image: "https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 151, name: "Ceiling Rose", category: "Wiring", price: 40, description: "Standard electrical ceiling rose for light and fan fixtures.", image: "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 152, name: "Digital Soldering Station", category: "Tools", price: 2999, description: "Temperature controlled soldering station for precision electronics work.", image: "https://images.pexels.com/photos/5638161/pexels-photo-5638161.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 153, name: "Outdoor Wall Lantern", category: "Lighting", price: 1199, description: "Classic design outdoor wall light for porches and entrances.", image: "https://images.pexels.com/photos/262039/pexels-photo-262039.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 154, name: "Coaxial TV Cable (20m)", category: "Wiring", price: 499, description: "High-quality coaxial cable for cable TV and satellite connections.", image: "https://images.pexels.com/photos/224924/pexels-photo-224924.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 155, name: "Mist Fan", category: "Fan", price: 7999, description: "Pedestal fan with misting function for enhanced cooling.", image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 156, name: "Electric Kettle (1.5L)", category: "Appliances", price: 999, description: "Stainless steel electric kettle with auto cut-off.", image: "https://images.pexels.com/photos/5946636/pexels-photo-5946636.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 157, name: "LED Mirror Light", category: "Lighting", price: 899, description: "Sleek picture light, perfect for illuminating mirrors and artwork.", image: "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 158, name: "Modular Dimmer Switch", category: "Wiring", price: 350, description: "Rotary dimmer switch for controlling fan speed or light intensity.", image: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 159, name: "Mini Exhaust Fan (4-inch)", category: "Fan", price: 650, description: "Compact exhaust fan for small spaces like cabins and small bathrooms.", image: "https://images.pexels.com/photos/833045/pexels-photo-833045.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 160, name: "Screwdriver Set (8 pieces)", category: "Tools", price: 499, description: "Insulated screwdriver set for electrical work.", image: "https://images.pexels.com/photos/1249610/pexels-photo-1249610.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 161, name: "Ceiling Surface Light (15W)", category: "Lighting", price: 699, description: "Round surface-mounted LED ceiling light.", image: "https://images.pexels.com/photos/6489083/pexels-photo-6489083.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 162, name: "Telephone Wire (2-core, 90m)", category: "Wiring", price: 599, description: "Standard two-core telephone cable for landline connections.", image: "https://images.pexels.com/photos/4006151/pexels-photo-4006151.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 163, name: "Bladeless Table Fan", category: "Fan", price: 4999, description: "Modern and safe bladeless fan with remote control.", image: "https://images.pexels.com/photos/3935320/pexels-photo-3935320.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 164, name: "Pop-up Toaster", category: "Appliances", price: 1299, description: "2-slice pop-up toaster with browning control.", image: "https://images.pexels.com/photos/5665564/pexels-photo-5665564.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 165, name: "Under-Cabinet LED Light Bar", category: "Lighting", price: 999, description: "Set of 3 linkable light bars for kitchen under-cabinet lighting.", image: "https://images.pexels.com/photos/6585750/pexels-photo-6585750.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 166, name: "Metal Clad Switch Socket", category: "Wiring", price: 399, description: "Industrial-grade heavy-duty switch and socket combination.", image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 167, name: "Hand Blender", category: "Appliances", price: 1199, description: "250W hand blender for smoothies, soups, and sauces.", image: "https://images.pexels.com/photos/3731175/pexels-photo-3731175.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    // FIX: Changed property 'a' to 'name' to match the Product interface.
    { id: 168, name: "Hot Air Gun", category: "Tools", price: 1599, description: "Variable temperature hot air gun for shrink wrapping and repairs.", image: "https://images.pexels.com/photos/7238759/pexels-photo-7238759.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 169, name: "Outdoor Garden Spike Light", category: "Lighting", price: 750, description: "Waterproof spike light to highlight plants and pathways.", image: "https://images.pexels.com/photos/209948/pexels-photo-209948.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 170, name: "Speaker Wire (10m)", category: "Wiring", price: 299, description: "High-quality copper speaker wire for home audio systems.", image: "https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 171, name: "Vintage Style Pedestal Fan", category: "Fan", price: 3999, description: "Retro design pedestal fan with antique brass finish.", image: "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 172, name: "Digital Kitchen Scale", category: "Appliances", price: 699, description: "Electronic scale for precise measurement in cooking and baking.", image: "https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 173, name: "Dimmable LED Filament Bulb", category: "Lighting", price: 350, description: "Classic-look filament bulb compatible with dimmer switches.", image: "https://images.pexels.com/photos/929385/pexels-photo-929385.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 174, name: "Weatherproof Outdoor Socket Box", category: "Wiring", price: 550, description: "IP66 rated waterproof socket box for outdoor use.", image: "https://images.pexels.com/photos/224929/pexels-photo-224929.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 175, name: "Portable Air Conditioner (1 Ton)", category: "Cooler", price: 24999, description: "Movable AC unit with exhaust hose, perfect for renters.", image: "https://images.pexels.com/photos/38280/pexels-photo-38280.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 176, name: "Angle Grinder (4-inch)", category: "Tools", price: 2199, description: "Powerful angle grinder for cutting and grinding metal.", image: "https://images.pexels.com/photos/176103/pexels-photo-176103.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 177, name: "LED Bulkhead Light", category: "Lighting", price: 650, description: "Durable and weatherproof light for outdoor walls and ceilings.", image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 178, name: "Rotary Tool Kit", category: "Tools", price: 1999, description: "Versatile rotary tool with multiple attachments for crafting and DIY.", image: "https://images.pexels.com/photos/382297/pexels-photo-382297.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 179, name: "Digital Timer Switch Socket", category: "Wiring", price: 799, description: "Programmable timer to automatically turn appliances on and off.", image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 180, name: "Mixer Grinder (500W)", category: "Appliances", price: 1999, description: "Powerful mixer grinder with 3 jars for wet and dry grinding.", image: "https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 181, name: "Industrial High Bay LED Light", category: "Lighting", price: 4500, description: "150W high bay light for warehouses and factories.", image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 182, name: "Wooden Finish Ceiling Fan", category: "Fan", price: 4200, description: "Ceiling fan with wooden finish blades for a rustic look.", image: "https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 183, name: "Continuity Tester", category: "Tools", price: 199, description: "Simple pen-style continuity tester for checking circuits.", image: "https://images.pexels.com/photos/4011394/pexels-photo-4011394.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 184, name: "Ceiling Fan with Light Kit", category: "Fan", price: 3499, description: "Ceiling fan with an integrated LED light fixture.", image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 185, name: "Infrared Thermometer", category: "Tools", price: 1499, description: "Non-contact IR thermometer for measuring surface temperatures.", image: "https://images.pexels.com/photos/4056461/pexels-photo-4056461.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 186, name: "Spike Guard with USB Ports", category: "Wiring", price: 899, description: "6-socket spike guard with 2 USB charging ports.", image: "https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 187, name: "Ceiling Fan Remote Control Kit", category: "Fan", price: 799, description: "Universal remote control kit to add remote functionality to any fan.", image: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 188, name: "Electric Hand Mixer", category: "Appliances", price: 1499, description: "300W hand mixer with multiple speed settings and attachments.", image: "https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 189, name: "LED Foot Light", category: "Lighting", price: 299, description: "Modular step light for illuminating stairs and pathways.", image: "https://images.pexels.com/photos/6480198/pexels-photo-6480198.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 190, name: "Digital Caliper", category: "Tools", price: 999, description: "Electronic digital caliper for precise measurements.", image: "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 191, name: "4-Core Armoured Cable (per meter)", category: "Wiring", price: 150, description: "Heavy-duty underground armoured cable for outdoor power.", image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 192, name: "Ceiling Fan Capacitor", category: "Fan", price: 150, description: "Universal capacitor for regulating ceiling fan speed.", image: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 193, name: "Room Air Purifier", category: "Appliances", price: 9999, description: "HEPA filter air purifier for removing dust, pollen, and pollutants.", image: "https://images.pexels.com/photos/3951901/pexels-photo-3951901.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 194, name: "LED Strip Light Connector Kit", category: "Lighting", price: 250, description: "Solderless connectors for joining and extending LED strip lights.", image: "https://images.pexels.com/photos/162553/keys-security-safety-password-162553.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 195, name: "Glue Gun with Sticks", category: "Tools", price: 399, description: "40W hot glue gun with a pack of 10 glue sticks.", image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 196, name: "3-Pin Plug Top", category: "Wiring", price: 50, description: "Durable 16A 3-pin plug top for heavy appliances.", image: "https://images.pexels.com/photos/4218546/pexels-photo-4218546.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 197, name: "Kids' Room Ceiling Fan", category: "Fan", price: 2999, description: "Colorful and playful ceiling fan designed for a child's room.", image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 198, name: "Digital Weighing Scale", category: "Appliances", price: 899, description: "High-precision digital scale for personal or kitchen use.", image: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 199, name: "Rechargeable LED Headlamp", category: "Lighting", price: 599, description: "Hands-free headlamp for repairs, camping, and emergencies.", image: "https://images.pexels.com/photos/2528325/pexels-photo-2528325.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 200, name: "Wire Terminal Crimping Tool", category: "Tools", price: 550, description: "Professional crimper for attaching terminals to wires.", image: "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 201, name: "DB Box (8-Way)", category: "Wiring", price: 1299, description: "Double-door distribution box for housing MCBs.", image: "https://images.pexels.com/photos/5691632/pexels-photo-5691632.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] }

];

const DEFAULT_PROMOTION: Promotion = {
    isActive: false,
    headline: "Limited Time Offer!",
    description: "Get huge discounts on selected items for a short time.",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    primaryOffer: {
        text: "10% off all Fans this week!",
        discountPercent: 10,
        category: "Fan",
    }
};

// --- GLOBAL STATE ---
let state = {
    products: [] as Product[],
    promotion: {} as Promotion,
    orders: [] as any[],
    ratings: {} as any,
    compareList: [] as number[],
    currentTransaction: {} as any,
    WEBHOOK_SECRET: '',
    qrTimerInterval: null as number | null,
    countdownInterval: null as number | null,
};


// --- DOM Element Selectors ---
const getElement = <T extends HTMLElement>(selector: string): T => document.querySelector(selector) as T;

let productGrid: HTMLElement;

// --- RENDER FUNCTIONS ---
function renderAllProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = '';
    state.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id.toString();
        card.innerHTML = `
            <div class="sale-badge" style="display: none;">Sale</div>
            <div class="img-container">${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : 'No Image'}</div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-price" data-original-price="${product.price}"></p>
                <div class="star-rating"></div>
                <div class="product-variants"></div>
                <p class="product-description">${product.description}</p>
                <p class="product-offer-highlight"></p>
            </div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn minus-btn" aria-label="Decrease quantity">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10" readonly>
                    <button class="quantity-btn plus-btn" aria-label="Increase quantity">+</button>
                </div>
                <div class="main-actions">
                    <button class="quick-view-btn">Quick View</button>
                    <button class="buy-now-btn">Buy Now</button>
                </div>
                <button class="compare-btn">Compare</button>
            </div>
        `;
        productGrid.appendChild(card);
        renderFrontendVariants(card, product);
        renderStarRating(card.querySelector('.star-rating')!, product.id.toString());
    });
    updateCompareButtonsUI();
}

function renderFrontendVariants(card: HTMLElement, product: Product) {
    const variantsContainer = card.querySelector('.product-variants');
    if (!variantsContainer) return;
    
    variantsContainer.innerHTML = '';
    
    if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
            const btn = document.createElement('button');
            btn.className = 'variant-btn';
            btn.dataset.variantId = variant.id.toString();
            btn.textContent = variant.name;
            btn.onclick = () => updateProductDisplay(card, product, variant.id);
            variantsContainer.appendChild(btn);
        });
        updateProductDisplay(card, product, product.variants[0].id); // Select first variant
    } else {
        updateProductDisplay(card, product, null); // Render with no variants
    }
}

function updateProductDisplay(card: HTMLElement, product: Product, selectedVariantId: number | null) {
    const promotionConfig = state.promotion;
    const priceEl = card.querySelector('.product-price')!;
    const saleBadge = card.querySelector<HTMLElement>('.sale-badge')!;

    let selectedVariant = selectedVariantId ? product.variants.find(v => v.id === selectedVariantId) : null;
    
    if (selectedVariantId) {
        card.querySelectorAll('.variant-btn').forEach(btn => {
            btn.classList.toggle('active', (btn as HTMLElement).dataset.variantId === selectedVariantId.toString());
        });
    }

    let originalPrice = selectedVariant?.price ?? product.price;
    let salePrice = selectedVariant?.salePrice ?? product.salePrice;

    let finalPrice = originalPrice;
    let discountApplied = false;
    
    if (salePrice && salePrice < originalPrice) {
        finalPrice = salePrice;
        discountApplied = true;
    } else if (promotionConfig.isActive && product.category === promotionConfig.primaryOffer.category) {
        finalPrice = Math.round(originalPrice * (1 - promotionConfig.primaryOffer.discountPercent / 100));
        discountApplied = true;
    }

    if (discountApplied) {
        priceEl.innerHTML = `<del>₹${originalPrice}</del> <ins>₹${finalPrice}</ins>`;
        if (saleBadge) {
            const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
            saleBadge.textContent = `${discountPercent}% OFF`;
            saleBadge.style.display = 'block';
        }
    } else {
        priceEl.innerHTML = `₹${originalPrice}`;
        if (saleBadge) saleBadge.style.display = 'none';
    }
}

// --- Promotion & Countdown Logic ---
function startCountdown(endDate: string) {
  const countdownDate = new Date(endDate).getTime();
  const topTimerEl = getElement('#offer-countdown-timer-top');
  const mainTimerEl = getElement('#offer-countdown-timer-main');
  
  if (state.countdownInterval) clearInterval(state.countdownInterval);

  state.countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
      clearInterval(state.countdownInterval!);
      if (topTimerEl) topTimerEl.innerHTML = "<span>Offer Expired</span>";
      if (mainTimerEl) mainTimerEl.innerHTML = "Offer Expired";
      getElement('#top-offer-banner')?.classList.add('hidden');
      document.body.classList.remove('banner-visible');
      (getElement('#promotion-banner') as HTMLElement).style.display = 'none';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const format = (num: number) => num.toString().padStart(2, '0');

    const topTimerHTML = `<span>${format(days)}d</span>:<span>${format(hours)}h</span>:<span>${format(minutes)}m</span>:<span>${format(seconds)}s</span>`;
    const mainTimerHTML = `${format(days)}d : ${format(hours)}h : ${format(minutes)}m : ${format(seconds)}s`;
    
    if (topTimerEl) topTimerEl.innerHTML = topTimerHTML;
    if (mainTimerEl) mainTimerEl.innerHTML = mainTimerHTML;
  }, 1000);
}

function applyPromotions() {
    const promotionConfig = state.promotion;
    const topBanner = getElement<HTMLElement>('#top-offer-banner');
    const mainBanner = getElement<HTMLElement>('#promotion-banner');

    if (!promotionConfig.isActive) {
        if(topBanner) topBanner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        if(mainBanner) mainBanner.style.display = 'none';
        if (state.countdownInterval) clearInterval(state.countdownInterval);
        renderAllProducts();
        return;
    }

    if (topBanner && sessionStorage.getItem('topBannerDismissed') !== 'true') {
        const offerTextEl = getElement('#offer-text-top');
        if (offerTextEl) {
            offerTextEl.textContent = promotionConfig.headline;
        }
        topBanner.classList.remove('hidden');
        document.body.classList.add('banner-visible');
    }

    if (mainBanner) {
        mainBanner.innerHTML = `
            <h2>${promotionConfig.headline}</h2>
            <div id="offer-countdown-timer-main"></div>
            <p>${promotionConfig.description}</p>`;
        mainBanner.style.display = 'block';
    }


    startCountdown(promotionConfig.endDate);
    renderAllProducts(); // Re-render products to apply discounts
}

// --- Compare Products Logic ---

function toggleCompareItem(productId: number) {
    const isInCompare = state.compareList.includes(productId);

    if (isInCompare) {
        state.compareList = state.compareList.filter(id => id !== productId);
    } else {
        if (state.compareList.length >= 4) {
            alert('You can only compare up to 4 items at a time.');
            return;
        }
        state.compareList.push(productId);
    }

    DB.saveCompareList(state.compareList);
    renderCompareTray();
    updateCompareButtonsUI();
}

function updateCompareButtonsUI() {
    document.querySelectorAll('.compare-btn').forEach(btn => {
        const card = btn.closest('.product-card') as HTMLElement;
        if (!card) return;
        const productId = parseInt(card.dataset.id!);
        const isInCompare = state.compareList.includes(productId);
        
        btn.textContent = isInCompare ? 'Added to Compare' : 'Compare';
        btn.classList.toggle('added', isInCompare);
    });
}

function renderCompareTray() {
    const tray = getElement<HTMLElement>('#compare-tray');
    const itemsContainer = getElement<HTMLElement>('#compare-tray-items');
    const compareNowBtn = getElement<HTMLButtonElement>('#compare-now-btn');

    if (!tray || !itemsContainer || !compareNowBtn) return;

    if (state.compareList.length === 0) {
        tray.classList.remove('visible');
        return;
    }

    tray.classList.add('visible');
    itemsContainer.innerHTML = '';

    state.compareList.forEach(productId => {
        const product = state.products.find(p => p.id === productId);
        if (product) {
            const itemEl = document.createElement('div');
            itemEl.className = 'compare-item';
            itemEl.innerHTML = `
                <img src="${product.image || ''}" alt="${product.name}">
                <button class="remove-compare-item" data-id="${product.id}" aria-label="Remove ${product.name} from comparison">&times;</button>
            `;
            itemsContainer.appendChild(itemEl);
        }
    });

    compareNowBtn.disabled = state.compareList.length < 2;
}

function renderCompareModal() {
    const contentEl = getElement('#compare-modal-content');
    if (!contentEl) return;

    const productsToCompare = state.compareList.map(id => state.products.find(p => p.id === id)).filter(Boolean) as Product[];

    if (productsToCompare.length < 2) {
        contentEl.innerHTML = '<p>Please select at least two products to compare.</p>';
        return;
    }
    
    let tableHTML = '<table class="compare-table">';
    
    // Table Header (Product Images and Names)
    tableHTML += '<thead><tr><th>Feature</th>';
    productsToCompare.forEach(p => {
        tableHTML += `<th>
            <div class="compare-product-header">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : 'No Image'}
                <div>${p.name}</div>
            </div>
        </th>`;
    });
    tableHTML += '</tr></thead>';

    // Table Body
    tableHTML += '<tbody>';
    const attributes: (keyof Product | 'rating')[] = ['price', 'category', 'rating', 'description'];
    const attributeLabels: Record<string, string> = {
        price: 'Price',
        category: 'Category',
        rating: 'Customer Rating',
        description: 'Description'
    };

    attributes.forEach(attr => {
        tableHTML += `<tr><td>${attributeLabels[attr]}</td>`;
        productsToCompare.forEach(p => {
            if (attr === 'price') {
                const priceHTML = p.salePrice ? `<del>₹${p.price}</del> <ins>₹${p.salePrice}</ins>` : `₹${p.price}`;
                tableHTML += `<td>${priceHTML}</td>`;
            } else if (attr === 'rating') {
                tableHTML += `<td><div class="star-rating" data-product-id-for-render="${p.id}"></div></td>`;
            } else {
                tableHTML += `<td>${p[attr as keyof Product]}</td>`;
            }
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    contentEl.innerHTML = tableHTML;
    
    // Render star ratings after table is in DOM
    contentEl.querySelectorAll<HTMLElement>('.star-rating[data-product-id-for-render]').forEach(container => {
        const productId = container.dataset.productIdForRender;
        if(productId) {
            renderStarRating(container, productId);
        }
    });
}

function setupCompareFeature() {
    const tray = getElement('#compare-tray');
    const compareModal = getElement('#compare-modal');

    if (!tray || !compareModal) return;

    tray.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id === 'clear-compare-btn') {
            state.compareList = [];
            DB.saveCompareList(state.compareList);
            renderCompareTray();
            updateCompareButtonsUI();
        }
        if (target.id === 'compare-now-btn' && state.compareList.length >= 2) {
            renderCompareModal();
            openModal(compareModal);
        }
        if (target.classList.contains('remove-compare-item')) {
            const productId = parseInt(target.dataset.id!);
            toggleCompareItem(productId);
        }
    });
}


// --- GENERAL UI & EVENT LISTENERS ---
// --- Modal Logic ---
const allModals = document.querySelectorAll('.modal');
let lastFocusedElement: HTMLElement;
let currentModal: HTMLElement | null = null;

const trapFocus = (e: KeyboardEvent) => {
    if (!currentModal || e.key !== 'Tab') return;
    const focusableElements = Array.from(currentModal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
        }
    } else { // Tab
        if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
        }
    }
};

function openModal(modal: HTMLElement) {
    lastFocusedElement = document.activeElement as HTMLElement;
    currentModal = modal;
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', trapFocus);
    
    const firstFocusable = modal.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}

function closeModal(modal: HTMLElement) {
    modal.style.display = 'none';
    document.removeEventListener('keydown', trapFocus);
    
    if (currentModal === modal) {
         currentModal = null;
    }

    const isAnyModalOpen = Array.from(allModals).some(m => (m as HTMLElement).style.display === 'flex');
    if (!isAnyModalOpen) {
         document.body.classList.remove('modal-open');
    }
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// --- Star Rating Logic ---
function addRating(productId: string, rating: number) {
    const ratings = DB.getRatings();
    if (!ratings[productId]) ratings[productId] = [];
    ratings[productId].push(rating);
    DB.saveRatings(ratings);
    state.ratings = ratings;
};

function renderStarRating(container: HTMLElement, productId: string) {
    if (!container) return;
    const productRatings = state.ratings[productId] || [];
    const count = productRatings.length;
    const average = count > 0 ? (productRatings.reduce((a: number, b: number) => a + b, 0) / count) : 0;

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star${i <= average ? ' filled' : ''}">★</span>`;
    }
    
    const countText = count > 0 ? `(${count} ${count > 1 ? 'ratings' : 'rating'})` : '(No ratings yet)';
    container.innerHTML = `${starsHtml} <span class="rating-count">${countText}</span>`;
};


// --- INITIALIZATION ---
function init() {
    productGrid = getElement('.product-grid');
    if (!productGrid) {
        console.error("The '.product-grid' element was not found in the DOM. App initialization failed.");
        return;
    }

    DB.init();
    state.products = DB.getProducts();
    state.promotion = DB.getPromotion();
    state.orders = DB.getOrders();
    state.ratings = DB.getRatings();
    state.compareList = DB.getCompareList();
    
    // Initial Render
    renderAllProducts();
    applyPromotions();
    renderCompareTray();

    // Setup Event Listeners
    setupCompareFeature();

    const hamburgerBtn = getElement('#hamburger-btn');
    const navLinks = getElement('#nav-links');
    
    hamburgerBtn.addEventListener('click', () => {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', (!isExpanded).toString());
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const nav = getElement('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        if(anchor.id !== 'my-orders-btn') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetElement = document.querySelector((this as HTMLAnchorElement).getAttribute('href')!);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    const closeTopBannerBtn = getElement('#close-top-banner');
    if (closeTopBannerBtn) {
        closeTopBannerBtn.addEventListener('click', () => {
            getElement('#top-offer-banner')?.classList.add('hidden');
            document.body.classList.remove('banner-visible');
            sessionStorage.setItem('topBannerDismissed', 'true');
        });
    }

    // Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling as HTMLElement;
            const isActive = header.classList.contains('active');
            
            document.querySelectorAll('.accordion-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove('active');
                    activeHeader.setAttribute('aria-expanded', 'false');
                    (activeHeader.nextElementSibling as HTMLElement).style.maxHeight = '';
                }
            });

            header.classList.toggle('active', !isActive);
            header.setAttribute('aria-expanded', String(!isActive));
            content.style.maxHeight = isActive ? '' : `${content.scrollHeight}px`;
        });
    });

    allModals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal as HTMLElement));
        modal.addEventListener('click', (e) => {
             if (e.target === modal) closeModal(modal as HTMLElement);
        });
    });

    const quickViewModal = getElement('#quick-view-modal');
    productGrid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('quantity-btn')) {
            const selector = target.closest('.quantity-selector');
            if (!selector) return;
    
            const input = selector.querySelector('.quantity-input') as HTMLInputElement;
            let currentValue = parseInt(input.value, 10);
            const max = parseInt(input.max, 10) || 10;
            const min = parseInt(input.min, 10) || 1;
    
            if (target.classList.contains('plus-btn')) {
                if (currentValue < max) {
                    currentValue++;
                }
            } else if (target.classList.contains('minus-btn')) {
                if (currentValue > min) {
                    currentValue--;
                }
            }
            input.value = currentValue.toString();
            return; // Stop further event processing
        }
        
        const card = target.closest('.product-card');
        if (!card) return;

        const productId = (card as HTMLElement).dataset.id!;
        const product = state.products.find(p => p.id.toString() === productId);
        if (!product) return;

        if (target.classList.contains('quick-view-btn')) {
             const quickViewContent = getElement('#quick-view-content');
             const priceEl = card.querySelector('.product-price')!;
             if (quickViewContent && priceEl) {
                 quickViewContent.innerHTML = `
                    ${product.image ? `<img src="${product.image}" id="quick-view-img" alt="${product.name}" loading="lazy">` : ''}
                    <h3>${product.name}</h3>
                    <div class="price">${priceEl.innerHTML}</div>
                    <div class="product-variants"></div>
                    <p class="description" style="margin-top:1rem">${product.description}</p>`;
                
                const qvModalContent = quickViewContent.closest('.modal-content') as HTMLElement;
                if (qvModalContent) {
                    renderFrontendVariants(qvModalContent, product);
                }
                
                if (quickViewModal) {
                    const ratingInput = quickViewModal.querySelector('.rating-input') as HTMLElement;
                    if (ratingInput) {
                        ratingInput.dataset.productId = productId;
                    }
                    openModal(quickViewModal);
                }
             }
        }
        
        if (target.classList.contains('buy-now-btn')) {
            const productInfoContainer = getElement('#product-to-buy-info');
            const priceEl = card.querySelector('.product-price');
            const quantityInput = card.querySelector('.quantity-input') as HTMLInputElement;
            const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

            if (productInfoContainer && priceEl) {
                 // Determine the current price from the displayed price element
                let finalPrice = 0;
                const insPrice = priceEl.querySelector('ins');
                let singlePriceText = insPrice ? insPrice.textContent : priceEl.textContent;
                if (singlePriceText) {
                    finalPrice = parseFloat(singlePriceText.replace(/[^0-9.]/g, ''));
                }
                const totalPrice = finalPrice * quantity;

                productInfoContainer.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Quantity: ${quantity}</p>
                    <p style="font-size: 1.4rem; font-weight: bold; color: var(--cyan);">Total: ₹${totalPrice.toFixed(2)}</p>
                `;
                
                state.currentTransaction = {
                    product,
                    quantity,
                    totalPrice,
                };
                const deliveryModal = getElement('#delivery-modal');
                if (deliveryModal) openModal(deliveryModal);
            }
        }

        if (target.classList.contains('compare-btn')) {
            toggleCompareItem(parseInt(productId));
        }
    });

    // Scroll Animations
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.services h2, .about-us h2, .products h2, .testimonials h2, .gallery h2').forEach(header => {
        header.classList.add('reveal-on-scroll');
        scrollObserver.observe(header);
    });

    document.querySelectorAll('.accordion-container, .about-us, .product-grid, .testimonial-grid, .gallery-grid').forEach(container => {
        const items = container.querySelectorAll('.accordion-item, .about-item, .product-card, .testimonial-card, .gallery-item');
        items.forEach((item, index) => {
            item.classList.add('reveal-on-scroll');
            (item as HTMLElement).style.transitionDelay = `${index * 100}ms`; 
            scrollObserver.observe(item);
        });
    });

}

// Start the application
init();