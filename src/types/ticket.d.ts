interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Ticket {
  id: number
  type: string
  userName: string
  actions: ("send" | "download" | "view")[]
  transferred: boolean
}