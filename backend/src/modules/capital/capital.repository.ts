import { CapitalType } from "../../types/capital.type";
import Capital from "./capital.model";

export const create = async (data: CapitalType): Promise<CapitalType> => {
    return await Capital.create(data) as unknown as CapitalType;
};

export const find = async (): Promise<CapitalType> => {

    return (await Capital.find({})) as unknown as CapitalType;
};
