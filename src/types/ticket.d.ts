interface Ticket {
  id: number
  type: string
  userName: string
  actions: ("send" | "download" | "view")[]
  transferred: boolean
  price: number;
  quantity: number;
}