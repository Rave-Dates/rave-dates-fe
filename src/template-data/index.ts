const flyers = ["/images/flyer-1.png", "/images/flyer-2.png", "/images/flyer-3.png"]

export const events: IEventCard[] = [
  {
    id: 1,
    name: "dyen",
    artist: "Pawloski",
    date: "Sábado, 02 de mayo",
    location: "Bogotá, CO",
    venue: "Movistar Arena",
    price: 45,
    currency: "$",
    labels: ["Estacionamiento", "Bar/DJ", " Alcancia", "+21", "Al aire libre"],
    genres: ["Hard Techno", "Hardcore"],
    images: flyers,
    hasPaymentOptions: true,
    status: "paid"
  },
  {
    id: 2,
    name: "feuer",
    artist: "Electronic Vibes",
    date: "Viernes, 08 de mayo",
    location: "Medellín, CO",
    venue: "Coliseo Cubierto",
    price: 35,
    currency: "$",
    labels: ["Estacionamiento", "Barra libre", " Alcancia", "+25", "Cerrado"],
    genres: ["Electronica", "House"],
    images: flyers,
    hasPaymentOptions: true,
    status: "pending"
  },
  {
    id: 3,
    name: "alison",
    artist: "Night Beats",
    date: "Domingo, 10 de mayo",
    location: "Cali, CO",
    venue: "Teatro Municipal",
    price: 50,
    currency: "$",
    labels: [
      "Sin estacionamiento",
      "Bar/DJ",
      " Alcancia",
      "+16",
      "Al aire libre",
    ],
    genres: ["Trap", "Hardcore"],
    images: flyers,
    hasPaymentOptions: false,
    status: "paid"
  },
  {
    id: 4,
    name: "algo",
    artist: "Techno Masters",
    date: "Jueves, 14 de mayo",
    location: "Cartagena, CO",
    venue: "Centro de Convenciones",
    price: 40,
    currency: "$",
    labels: ["Estacionamiento", "Bar/DJ", " Alcancia", "+21", "Al aire libre"],
    genres: ["Hard Techno", "Hardcore"],
    images: flyers,
    hasPaymentOptions: true,
    status: "paid"
  },
  {
    id: 5,
    name: "night",
    artist: "Bass Revolution",
    date: "Sábado, 16 de mayo",
    location: "Barranquilla, CO",
    venue: "Estadio Metropolitano",
    price: 55,
    currency: "$",
    labels: ["Estacionamiento", "Bar/DJ", " Alcancia", "+21", "Al aire libre"],
    genres: ["Hard Techno", "Hardcore"],
    images: flyers,
    hasPaymentOptions: true,
    status: "paid"
  },
  {
    id: 6,
    name: "show",
    artist: "Underground Collective",
    date: "Viernes, 22 de mayo",
    location: "Bucaramanga, CO",
    venue: "Palacio de Deportes",
    price: 38,
    currency: "$",
    labels: ["Estacionamiento", "Bar/DJ", " Alcancia", "+21", "Al aire libre"],
    genres: ["Hard Techno", "Hardcore"],
    images: flyers,
    hasPaymentOptions: false,
    status: "paid"
  },
];

export const users: IUser[] = [
  { id: 1, name: "Juan Gimenez", email: "juan1@example.com", whatsapp: "+5491111110001", cedula: "12345678", role: "Org." },
  { id: 2, name: "Ana Martínez", email: "ana@example.com", whatsapp: "+5491111110002", cedula: "22345678", role: "Prom." },
  { id: 3, name: "Carlos Ruiz", email: "carlos@example.com", whatsapp: "+5491111110003", cedula: "32345678", role: "Prom." },
  { id: 4, name: "Laura Gómez", email: "laura@example.com", whatsapp: "+5491111110004", cedula: "42345678", role: "Prom." },
  { id: 5, name: "Marcos Díaz", email: "marcos@example.com", whatsapp: "+5491111110005", cedula: "52345678", role: "Prom." },
  { id: 6, name: "Lucía Fernández", email: "lucia@example.com", whatsapp: "+5491111110006", cedula: "62345678", role: "Prom." },
  { id: 7, name: "Diego López", email: "diego@example.com", whatsapp: "+5491111110007", cedula: "72345678", role: "Prom." },
  { id: 8, name: "Valentina Castro", email: "valentina@example.com", whatsapp: "+5491111110008", cedula: "82345678", role: "Prom." },
  { id: 9, name: "Emiliano Torres", email: "emi@example.com", whatsapp: "+5491111110009", cedula: "92345678", role: "Prom." },
  { id: 10, name: "Sofía Herrera", email: "sofia@example.com", whatsapp: "+5491111110010", cedula: "10345678", role: "Prom." },
  { id: 11, name: "Nicolás Ríos", email: "nico@example.com", whatsapp: "+5491111110011", cedula: "11345678", role: "Prom." },
  { id: 12, name: "Camila Vega", email: "camila@example.com", whatsapp: "+5491111110012", cedula: "12345679", role: "Prom." },
  { id: 13, name: "Agustín Morales", email: "agustin@example.com", whatsapp: "+5491111110013", cedula: "13345678", role: "Prom." },
];

export const myTickets: Ticket[] = [
  { id: 1, type: "GENERAL", userName: "Juan Gómez", actions: ["send", "download", "view"], transferred: false, price: 50000, quantity: 0 },
  { id: 2, type: "VIP", userName: "Juan Gómez", actions: ["send", "download", "view"], transferred: false, price: 70000, quantity: 0 },
  { id: 3, type: "BACKSTAGE", userName: "Paula López", actions: ["view"], transferred: true, price: 150000, quantity: 0 },
  { id: 4, type: "ULTRAVIP", userName: "Facundo Ruiz", actions: ["view"], transferred: true, price: 250000, quantity: 0 },
]


