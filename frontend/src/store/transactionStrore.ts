import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';

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


const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/transactions';

// const baseURL: string = "http://127.0.0.1:7001/api/transactions";


export const transactionStore = writable([]);

const UploadTransactionStore = () => {


    // transactionStore.subscribe(($transactionStore) => $transactionStore);


    return {
        upload: async (csvData: any, formData: any) => {
            try {

                var appData = [...csvData, { formData }]

                // console.log("From Before Upload", data);
                console.log(`${baseURL}/upload`, appData);

                const data = await axios.post(`${baseURL}/upload`, appData);

                // console.log("After Upload Before Upload", data.data);

                // transactionStore.set(data.data);


            } catch (error: any) {
                transactionStore.set([]);
            }
        },
        getAll: async () => {
            try {
                const { data } = await axios.get(`${baseURL}/retrive`);
                // console.log(data);

                transactionStore.set(data.data.data);

            } catch (error: any) {
                transactionStore.set([]);
            }
        },
    }
};

export const uploadTransactionStore = UploadTransactionStore();
