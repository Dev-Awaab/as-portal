import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';

type AuthStateType = {
    user: TradeResponse | null;
    loading: boolean;
    message: string | null;
    error: boolean;
    success: boolean;
};

export interface TradeResponse {
    trades: Array<TradeType>;
}

export interface TradeType {
    comodity: string;
    date: Number;
    orderId: Number;
    description: string;
    tradeVolume: Number;
    balance: Number;
    debit: Number;
    credit: Number;
}


const baseURL: string = 'http://localhost:7001/api/trades';

export const tradeStore = writable([]);

const UploadTradesStore = () => {


    tradeStore.subscribe(($tradeStroe) => $tradeStroe);


    return {
        upload: async (csvData: any) => {
            try {

                csvData.forEach((element: any) => {

                    const inputString = element.DESCRIPTION;
                    const regex = /tid is (\d+)/;
                    const match = inputString.match(regex);

                    const SecondString = element.DESCRIPTION;
                    const regexForVolume = /1 out of (\d+)/;
                    const matchForVolume = SecondString.match(regexForVolume);


                    if (match) {
                        const tidNumber = Number(match[1]);
                        // console.log(tidNumber);
                        element.ORDERID = tidNumber;
                    } else {
                        element.ORDERID = 0;
                        console.log("No match found for ORDERID.");
                    }

                    if (matchForVolume) {
                        const volumeNumber = Number(matchForVolume[1]);
                        // console.log(volumeNumber);
                        element.TRADEVOLUME = volumeNumber;
                    } else {
                        element.TRADEVOLUME = 0;
                        console.log("No match found for Volume Data.");
                    }
                });

                function deleteIfExist(sourceArray: any, targetArray: any) {

                    if (targetArray.length == 0) {
                        return sourceArray;
                    }

                    for (let i = 0; i < targetArray.length; i++) {
                        for (let j = 0; j < sourceArray.length; j++) {

                            if (targetArray[i].ORDERID == sourceArray[j].ORDERID) {

                                sourceArray.splice(j, 1);
                            }
                        }
                    }
                    // console.log("Source Array ", sourceArray)
                    // console.log("Target Array ", targetArray)
                    return sourceArray
                }

                let tradeStoreData;
                tradeStore.subscribe(async ($tradeStore) => { tradeStoreData = $tradeStore });

                let filterList = deleteIfExist(csvData, tradeStoreData)
                // console.log("Sending Filtered List", filterList)

                if (filterList.length != 0) {

                    console.log("Sending Filtered List", filterList)

                    const { data } = await axios.post(`${baseURL}/upload`, filterList);
                    console.log(data);

                    tradeStore.set(data.data);
                }


            } catch (error: any) {
                tradeStore.set([]);
            }
        },
        getAll: async () => {
            try {
                const { data } = await axios.get(`${baseURL}/retrive`);
                // console.log(data);

                tradeStore.set(data.data.data);

            } catch (error: any) {
                tradeStore.set([]);
            }
        },
    }
};

export const uploadTradesStore = UploadTradesStore();
