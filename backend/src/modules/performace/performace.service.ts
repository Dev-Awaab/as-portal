import { HttpStatusCode } from "../../types";
import { APIError } from "../../utils";
import { create, find } from "./performace.repository";
import { PerformaceType } from "../../types/performace.type";

class PerformaceService {

    static async createPerformaceFromUploadService(data: Array<PerformaceType>) {

        try {
            data.forEach(async (element) => {

                // console.log('Creating New Capital ', element);

                this.createNewPerformace(element)

            });

            return { data };
        } catch (e) {
            throw new APIError(
                "INVALID",
                HttpStatusCode.BAD_GATEWAY,
                "already exists"
            );
        }
    }


    static async createNewPerformace(data: PerformaceType): Promise<PerformaceType> {

        const createPerformace = await create({
            ...data
        });

        // console.log('Creating New Capital ', createPerformace);

        return {
            DATE: createPerformace.DATE,
            BALANCE: createPerformace.BALANCE,
            INLEIN: createPerformace.INLEIN,
            AVAILABLECASHBALANCE: createPerformace.AVAILABLECASHBALANCE,
            PERCENTRETURN: createPerformace.PERCENTRETURN,
        }
    };


    static async GetAllPerformace() {
        const performace = await find();

        return { data: performace };
    }

}

export default PerformaceService;
