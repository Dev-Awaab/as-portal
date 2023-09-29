import { HttpStatusCode } from "../../types";
import { CapitalType } from "../../types/capital.type";
import { APIError } from "../../utils";
import { create, find } from "./capital.repository";

class TradeService {


    static async createNewInitialCapital(data: CapitalType): Promise<CapitalType> {

        const createCapital = await create({
            ...data
        });


        return {
            year: createCapital.year,
            initalCapital: createCapital.initalCapital
        }
    };


    static async GetAllCapital() {
        const capital = await find();

        return { data: capital };
    }

}

export default TradeService;
