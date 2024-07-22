export interface Budget {
    id?: string,
    name: string,
    description: string,
    initial_date?: string,
    end_date?: string,
    limit_amount: number,
    current_amount?: number,
    repeat: string,
    categories?: string,
    wallets?: string,
}