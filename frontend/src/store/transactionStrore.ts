import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { uploadeWeeeklyFigStore } from "./weeklyFigure"
import { serverInstance } from '../utils/baseUrl';
import { BrokerageStore } from './brokerageIncomeStore';
import { uploadInventoryStore } from './inventoryStore';
// import FormData from 'form-data';
// const fs = require('fs');


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

                // csvData = [...csvData]

                var appData = { csvData, formData }//[...csvData, { formData }]

                // console.log("From Before Upload", data);


                let _formData = new FormData();
                _formData.append("file", csvData);

                _formData.append("securities_balance", formData.securities_balance);
                _formData.append("securities_inLien", formData.securities_inLien);
                _formData.append("cash_inLien", formData.cash_inLien);






                console.log(`${baseURL}/------------`, _formData);
                console.log(`${baseURL}/upload`, _formData.getAll('csvFile'));


                // const { data } = await axios.post(`${baseURL}/upload`, _formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }
                // })

                const url = " http://127.0.0.1:7001/api/transactions/upload"
                const response = await fetch(`${url}`, {
                    method: 'POST',
                    body: _formData,
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    // },
                })

                const data = await response.json()

                console.log('{{{{{{{{{{{ ', data)

                // const { data } = await serverInstance.post(`${baseURL}/upload`,
                //     _formData,
                // );

                console.log("After Upload Before Upload", data.data);
                console.log("After Upload Before Upload", response);

                if (!response.ok) {
                    console.log('is not ok......')
                    transactionStore.set({
                        data: [],
                        loading: false,
                        error: true,
                        message: data.message, //error.response.data.error,
                        success: false,
                        noData: true
                    });

                } else {

                    transactionStore.set({
                        data: data.data.data,
                        loading: false,
                        error: false,
                        message: data.message,
                        success: true,
                        noData: data.data.data.length > 0 ? false : true
                    });

                    await uploadeWeeeklyFigStore.get()
                    await BrokerageStore.get();
                    await uploadInventoryStore.getAll();
                }


            } catch (error: any) {
                // console.log(error.message)
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
