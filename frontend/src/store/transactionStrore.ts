import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { uploadeWeeeklyFigStore } from "./weeklyFigure"
import { serverInstance } from '../utils/baseUrl';

// export interface TradeResponse {
//     trades: Array<TradeType>;
// }

// export interface TradeType {
//     comodity: string;
//     date: Number;
//     orderId: Number;
//     description: string;
//     tradeVolume: Number;
//     balance: Number;
//     debit: Number;
//     credit: Number;
// }


// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/transactions';

// const baseURL: string = "http://127.0.0.1:7001/api/transactions";
const baseURL: string = '/api/transactions';


export const transactionStore = writable({
    data: [],
    loading: false,
    message: null,
    error: false,
    success: false,
    noData: false,
});

const UploadTransactionStore = () => {


    // transactionStore.subscribe(($transactionStore) => $transactionStore);


    return {
        upload: async (csvData: any, formData: any) => {
            try {


                csvData = [...csvData]

                var appData = { csvData, formData }//[...csvData, { formData }]

                // console.log("From Before Upload", data);
                console.log(`${baseURL}/upload`, appData);

                const { data } = await serverInstance.post(`${baseURL}/upload`, appData);

                // console.log("After Upload Before Upload", data.data);

                transactionStore.set({
                    data: data.data.data,
                    loading: false,
                    error: false,
                    message: data.message,
                    success: true,
                    noData: data.data.data.length > 0 ? false : true
                });

                // await uploadeWeeeklyFigStore.get()

            } catch (error: any) {
                transactionStore.set({
                    data: [],
                    loading: false,
                    error: true,
                    message: error.message, //error.response.data.error,
                    success: false,
                    noData: true
                });
            }
        },
        getAll: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/retrive`);
                // console.log(data);

                transactionStore.set({
                    data: data.data.data,
                    loading: false,
                    error: false,
                    message: data.message,
                    success: true,
                    noData: data.data.data.length > 0 ? false : true
                });

            } catch (error: any) {
                transactionStore.set({
                    data: [],
                    loading: false,
                    error: true,
                    message: error.message,//error.response.data.error,
                    success: false,
                    noData: true
                });
            }
        },
    }
};

export const uploadTransactionStore = UploadTransactionStore();
