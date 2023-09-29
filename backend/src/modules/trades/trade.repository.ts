import { TradeType } from "../../types/trade.types";
import Trade from "./trade.model";

/**
 * Create a new user
 * @param data User data including name, email, and password
 * @returns Promise<UserResponse>
 */
export const create = async (data: TradeType): Promise<TradeType> => {
    return await Trade.create(data) as unknown as TradeType;
};

export const find = async (data: TradeType): Promise<TradeType> => {
    const query = {
        $or: [{ ORDERID: data.ORDERID }],
    };

    return (await Trade.find()) as unknown as TradeType;
};

export const findByDate = async (data: TradeType): Promise<TradeType> => {
    const query = {
        $or: [{ DATE: data.DATE }],
    };

    return (await Trade.find()) as unknown as TradeType;
};

export const findAll = async (): Promise<TradeType> => {

    return (await Trade.find({})) as unknown as TradeType;
};
