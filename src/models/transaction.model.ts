export interface Transaction {
    id?: string | null;
    date: Date;
    description: string;
    amount: number;
    type: string;
    repeat: string;
    walletId: number;
    categoryId?: number;
    active: boolean;
}