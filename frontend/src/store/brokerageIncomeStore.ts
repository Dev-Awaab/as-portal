import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { serverInstance } from '../utils/baseUrl';


const baseURL: string = '/api/transactions';


export const brokerageIncomeStore = writable({
    data: [],
    loading: false,
    message: null,
    error: false,
    success: false
});

const BrokerageIncomeStore = () => {

    return {

        get: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/brokerageIncome`);
                // console.log(data);

                brokerageIncomeStore.set({
                    data: data.data.data,
                    loading: false,
                    error: false,
                    message: data.message,
                    success: true
                });

            } catch (error: any) {
                brokerageIncomeStore.set({
                    data: [],
                    loading: false,
                    error: true,
                    message: error.response.data.error,
                    success: false
                });
            }
        },
    }
};

export const BrokerageStore = BrokerageIncomeStore();
