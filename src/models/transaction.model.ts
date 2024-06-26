export interface Transaction {
    id?: string | null;
    date: string;
    description: string;
    amount: number;
    type: string;
    repeat: string;
    walletId: number;
    categoryId?: number;
    active: boolean;
    next_date?: string;
}