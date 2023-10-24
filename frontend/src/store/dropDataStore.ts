import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { serverInstance } from '../utils/baseUrl';

import { inventoryStore } from "./inventoryStore"
import { weeklyFigStore } from "./weeklyFigure"
import { transactionStore } from './transactionStrore';

// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/transactions';

// const baseURL: string = "http://127.0.0.1:7001/api/transactions";
const baseURL: string = '/api/transactions';

const ResetAll = (msg: any) => {

    inventoryStore.set({
        data: [],
        loading: false,
        error: true,
        message: msg,
        success: false
    });

    weeklyFigStore.set({
        data: [],
        loading: false,
        error: true,
        message: msg,
        success: false,
        noData: true
    });

    transactionStore.set({
        data: [],
        loading: false,
        error: true,
        message: msg,
        success: false,
        noData: true
    });

}


const DropDataStore = () => {

    return {

        delete: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/DROP_ALL_DATA`);

                ResetAll(data.message)

            } catch (error: any) {

                ResetAll(error.message)

            }
        },
    }
};

export const dropDataStore = DropDataStore();