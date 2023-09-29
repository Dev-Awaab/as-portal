import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';


const baseURL: string = 'http://localhost:7001/api/startingcapital';

export const capitalStore = writable([]);

const StartingCapitalStore = () => {


    capitalStore.subscribe(($capitalStore) => $capitalStore);


    return {
        send: async (formData: any) => {
            try {


                let store;
                capitalStore.subscribe(async ($capitalStore) => { store = $capitalStore });

                // console.log("-------", store)
                // console.log('++++++++++', formData)

                const { data } = await axios.post(`${baseURL}/`, formData);

                capitalStore.set(data.data);

            } catch (error: any) {
                capitalStore.set([]);
            }
        },
        getCapitalData: async () => {
            try {
                const { data } = await axios.get(`${baseURL}/`);

                capitalStore.set(data.data.data);

            } catch (error: any) {
                capitalStore.set([]);
            }
        },
    }
};

export const initalCapitalStore = StartingCapitalStore();
