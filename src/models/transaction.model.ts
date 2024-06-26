export interface Transaction {
    id?: string | null;
    date: Date | string;
    description: string;
    amount: number;
    type: string;
    repeat: string;
    walletId: number;
    categoryId?: number;
    active: boolean;
    next_date?: Date | string;
}