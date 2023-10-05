import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { serverInstance } from '../utils/baseUrl';


// const baseURL: string = "http://127.0.0.1:7001/api/startingcapital"
// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/startingcapital';
const baseURL: string = '/api/startingcapital';

export const capitalStore = writable([]);

const StartingCapitalStore = () => {


    capitalStore.subscribe(($capitalStore) => $capitalStore);


    return {
        send: async (formData: any) => {
            try {


                let store;
                capitalStore.subscribe(async ($capitalStore) => { store = $capitalStore });



                const { data } = await serverInstance.post(`${baseURL}/`, formData);

                capitalStore.set(data.data);

            } catch (error: any) {
                capitalStore.set([]);
            }
        },
        getCapitalData: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/`);

                capitalStore.set(data.data.data);

            } catch (error: any) {
                capitalStore.set([]);
            }
        },
    }
};

export const initalCapitalStore = StartingCapitalStore();
