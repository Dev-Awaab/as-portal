import { PerformaceType } from "../../types/performace.type";
import Performace from "./performace.model";

export const create = async (data: PerformaceType): Promise<PerformaceType> => {
    return await Performace.create(data) as unknown as PerformaceType;
};

export const find = async (): Promise<PerformaceType> => {

    return (await Performace.find({})) as unknown as PerformaceType;
};