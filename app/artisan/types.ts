export interface Job {
  id: string;
  title: string;
  location: string;
  amount: string;
  icon: any; // MaterialCommunityIcons name
  status?: "Pending" | "In Progress" | "Completed" | "Cancelled";
  date?: string;
  client?: {
    name: string;
    avatar: any;
    contact?: string;
  };
  description?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: string;
  date: string;
  type: "credit" | "debit";
}

export default function Types() { return null; }
