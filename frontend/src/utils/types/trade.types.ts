export interface TradeResponse {
    trades: Array<TradeType>;
}

export interface TradeType {
    comodity: string;
    date: Number;
    orderId: string;
    description: string;
    tradeVolume: Number;
    balance: Number;
    debit: Number;
    credit: Number;
}