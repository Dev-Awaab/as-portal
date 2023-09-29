import { HttpStatusCode } from "../../types";
import { TradeType } from '../../types/trade.types';
import { APIError } from "../../utils";
import { create, findAll, find } from "./trade.repository";

class TradeService {
    static async createTradeFromUploadService(data: Array<TradeType>) {

        try {
            data.forEach(async (element) => {

                const trade = await find(element);

                // console.log("A Trade element")
                // console.log(trade)
                // if (trade.ORDERID != element.ORDERID && trade.DATE != element.DATE) {
                //     console.log("ID creation")
                //     console.log(trade.ORDERID)
                //     console.log(element.ORDERID)
                //     console.log("DATE creation")
                //     console.log(trade.DATE)
                //     console.log(element.DATE)

                //     console.log("Before creation")
                //     this.createTradeService(element)
                // }
                // console.log(trade)
                if (trade.ORDERID == undefined) {
                    console.log("Before creation")
                    this.createTradeService(element)
                }

            });

            return { data };
        } catch (e) {
            throw new APIError(
                "INVALID",
                HttpStatusCode.BAD_GATEWAY,
                "Trade Entry already exists"
            );
        }
    }

    static async createTradeService(data: TradeType): Promise<TradeType> {

        const createTrade = await create({
            ...data
        });

        return {
            COMMODITY: createTrade.COMMODITY,
            DATE: createTrade.DATE,
            ORDER: createTrade.ORDER,
            ORDERID: createTrade.ORDERID,
            DESCRIPTION: createTrade.DESCRIPTION,
            TRADEVOLUME: createTrade.TRADEVOLUME,
            BALANCE: createTrade.BALANCE,
            DEBIT: createTrade.DEBIT,
            CREDIT: createTrade.CREDIT,
        };
    }

    static async RetriveAllTrades() {
        const trades = await findAll();

        return { data: trades };
    }

}

export default TradeService;
