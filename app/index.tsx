import "../global.css";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;
type Tab = "home" | "menu" | "reserve" | "profile";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  color: string;
  icon: IconName;
  popular?: boolean;
};

const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFFFF",
  primary: "#286B62",
  primaryDark: "#1F514B",
  foreground: "#21302D",
  muted: "#7A8881",
  border: "#E9E7DE",
  warning: "#C97852",
  cream: "#EFE7D5",
};

const categories = [
  { label: "All", icon: "restaurant-outline" as IconName },
  { label: "Starters", icon: "leaf-outline" as IconName },
  { label: "Mains", icon: "flame-outline" as IconName },
  { label: "Desserts", icon: "ice-cream-outline" as IconName },
  { label: "Drinks", icon: "wine-outline" as IconName },
];

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "The Christoffel Burger",
    description: "Wagyu beef, smoked cheddar, caramelised onion, house sauce",
    price: 18,
    category: "Mains",
    color: "#D8A36A",
    icon: "fast-food-outline",
    popular: true,
  },
  {
    id: 2,
    name: "Garden Harvest Bowl",
    description: "Roasted seasonal vegetables, grains, herbs and tahini",
    price: 15,
    category: "Mains",
    color: "#8FBA94",
    icon: "nutrition-outline",
    popular: true,
  },
  {
    id: 3,
    name: "Crispy Halloumi",
    description: "Honey, toasted sesame, chilli and fresh lemon",
    price: 10,
    category: "Starters",
    color: "#E5C879",
    icon: "sparkles-outline",
  },
  {
    id: 4,
    name: "Coastal Catch",
    description: "Pan-seared fish, lemon butter, greens and crispy potatoes",
    price: 22,
    category: "Mains",
    color: "#8EB6B5",
    icon: "fish-outline",
  },
  {
    id: 5,
    name: "Dark Chocolate Torte",
    description: "Velvety chocolate, sea salt, vanilla cream",
    price: 9,
    category: "Desserts",
    color: "#A97D70",
    icon: "cafe-outline",
  },
  {
    id: 6,
    name: "Botanical Spritz",
    description: "Elderflower, grapefruit, mint and sparkling water",
    price: 8,
    category: "Drinks",
    color: "#C6A8CF",
    icon: "wine-outline",
  },
];

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [reservationDate, setReservationDate] = useState("Friday, 27 Sep");
  const [reservationTime, setReservationTime] = useState("7:00 PM");
  const [guests, setGuests] = useState("2 guests");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = !query || `${item.name} ${item.description}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const cartItems = menuItems.filter((item) => cart.includes(item.id));
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  const addToCart = (id: number) => {
    setCart((current) => (current.includes(id) ? current : [...current, id]));
  };

  const removeFromCart = (id: number) => {
    setCart((current) => current.filter((itemId) => itemId !== id));
  };

  const handleReservation = () => {
    Alert.alert("Reservation requested", `We will see you on ${reservationDate} at ${reservationTime}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons name="restaurant" size={18} color={COLORS.surface} />
            </View>
            <View>
              <Text style={styles.brandName}>CHRISTOFFEL&apos;S</Text>
              <Text style={styles.brandSubline}>KITCHEN &amp; GATHERING</Text>
            </View>
          </View>
          <Pressable style={styles.bellButton} onPress={() => Alert.alert("You&apos;re all caught up", "No new notifications.")}>
            <Ionicons name="notifications-outline" size={21} color={COLORS.foreground} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {activeTab === "home" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.heroCard}>
              <View style={styles.heroCopy}>
                <Text style={styles.eyebrow}>GOOD FOOD. GOOD COMPANY.</Text>
                <Text style={styles.heroTitle}>A table worth{`\n`}coming back to.</Text>
                <Text style={styles.heroBody}>Seasonal cooking, warm hospitality, and a little bit of magic in every plate.</Text>
                <Pressable style={styles.primaryButton} onPress={() => setActiveTab("reserve")}>
                  <Text style={styles.primaryButtonText}>Book a table</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.surface} />
                </Pressable>
              </View>
              <View style={styles.heroIllustration}>
                <View style={styles.sun} />
                <View style={styles.illustrationPlate}>
                  <View style={styles.plateInner} />
                </View>
                <View style={styles.illustrationLeafOne} />
                <View style={styles.illustrationLeafTwo} />
                <Text style={styles.illustrationText}>EST. 2018</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>What are you in the mood for?</Text>
                <Text style={styles.sectionSubtitle}>Explore our kitchen favourites</Text>
              </View>
              <Pressable onPress={() => setActiveTab("menu")}>
                <Text style={styles.linkText}>View menu</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {categories.slice(1).map((category) => (
                <Pressable key={category.label} style={styles.categoryCard} onPress={() => { setSelectedCategory(category.label); setActiveTab("menu"); }}>
                  <View style={styles.categoryIcon}>
                    <Ionicons name={category.icon} size={22} color={COLORS.primary} />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <Ionicons name="arrow-up" size={14} color={COLORS.muted} style={styles.categoryArrow} />
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Popular tonight</Text>
                <Text style={styles.sectionSubtitle}>Our guests keep coming back for these</Text>
              </View>
              <Pressable onPress={() => setActiveTab("menu")}>
                <Text style={styles.linkText}>See all</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodRow}>
              {menuItems.filter((item) => item.popular).map((item) => (
                <FoodCard key={item.id} item={item} onAdd={() => addToCart(item.id)} added={cart.includes(item.id)} />
              ))}
            </ScrollView>

            <View style={styles.infoBanner}>
              <View style={styles.infoIcon}><Ionicons name="calendar-outline" size={22} color={COLORS.primary} /></View>
              <View style={styles.infoCopy}>
                <Text style={styles.infoTitle}>Planning something special?</Text>
                <Text style={styles.infoBody}>Let us make your next gathering memorable.</Text>
              </View>
              <Pressable onPress={() => setActiveTab("reserve")}><Ionicons name="arrow-forward-circle" size={28} color={COLORS.primary} /></Pressable>
            </View>
          </ScrollView>
        )}

        {activeTab === "menu" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.pageHeading}>
              <Text style={styles.pageTitle}>Our menu</Text>
              <Text style={styles.pageSubtitle}>Made with care, served with joy.</Text>
            </View>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={19} color={COLORS.muted} />
              <TextInput value={search} onChangeText={setSearch} placeholder="Search the menu" placeholderTextColor={COLORS.muted} style={styles.searchInput} />
              {search.length > 0 && <Pressable onPress={() => setSearch("")}><Ionicons name="close-circle" size={19} color={COLORS.muted} /></Pressable>}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {categories.map((category) => {
                const active = selectedCategory === category.label;
                return <Pressable key={category.label} style={[styles.filterChip, active && styles.filterChipActive]} onPress={() => setSelectedCategory(category.label)}><Ionicons name={category.icon} size={15} color={active ? COLORS.surface : COLORS.primary} /><Text style={[styles.filterText, active && styles.filterTextActive]}>{category.label}</Text></Pressable>;
              })}
            </ScrollView>
            <View style={styles.menuList}>
              {filteredItems.map((item) => <MenuRow key={item.id} item={item} onAdd={() => addToCart(item.id)} added={cart.includes(item.id)} />)}
              {filteredItems.length === 0 && <View style={styles.emptyState}><Ionicons name="search-outline" size={35} color={COLORS.muted} /><Text style={styles.emptyTitle}>Nothing found</Text><Text style={styles.emptyBody}>Try another dish or category.</Text></View>}
            </View>
          </ScrollView>
        )}

        {activeTab === "reserve" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.pageHeading}><Text style={styles.pageTitle}>Make a reservation</Text><Text style={styles.pageSubtitle}>We&apos;ll keep a seat warm for you.</Text></View>
            <View style={styles.reservationHero}><View style={styles.reservationBadge}><Ionicons name="heart" size={19} color={COLORS.warning} /></View><Text style={styles.reservationQuote}>“The best memories are made around the table.”</Text><Text style={styles.reservationNote}>Join us for an evening of thoughtful food and easy conversation.</Text></View>
            <Text style={styles.formLabel}>DATE</Text>
            <View style={styles.optionRow}>{["Friday, 27 Sep", "Saturday, 28 Sep"].map((date) => <Pressable key={date} style={[styles.optionButton, reservationDate === date && styles.optionButtonActive]} onPress={() => setReservationDate(date)}><Ionicons name="calendar-outline" size={18} color={reservationDate === date ? COLORS.surface : COLORS.primary} /><Text style={[styles.optionText, reservationDate === date && styles.optionTextActive]}>{date}</Text></Pressable>)}</View>
            <Text style={styles.formLabel}>TIME</Text>
            <View style={styles.timeGrid}>{["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map((time) => <Pressable key={time} style={[styles.timeButton, reservationTime === time && styles.timeButtonActive]} onPress={() => setReservationTime(time)}><Text style={[styles.timeText, reservationTime === time && styles.timeTextActive]}>{time}</Text></Pressable>)}</View>
            <Text style={styles.formLabel}>PARTY SIZE</Text>
            <View style={styles.optionRow}>{["2 guests", "4 guests", "6+ guests"].map((size) => <Pressable key={size} style={[styles.optionButton, guests === size && styles.optionButtonActive]} onPress={() => setGuests(size)}><Ionicons name="people-outline" size={18} color={guests === size ? COLORS.surface : COLORS.primary} /><Text style={[styles.optionText, guests === size && styles.optionTextActive]}>{size}</Text></Pressable>)}</View>
            <Pressable style={styles.reserveButton} onPress={handleReservation}><Text style={styles.reserveButtonText}>Request reservation</Text><Ionicons name="arrow-forward" size={18} color={COLORS.surface} /></Pressable>
            <Text style={styles.smallNote}>For parties larger than 8, please contact us directly at hello@christoffels.co</Text>
          </ScrollView>
        )}

        {activeTab === "profile" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.pageHeading}><Text style={styles.pageTitle}>Your Christoffel&apos;s</Text><Text style={styles.pageSubtitle}>Keep your favourites close.</Text></View>
            <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>T</Text></View><View style={styles.profileCopy}><Text style={styles.profileName}>Welcome back, Taylor</Text><Text style={styles.profileMeta}>Member since September 2024</Text></View><Ionicons name="settings-outline" size={21} color={COLORS.muted} /></View>
            <View style={styles.statsRow}><Stat value="04" label="Visits" /><Stat value="12" label="Favourites" /><Stat value="$180" label="Saved" /></View>
            <Text style={styles.sectionTitle}>Your shortcuts</Text>
            {[{ icon: "heart-outline" as IconName, label: "Saved favourites", detail: "12 dishes" }, { icon: "receipt-outline" as IconName, label: "Past orders", detail: "View history" }, { icon: "help-circle-outline" as IconName, label: "Need a hand?", detail: "Contact us" }].map((item) => <Pressable style={styles.profileRow} key={item.label}><View style={styles.profileRowIcon}><Ionicons name={item.icon} size={20} color={COLORS.primary} /></View><View style={styles.profileRowCopy}><Text style={styles.profileRowLabel}>{item.label}</Text><Text style={styles.profileRowDetail}>{item.detail}</Text></View><Ionicons name="chevron-forward" size={19} color={COLORS.muted} /></Pressable>)}
          </ScrollView>
        )}

        {showCart && <View style={styles.cartOverlay}><Pressable style={styles.overlayTap} onPress={() => setShowCart(false)} /><View style={styles.cartSheet}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Your order</Text><Text style={styles.sheetSubtitle}>{cartItems.length} item{cartItems.length === 1 ? "" : "s"}</Text></View><Pressable onPress={() => setShowCart(false)}><Ionicons name="close" size={23} color={COLORS.foreground} /></Pressable></View>{cartItems.length === 0 ? <View style={styles.emptyCart}><Ionicons name="basket-outline" size={38} color={COLORS.muted} /><Text style={styles.emptyTitle}>Your basket is empty</Text><Text style={styles.emptyBody}>Add something delicious from the menu.</Text></View> : <>{cartItems.map((item) => <View style={styles.cartRow} key={item.id}><View style={[styles.cartThumb, { backgroundColor: item.color }]}><Ionicons name={item.icon} size={19} color={COLORS.foreground} /></View><View style={styles.cartItemCopy}><Text style={styles.cartItemName}>{item.name}</Text><Text style={styles.cartItemPrice}>{formatPrice(item.price)}</Text></View><Pressable onPress={() => removeFromCart(item.id)}><Ionicons name="remove-circle-outline" size={22} color={COLORS.muted} /></Pressable></View>)}<View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text></View><Pressable style={styles.checkoutButton} onPress={() => Alert.alert("Almost there", "Checkout will be available once online ordering is connected.")}><Text style={styles.checkoutText}>Continue to checkout</Text><Ionicons name="arrow-forward" size={17} color={COLORS.surface} /></Pressable></>}</View></View>}

        <View style={styles.bottomBar}>
          {(["home", "menu", "reserve", "profile"] as Tab[]).map((tab) => {
            const active = activeTab === tab;
            const icon: Record<Tab, IconName> = { home: active ? "home" : "home-outline", menu: active ? "grid" : "grid-outline", reserve: active ? "calendar" : "calendar-outline", profile: active ? "person" : "person-outline" };
            const label: Record<Tab, string> = { home: "Home", menu: "Menu", reserve: "Reserve", profile: "Profile" };
            return <Pressable style={styles.tabButton} key={tab} onPress={() => setActiveTab(tab)}><Ionicons name={icon[tab]} size={21} color={active ? COLORS.primary : COLORS.muted} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label[tab]}</Text></Pressable>;
          })}
          <Pressable style={styles.cartButton} onPress={() => setShowCart(true)}><Ionicons name="bag-handle-outline" size={22} color={COLORS.surface} />{cart.length > 0 && <View style={styles.cartCount}><Text style={styles.cartCountText}>{cart.length}</Text></View>}</Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FoodCard({ item, onAdd, added }: { item: MenuItem; onAdd: () => void; added: boolean }) {
  return <View style={styles.foodCard}><View style={[styles.foodImage, { backgroundColor: item.color }]}><View style={styles.imageAccent} /><Ionicons name={item.icon} size={38} color={COLORS.foreground} /><View style={styles.popularPill}><Text style={styles.popularText}>POPULAR</Text></View></View><Text style={styles.foodName}>{item.name}</Text><Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text><View style={styles.foodFooter}><Text style={styles.foodPrice}>{formatPrice(item.price)}</Text><Pressable style={[styles.addButton, added && styles.addButtonAdded]} onPress={onAdd}><Ionicons name={added ? "checkmark" : "add"} size={18} color={added ? COLORS.primary : COLORS.surface} /></Pressable></View></View>;
}

function MenuRow({ item, onAdd, added }: { item: MenuItem; onAdd: () => void; added: boolean }) {
  return <View style={styles.menuRow}><View style={[styles.menuThumb, { backgroundColor: item.color }]}><Ionicons name={item.icon} size={25} color={COLORS.foreground} /></View><View style={styles.menuRowCopy}><View style={styles.menuRowTitleLine}><Text style={styles.menuRowName}>{item.name}</Text>{item.popular && <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>FAVOURITE</Text></View>}</View><Text style={styles.menuRowDescription} numberOfLines={2}>{item.description}</Text><Text style={styles.menuRowPrice}>{formatPrice(item.price)}</Text></View><Pressable style={[styles.rowAddButton, added && styles.rowAddButtonAdded]} onPress={onAdd}><Ionicons name={added ? "checkmark" : "add"} size={19} color={added ? COLORS.primary : COLORS.surface} /></Pressable></View>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  appShell: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.background },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  brandName: { fontSize: 14, letterSpacing: 1.8, color: COLORS.foreground, fontWeight: "800" },
  brandSubline: { fontSize: 8, letterSpacing: 1.5, color: COLORS.muted, marginTop: 2, fontWeight: "600" },
  bellButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  notificationDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warning, position: "absolute", top: 10, right: 10, borderWidth: 1, borderColor: COLORS.surface },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 115 },
  heroCard: { minHeight: 275, borderRadius: 26, backgroundColor: COLORS.primary, overflow: "hidden", flexDirection: "row", marginBottom: 28 },
  heroCopy: { flex: 1.15, padding: 22, zIndex: 1 },
  eyebrow: { fontSize: 9, letterSpacing: 1.7, color: "#B7D5CE", fontWeight: "800", marginBottom: 15 },
  heroTitle: { color: COLORS.surface, fontSize: 29, lineHeight: 33, fontWeight: "800", letterSpacing: -0.7 },
  heroBody: { color: "#C9E0DB", fontSize: 12, lineHeight: 17, marginTop: 12, maxWidth: 188 },
  primaryButton: { marginTop: 22, alignSelf: "flex-start", backgroundColor: COLORS.surface, borderRadius: 22, paddingVertical: 11, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 8 },
  primaryButtonText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  heroIllustration: { flex: 0.85, backgroundColor: "#3A8277", position: "relative", overflow: "hidden" },
  sun: { width: 145, height: 145, borderRadius: 75, backgroundColor: "#D6C48A", position: "absolute", top: 27, right: -27, opacity: 0.8 },
  illustrationPlate: { width: 142, height: 142, borderRadius: 80, backgroundColor: "#F0D6A0", position: "absolute", top: 72, right: 13, justifyContent: "center", alignItems: "center", transform: [{ rotate: "-15deg" }] },
  plateInner: { width: 110, height: 110, borderRadius: 60, backgroundColor: "#C67456", borderWidth: 6, borderColor: "#F6EBD0" },
  illustrationLeafOne: { width: 65, height: 17, backgroundColor: "#1F514B", borderRadius: 50, position: "absolute", bottom: 25, right: 104, transform: [{ rotate: "-34deg" }] },
  illustrationLeafTwo: { width: 60, height: 16, backgroundColor: "#214F45", borderRadius: 50, position: "absolute", bottom: 47, right: 130, transform: [{ rotate: "25deg" }] },
  illustrationText: { position: "absolute", bottom: 15, right: 16, color: "#D9E9DE", fontSize: 9, letterSpacing: 1.3, fontWeight: "700" },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { color: COLORS.foreground, fontSize: 17, fontWeight: "800", letterSpacing: -0.2 },
  sectionSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  linkText: { color: COLORS.primary, fontSize: 11, fontWeight: "800", paddingBottom: 2 },
  categoryRow: { gap: 12, paddingBottom: 30 },
  categoryCard: { width: 98, height: 108, padding: 12, borderRadius: 17, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: "space-between" },
  categoryIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#E4F0EA", justifyContent: "center", alignItems: "center" },
  categoryLabel: { fontSize: 12, color: COLORS.foreground, fontWeight: "800" },
  categoryArrow: { position: "absolute", right: 11, bottom: 12, transform: [{ rotate: "45deg" }] },
  foodRow: { gap: 15, paddingBottom: 28 },
  foodCard: { width: 190, backgroundColor: COLORS.surface, borderRadius: 18, padding: 10, borderWidth: 1, borderColor: COLORS.border },
  foodImage: { height: 126, borderRadius: 13, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  imageAccent: { position: "absolute", width: 130, height: 130, borderRadius: 70, borderWidth: 16, borderColor: "rgba(255,255,255,0.28)", top: -34, right: -26 },
  popularPill: { position: "absolute", top: 9, left: 9, backgroundColor: "rgba(255,255,255,0.75)", borderRadius: 9, paddingHorizontal: 7, paddingVertical: 4 },
  popularText: { color: COLORS.foreground, fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  foodName: { fontSize: 13, color: COLORS.foreground, fontWeight: "800", marginTop: 11 },
  foodDescription: { fontSize: 10, color: COLORS.muted, lineHeight: 14, marginTop: 4, minHeight: 28 },
  foodFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  foodPrice: { color: COLORS.primary, fontSize: 14, fontWeight: "900" },
  addButton: { width: 30, height: 30, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  addButtonAdded: { backgroundColor: "#E4F0EA" },
  infoBanner: { backgroundColor: COLORS.cream, borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F8F3E8", justifyContent: "center", alignItems: "center" },
  infoCopy: { flex: 1 },
  infoTitle: { color: COLORS.foreground, fontWeight: "800", fontSize: 12 },
  infoBody: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  pageHeading: { marginTop: 8, marginBottom: 22 },
  pageTitle: { fontSize: 30, lineHeight: 34, color: COLORS.foreground, fontWeight: "800", letterSpacing: -0.8 },
  pageSubtitle: { fontSize: 13, color: COLORS.muted, marginTop: 6 },
  searchBox: { height: 48, borderRadius: 14, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 9 },
  searchInput: { flex: 1, color: COLORS.foreground, fontSize: 13 },
  filterRow: { gap: 9, paddingVertical: 18 },
  filterChip: { height: 35, paddingHorizontal: 13, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, flexDirection: "row", alignItems: "center", gap: 6 },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.primary, fontSize: 11, fontWeight: "800" },
  filterTextActive: { color: COLORS.surface },
  menuList: { gap: 12 },
  menuRow: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 17, padding: 11, flexDirection: "row", alignItems: "center", gap: 11 },
  menuThumb: { width: 70, height: 70, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  menuRowCopy: { flex: 1 },
  menuRowTitleLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuRowName: { color: COLORS.foreground, fontWeight: "800", fontSize: 13, flexShrink: 1 },
  menuRowDescription: { color: COLORS.muted, fontSize: 10, lineHeight: 14, marginTop: 4 },
  menuRowPrice: { color: COLORS.primary, fontSize: 13, fontWeight: "900", marginTop: 6 },
  miniBadge: { paddingHorizontal: 5, paddingVertical: 3, backgroundColor: "#F6EBD9", borderRadius: 5 },
  miniBadgeText: { color: COLORS.warning, fontSize: 6, letterSpacing: 0.5, fontWeight: "900" },
  rowAddButton: { width: 32, height: 32, borderRadius: 11, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  rowAddButtonAdded: { backgroundColor: "#E4F0EA" },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { color: COLORS.foreground, fontSize: 15, fontWeight: "800", marginTop: 12 },
  emptyBody: { color: COLORS.muted, fontSize: 12, marginTop: 5 },
  reservationHero: { backgroundColor: COLORS.primary, borderRadius: 22, padding: 22, marginBottom: 25 },
  reservationBadge: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#F7E6D6", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  reservationQuote: { color: COLORS.surface, fontSize: 21, lineHeight: 26, fontWeight: "800", letterSpacing: -0.4 },
  reservationNote: { color: "#C9E0DB", fontSize: 11, lineHeight: 16, marginTop: 9, maxWidth: 260 },
  formLabel: { color: COLORS.muted, fontSize: 10, letterSpacing: 1.3, fontWeight: "900", marginBottom: 10, marginTop: 10 },
  optionRow: { gap: 9, flexDirection: "row", flexWrap: "wrap", marginBottom: 14 },
  optionButton: { height: 43, paddingHorizontal: 13, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, flexDirection: "row", alignItems: "center", gap: 7 },
  optionButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionText: { color: COLORS.foreground, fontSize: 11, fontWeight: "800" },
  optionTextActive: { color: COLORS.surface },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 12 },
  timeButton: { width: "47%", height: 42, borderRadius: 13, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center" },
  timeButtonActive: { backgroundColor: "#E4F0EA", borderColor: COLORS.primary },
  timeText: { color: COLORS.foreground, fontSize: 12, fontWeight: "800" },
  timeTextActive: { color: COLORS.primary },
  reserveButton: { height: 52, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, marginTop: 20 },
  reserveButtonText: { color: COLORS.surface, fontWeight: "900", fontSize: 13 },
  smallNote: { color: COLORS.muted, fontSize: 10, textAlign: "center", lineHeight: 15, marginTop: 13 },
  profileCard: { backgroundColor: COLORS.surface, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 15, flexDirection: "row", alignItems: "center", gap: 11 },
  avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: "#D9B39B", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 19, color: COLORS.foreground, fontWeight: "900" },
  profileCopy: { flex: 1 },
  profileName: { color: COLORS.foreground, fontWeight: "800", fontSize: 13 },
  profileMeta: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  statsRow: { backgroundColor: COLORS.surface, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, marginVertical: 18, paddingVertical: 16, flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { color: COLORS.primary, fontSize: 18, fontWeight: "900" },
  statLabel: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  profileRow: { backgroundColor: COLORS.surface, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginTop: 10, flexDirection: "row", alignItems: "center", gap: 11 },
  profileRowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#E4F0EA", justifyContent: "center", alignItems: "center" },
  profileRowCopy: { flex: 1 },
  profileRowLabel: { color: COLORS.foreground, fontSize: 12, fontWeight: "800" },
  profileRowDetail: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  cartOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 10, justifyContent: "flex-end" },
  overlayTap: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(33,48,45,0.4)" },
  cartSheet: { backgroundColor: COLORS.background, borderTopLeftRadius: 27, borderTopRightRadius: 27, padding: 22, paddingBottom: 35, minHeight: 250 },
  sheetHandle: { alignSelf: "center", width: 38, height: 4, borderRadius: 4, backgroundColor: COLORS.border, marginBottom: 18 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  sheetTitle: { color: COLORS.foreground, fontSize: 20, fontWeight: "900" },
  sheetSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  emptyCart: { alignItems: "center", paddingVertical: 28 },
  cartRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  cartThumb: { width: 43, height: 43, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  cartItemCopy: { flex: 1 },
  cartItemName: { color: COLORS.foreground, fontSize: 12, fontWeight: "800" },
  cartItemPrice: { color: COLORS.primary, fontSize: 11, fontWeight: "800", marginTop: 3 },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 15, marginTop: 4, flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { color: COLORS.foreground, fontSize: 13, fontWeight: "800" },
  totalValue: { color: COLORS.primary, fontSize: 17, fontWeight: "900" },
  checkoutButton: { height: 49, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, marginTop: 16 },
  checkoutText: { color: COLORS.surface, fontSize: 12, fontWeight: "900" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 79, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 10 },
  tabButton: { width: 60, alignItems: "center", gap: 4 },
  tabLabel: { color: COLORS.muted, fontSize: 9, fontWeight: "700" },
  tabLabelActive: { color: COLORS.primary, fontWeight: "900" },
  cartButton: { width: 47, height: 47, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginLeft: 4 },
  cartCount: { position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.warning, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: COLORS.surface },
  cartCountText: { color: COLORS.surface, fontSize: 9, fontWeight: "900" },
});
