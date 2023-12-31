import { writable } from 'svelte/store';
// import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { serverInstance } from '../utils/baseUrl';


// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/performace';
const baseURL: string = '/api/performace';

export const performaceStore = writable([]);

const CreatePerformaceStore = () => {


    performaceStore.subscribe(($performaceStore) => $performaceStore);


    return {
        sendData: async (formData: any) => {
            try {


                performaceStore.subscribe(async ($performaceStore) => { });

                function deleteIfExist(sourceArray: any, targetArray: any) {

                    if (targetArray.length == 0) {
                        return sourceArray;
                    }

                    for (let i = 0; i < targetArray.length; i++) {
                        for (let j = 0; j < sourceArray.length; j++) {

                            if (targetArray[i].DATE == sourceArray[j].DATE) {

                                sourceArray.splice(j, 1);
                            }
                        }
                    }

                    return sourceArray
                }

                let store;
                performaceStore.subscribe(async ($performaceStore) => { store = $performaceStore });

                let filterList = deleteIfExist(formData, store)

                console.log(formData)

                if (filterList.length != 0) {
                    const { data } = await serverInstance.post(`${baseURL}/`, formData);

                    performaceStore.set(data.data);
                }

            } catch (error: any) {
                performaceStore.set([]);
            }
        },
        getPerformaceData: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/`);

                performaceStore.set(data.data.data);

            } catch (error: any) {
                performaceStore.set([]);
            }
        },
    }
};

export const createPerformaceStore = CreatePerformaceStore();
