import "../global.css";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;
type Screen = "home" | "menu" | "reserve" | "order";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: IconName;
  color: string;
};

const COLORS = {
  ivory: "#F7F7F2",
  white: "#FFFFFF",
  forest: "#21302D",
  teal: "#2A746C",
  tealDark: "#24645D",
  mint: "#E4F1EC",
  terracotta: "#CC7A50",
  terracottaSoft: "#F7E9DF",
  muted: "#7D8984",
  line: "#E8E8E1",
  pill: "#ECEDE8",
};

const dishes: Dish[] = [
  { id: 1, name: "Grilled Salmon", description: "Herb crust, lemon butter, roasted greens", price: 24, icon: "fish-outline", color: COLORS.terracottaSoft },
  { id: 2, name: "Truffle Tagliatelle", description: "Wild mushrooms, parmesan, fresh herbs", price: 19, icon: "restaurant-outline", color: COLORS.terracottaSoft },
  { id: 3, name: "Burrata & Tomatoes", description: "Creamy burrata, heirloom tomatoes, basil oil", price: 12, icon: "nutrition-outline", color: COLORS.terracottaSoft },
  { id: 4, name: "Chocolate Torte", description: "Warm chocolate, sea salt caramel, vanilla", price: 9, icon: "cafe-outline", color: COLORS.terracottaSoft },
  { id: 5, name: "Citrus Spritz", description: "Blood orange, sparkling water, rosemary", price: 7, icon: "wine-outline", color: COLORS.terracottaSoft },
];

const categories = ["All", "Mains", "Starters", "Desserts", "Drinks"];

export default function App() {
  const { width } = useWindowDimensions();
  const isCompact = width < 760;
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState("All");
  const [order, setOrder] = useState<number[]>([]);
  const [date, setDate] = useState("Sat\n14 Sep");
  const [time, setTime] = useState("8:30 PM");
  const [guests, setGuests] = useState("4 guests");
  const [specialRequests, setSpecialRequests] = useState("");

  const filteredDishes = useMemo(() => {
    if (category === "All") return dishes;
    return dishes.filter((dish) => {
      if (category === "Mains") return [1, 2].includes(dish.id);
      if (category === "Starters") return dish.id === 3;
      if (category === "Desserts") return dish.id === 4;
      return dish.id === 5;
    });
  }, [category]);

  const toggleOrder = (id: number) => {
    setOrder((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.app}>
        <Header screen={screen} orderCount={order.length} onBack={() => setScreen("home")} onOrder={() => setScreen("order")} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, isCompact && styles.contentCompact]}>
          {screen === "home" && <HomeScreen compact={isCompact} onMenu={() => setScreen("menu")} onReserve={() => setScreen("reserve")} />}
          {screen === "menu" && <MenuScreen compact={isCompact} category={category} setCategory={setCategory} dishes={filteredDishes} order={order} onAdd={toggleOrder} />}
          {screen === "reserve" && <ReserveScreen compact={isCompact} date={date} setDate={setDate} time={time} setTime={setTime} guests={guests} setGuests={setGuests} specialRequests={specialRequests} setSpecialRequests={setSpecialRequests} />}
          {screen === "order" && <OrderScreen order={order} onMenu={() => setScreen("menu")} />}
        </ScrollView>
        <View style={styles.bottomNav}>
          <Pressable style={styles.homeNavButton} onPress={() => setScreen("home")}>
            <Ionicons name="home" size={18} color={COLORS.teal} />
            <Text style={styles.homeNavText}>Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Header({ screen, orderCount, onBack, onOrder }: { screen: Screen; orderCount: number; onBack: () => void; onOrder: () => void }) {
  const titles: Record<Screen, [string, string]> = {
    home: ["Good afternoon", "Welcome back, Alex"],
    menu: ["Our menu", "Made fresh, served with heart"],
    reserve: ["Book a table", "We'll have a seat ready for you"],
    order: ["Your order", "Your basket is waiting"],
  };
  const [title, subtitle] = titles[screen];
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {screen === "home" ? <View style={styles.headerMark}><Ionicons name="restaurant" size={18} color={COLORS.white} /></View> : <Pressable style={styles.backButton} onPress={onBack}><Ionicons name="arrow-back" size={21} color={COLORS.forest} /></Pressable>}
        <View>
          <Text style={styles.wordmark}>CHRISTOFFEL&apos;S</Text>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {screen !== "order" && <Pressable style={styles.orderButton} onPress={onOrder}>
        <Ionicons name="bag-handle" size={17} color={COLORS.white} />
        {orderCount > 0 && <View style={styles.orderBadge}><Text style={styles.orderBadgeText}>{orderCount}</Text></View>}
      </Pressable>}
    </View>
  );
}

function HomeScreen({ compact, onMenu, onReserve }: { compact: boolean; onMenu: () => void; onReserve: () => void }) {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>A TASTE OF HOME</Text>
          <Text style={styles.heroTitle}>Good food, good mood.</Text>
          <Text style={styles.heroDescription}>Seasonal plates, made with care and served with warmth.</Text>
        </View>
        <View style={styles.heroDecoration}><Ionicons name="restaurant-outline" size={55} color={COLORS.white} /></View>
        <Pressable style={styles.heroButton} onPress={onMenu}><Text style={styles.heroButtonText}>Explore the menu</Text><Ionicons name="arrow-forward" size={18} color={COLORS.white} /></Pressable>
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>What would you like?</Text><Text style={styles.sectionHint}>Quick actions</Text></View>
      <View style={[styles.actionGrid, compact && styles.actionGridCompact]}>
        <ActionCard icon="restaurant-outline" title="Browse menu" description="See today's favourites" color={COLORS.teal} onPress={onMenu} />
        <ActionCard icon="calendar-outline" title="Book a table" description="Reserve your spot" color={COLORS.terracotta} onPress={onReserve} />
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Your next visit</Text><Pressable><Text style={styles.manageText}>Manage</Text></Pressable></View>
      <View style={styles.visitCard}>
        <View style={styles.dateTile}><Text style={styles.dateMonth}>SEP</Text><Text style={styles.dateNumber}>13</Text></View>
        <View style={styles.visitCopy}><Text style={styles.visitTitle}>Fri, 13 Sep · 7:30 PM</Text><Text style={styles.visitDetail}>2 guests · Confirmed reservation</Text></View>
        <Ionicons name="chevron-forward" size={21} color={COLORS.muted} />
      </View>
    </View>
  );
}

function ActionCard({ icon, title, description, color, onPress }: { icon: IconName; title: string; description: string; color: string; onPress: () => void }) {
  return <Pressable style={styles.actionCard} onPress={onPress}><View style={[styles.actionIcon, { backgroundColor: color === COLORS.teal ? COLORS.mint : COLORS.terracottaSoft }]}><Ionicons name={icon} size={22} color={color} /></View><View><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDescription}>{description}</Text></View></Pressable>;
}

function MenuScreen({ compact, category, setCategory, dishes: visibleDishes, order, onAdd }: { compact: boolean; category: string; setCategory: (value: string) => void; dishes: Dish[]; order: number[]; onAdd: (id: number) => void }) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((item) => <Pressable key={item} style={[styles.categoryPill, category === item && styles.categoryPillActive]} onPress={() => setCategory(item)}><Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text></Pressable>)}
      </ScrollView>
      <Text style={styles.dishCount}>{visibleDishes.length} dishes to make your evening</Text>
      <View style={styles.dishList}>
        {visibleDishes.map((dish) => <DishRow key={dish.id} dish={dish} compact={compact} added={order.includes(dish.id)} onAdd={() => onAdd(dish.id)} />)}
      </View>
    </View>
  );
}

function DishRow({ dish, compact, added, onAdd }: { dish: Dish; compact: boolean; added: boolean; onAdd: () => void }) {
  return <View style={[styles.dishRow, compact && styles.dishRowCompact]}>
    <View style={[styles.dishIcon, { backgroundColor: dish.color }]}><Ionicons name={dish.icon} size={24} color={COLORS.terracotta} /></View>
    <View style={styles.dishCopy}><Text style={styles.dishName}>{dish.name}</Text><Text style={styles.dishDescription}>{dish.description}</Text><Pressable onPress={onAdd}><Text style={styles.addText}>{added ? "Added to order" : "Add to order"} <Text style={styles.addPlus}>{added ? "✓" : "+"}</Text></Text></Pressable></View>
    <Text style={styles.dishPrice}>R{dish.price}</Text>
  </View>;
}

function ReserveScreen({ compact, date, setDate, time, setTime, guests, setGuests, specialRequests, setSpecialRequests }: { compact: boolean; date: string; setDate: (value: string) => void; time: string; setTime: (value: string) => void; guests: string; setGuests: (value: string) => void; specialRequests: string; setSpecialRequests: (value: string) => void }) {
  const dates = ["Fri\n13 Sep", "Sat\n14 Sep", "Sun\n15 Sep"];
  const times = ["6:30 PM", "7:30 PM", "8:30 PM"];
  const guestOptions = ["2 guests", "3 guests", "4 guests"];
  return <View>
    <View style={styles.reserveCard}>
      <ChoiceGroup label="DATE" options={dates} selected={date} onSelect={setDate} compact={compact} />
      <ChoiceGroup label="TIME" options={times} selected={time} onSelect={setTime} compact={compact} />
      <ChoiceGroup label="NUMBER OF GUESTS" options={guestOptions} selected={guests} onSelect={setGuests} compact={compact} />
      <Text style={styles.formLabel}>SPECIAL REQUESTS <Text style={styles.optionalLabel}>(OPTIONAL)</Text></Text>
      <TextInput style={styles.requestInput} value={specialRequests} onChangeText={setSpecialRequests} placeholder="Allergies, celebrations, seating preferences..." placeholderTextColor="#B2B7B2" multiline textAlignVertical="top" />
    </View>
    <Pressable style={styles.confirmButton} onPress={() => undefined}><Text style={styles.confirmText}>Confirm reservation</Text><Ionicons name="checkmark" size={20} color={COLORS.white} /></Pressable>
  </View>;
}

function ChoiceGroup({ label, options, selected, onSelect, compact }: { label: string; options: string[]; selected: string; onSelect: (value: string) => void; compact: boolean }) {
  return <View style={styles.choiceGroup}><Text style={styles.formLabel}>{label}</Text><View style={[styles.choiceRow, compact && styles.choiceRowCompact]}>{options.map((option) => <Pressable key={option} style={[styles.choice, selected === option && styles.choiceSelected]} onPress={() => onSelect(option)}><Text style={[styles.choiceText, selected === option && styles.choiceTextSelected]}>{option}</Text></Pressable>)}</View></View>;
}

function OrderScreen({ order, onMenu }: { order: number[]; onMenu: () => void }) {
  if (order.length === 0) return <View style={styles.emptyOrder}><View style={styles.emptyBag}><Ionicons name="bag-handle" size={28} color={COLORS.terracotta} /></View><Text style={styles.emptyTitle}>Your order is empty</Text><Text style={styles.emptyDescription}>Add something delicious from our menu.</Text><Pressable style={styles.browseButton} onPress={onMenu}><Text style={styles.browseText}>Browse menu</Text></Pressable></View>;
  return <View style={styles.orderFilled}><Text style={styles.orderFilledTitle}>Your order</Text><Text style={styles.orderFilledSubtitle}>{order.length} item{order.length === 1 ? "" : "s"} waiting for you</Text><Pressable style={styles.browseButton} onPress={onMenu}><Text style={styles.browseText}>Continue browsing</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.ivory },
  app: { flex: 1, backgroundColor: COLORS.ivory, borderTopWidth: 2, borderTopColor: COLORS.forest },
  header: { minHeight: 104, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerMark: { width: 40, height: 40, borderRadius: 13, backgroundColor: COLORS.teal, alignItems: "center", justifyContent: "center", marginTop: 4 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EDEDE7", alignItems: "center", justifyContent: "center", marginTop: 4 },
  wordmark: { color: COLORS.muted, fontWeight: "900", letterSpacing: 1.6, fontSize: 10, marginBottom: 2 },
  headerTitle: { color: COLORS.forest, fontWeight: "900", fontSize: 24, lineHeight: 28, letterSpacing: -0.5 },
  headerSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  orderButton: { width: 42, height: 42, borderRadius: 13, backgroundColor: COLORS.teal, alignItems: "center", justifyContent: "center", marginTop: 10 },
  orderBadge: { position: "absolute", top: -4, right: -4, width: 17, height: 17, borderRadius: 9, backgroundColor: COLORS.terracotta, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.ivory },
  orderBadgeText: { color: COLORS.white, fontSize: 8, fontWeight: "900" },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  contentCompact: { paddingHorizontal: 14 },
  hero: { backgroundColor: COLORS.teal, borderRadius: 27, minHeight: 250, padding: 24, overflow: "hidden", position: "relative", justifyContent: "space-between" },
  heroCopy: { zIndex: 1 },
  heroEyebrow: { color: "#C1DED7", fontSize: 11, letterSpacing: 1.6, fontWeight: "900", marginBottom: 13 },
  heroTitle: { color: COLORS.white, fontWeight: "900", fontSize: 31, lineHeight: 36, letterSpacing: -0.8 },
  heroDescription: { color: "#D3E6E1", fontSize: 13, marginTop: 9 },
  heroDecoration: { position: "absolute", right: -18, top: -24, width: 143, height: 143, borderRadius: 80, backgroundColor: COLORS.tealDark, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-12deg" }] },
  heroButton: { backgroundColor: COLORS.terracotta, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, zIndex: 1, marginTop: 25 },
  heroButtonText: { color: COLORS.white, fontSize: 14, fontWeight: "900" },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 12 },
  sectionTitle: { color: COLORS.forest, fontSize: 17, fontWeight: "900" },
  sectionHint: { color: COLORS.muted, fontSize: 12 },
  manageText: { color: COLORS.teal, fontSize: 12, fontWeight: "900" },
  actionGrid: { flexDirection: "row", gap: 14 },
  actionGridCompact: { flexDirection: "column" },
  actionCard: { flex: 1, minHeight: 118, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 15, justifyContent: "space-between" },
  actionIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  actionTitle: { color: COLORS.forest, fontWeight: "900", fontSize: 14, marginTop: 10 },
  actionDescription: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  visitCard: { minHeight: 72, backgroundColor: COLORS.white, borderRadius: 17, borderWidth: 1, borderColor: COLORS.line, padding: 13, flexDirection: "row", alignItems: "center", gap: 12 },
  dateTile: { width: 46, height: 48, borderRadius: 12, backgroundColor: COLORS.terracottaSoft, alignItems: "center", justifyContent: "center" },
  dateMonth: { color: COLORS.terracotta, fontSize: 9, fontWeight: "900", letterSpacing: 0.7 },
  dateNumber: { color: COLORS.forest, fontSize: 19, fontWeight: "900", lineHeight: 20 },
  visitCopy: { flex: 1 },
  visitTitle: { color: COLORS.forest, fontSize: 13, fontWeight: "900" },
  visitDetail: { color: COLORS.muted, fontSize: 11, marginTop: 5 },
  categoryRow: { gap: 9, paddingBottom: 16 },
  categoryPill: { backgroundColor: COLORS.pill, paddingHorizontal: 17, height: 30, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  categoryPillActive: { backgroundColor: COLORS.teal },
  categoryText: { color: COLORS.muted, fontSize: 11, fontWeight: "900" },
  categoryTextActive: { color: COLORS.white },
  dishCount: { color: COLORS.muted, fontSize: 12, marginBottom: 12 },
  dishList: { gap: 12 },
  dishRow: { minHeight: 94, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 14, flexDirection: "row", alignItems: "center", gap: 13 },
  dishRowCompact: { padding: 10, gap: 9 },
  dishIcon: { width: 52, height: 52, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  dishCopy: { flex: 1 },
  dishName: { color: COLORS.forest, fontSize: 14, fontWeight: "900" },
  dishDescription: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  addText: { color: COLORS.teal, fontSize: 11, fontWeight: "900", marginTop: 9 },
  addPlus: { fontSize: 16, lineHeight: 11 },
  dishPrice: { color: COLORS.terracotta, fontSize: 15, fontWeight: "900", alignSelf: "flex-start", marginTop: 3 },
  reserveCard: { backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, padding: 18 },
  choiceGroup: { marginBottom: 18 },
  formLabel: { color: COLORS.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginBottom: 9 },
  optionalLabel: { fontWeight: "600", letterSpacing: 0.7 },
  choiceRow: { flexDirection: "row", gap: 8 },
  choiceRowCompact: { flexDirection: "column", gap: 8 },
  choice: { flex: 1, minHeight: 46, borderRadius: 13, backgroundColor: COLORS.ivory, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "transparent" },
  choiceSelected: { backgroundColor: COLORS.mint, borderColor: "#79A89D" },
  choiceText: { color: COLORS.muted, fontSize: 11, textAlign: "center" },
  choiceTextSelected: { color: COLORS.tealDark, fontWeight: "900" },
  requestInput: { minHeight: 85, borderRadius: 13, backgroundColor: COLORS.ivory, padding: 13, color: COLORS.forest, fontSize: 12 },
  confirmButton: { height: 50, borderRadius: 14, backgroundColor: COLORS.terracotta, marginTop: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10 },
  confirmText: { color: COLORS.white, fontSize: 14, fontWeight: "900" },
  emptyOrder: { flex: 1, minHeight: 540, alignItems: "center", justifyContent: "center", paddingBottom: 45 },
  emptyBag: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginBottom: 17 },
  emptyTitle: { color: COLORS.forest, fontSize: 19, fontWeight: "900" },
  emptyDescription: { color: COLORS.muted, fontSize: 12, marginTop: 8 },
  browseButton: { backgroundColor: COLORS.terracotta, height: 49, paddingHorizontal: 20, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 23 },
  browseText: { color: COLORS.white, fontSize: 13, fontWeight: "900" },
  orderFilled: { minHeight: 540, alignItems: "center", justifyContent: "center" },
  orderFilledTitle: { color: COLORS.forest, fontSize: 22, fontWeight: "900" },
  orderFilledSubtitle: { color: COLORS.muted, fontSize: 13, marginTop: 7 },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 68, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.ivory, alignItems: "center", justifyContent: "center" },
  homeNavButton: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, paddingVertical: 9 },
  homeNavText: { color: COLORS.teal, fontSize: 12, fontWeight: "800" },
});
