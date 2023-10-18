import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { serverInstance } from '../utils/baseUrl';


// const baseURL: string = "http://127.0.0.1:7001/api/startingcapital"
// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/startingcapital';
const baseURL: string = '/api/startingcapital';

export const capitalStore = writable({
    data: [],
    loading: false,
    message: null,
    error: false,
    success: false
});

const StartingCapitalStore = () => {


    capitalStore.subscribe(($capitalStore) => $capitalStore);


    return {
        send: async (formData: any) => {
            try {


                let store;
                capitalStore.subscribe(async ($capitalStore) => { store = $capitalStore });



                const { data } = await serverInstance.post(`${baseURL}/`, formData);

                capitalStore.set({
                    data: data.data.data,
                    loading: false,
                    error: false,
                    message: data.message,
                    success: true
                });

            } catch (error: any) {
                capitalStore.set({
                    data: [],
                    loading: false,
                    error: true,
                    message: error.message,//error.response.data.error,
                    success: false
                });
            }
        },
        getCapitalData: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/`);

                capitalStore.set({
                    data: data.data.data,
                    loading: false,
                    error: false,
                    message: data.message,
                    success: true
                });

            } catch (error: any) {
                capitalStore.set({
                    data: [],
                    loading: false,
                    error: true,
                    message: error.message,// error.response.data.error,
                    success: false
                });
            }
        },
    }
};

export const initalCapitalStore = StartingCapitalStore();
