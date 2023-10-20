import { writable } from 'svelte/store';
import axios from 'axios';
import { storable } from './storable';
import Result from 'postcss/lib/result';
import { uploadeWeeeklyFigStore } from "./weeklyFigure"
import { serverInstance } from '../utils/baseUrl';


// const baseURL: string = 'https://trade-accounting-demo.onrender.com/api/transactions';

// const baseURL: string = "http://127.0.0.1:7001/api/transactions";
const baseURL: string = '/api/inventory';


export const inventoryStore = writable({
    data: [],
    loading: false,
    message: null,
    error: false,
    success: false
});

const UploadInventoryStore = () => {


    return {
        sendFormData: async (formData: any) => {
            try {

                var appData = formData

                // console.log("From Before Upload", csvData);
                // console.log(`${baseURL}/upload`, appData);

                const { data } = await serverInstance.post(`${baseURL}/uploadFormData`, appData);

                inventoryStore.set(
                    {
                        data: data.data.data,
                        loading: false,
                        error: false,
                        message: data.message,
                        success: true
                    }
                );

                console.log(data.data.data)
            } catch (error: any) {
                inventoryStore.set(
                    {
                        data: [],
                        loading: false,
                        error: true,
                        message: error.message,//error.response.data.error,
                        success: false
                    }
                );
            }
        },
        upload: async (csvData: any) => {
            try {

                var appData = csvData

                // console.log("From Before Upload", csvData);
                // console.log(`${baseURL}/upload`, appData);

                const { data } = await serverInstance.post(`${baseURL}/upload`, appData);

                inventoryStore.set(
                    {
                        data: data.data.data,
                        loading: false,
                        error: false,
                        message: data.message,
                        success: true
                    });

            } catch (error: any) {
                inventoryStore.set(
                    {
                        data: [],
                        loading: false,
                        error: true,
                        message: error.message,//error.response.data.error,
                        success: false
                    });
            }
        },
        getAll: async () => {
            try {
                const { data } = await serverInstance.get(`${baseURL}/retrive`);

                // console.log(data);

                inventoryStore.set(
                    {
                        data: data.data.data,
                        loading: false,
                        error: false,
                        message: data.message,
                        success: true
                    });
                // console.log(inventoryStore)

            } catch (error: any) {
                inventoryStore.set(
                    {
                        data: [],
                        loading: false,
                        error: true,
                        message: error.message,//error.response.data.error,
                        success: false
                    });
            }
        },
    }
};

export const uploadInventoryStore = UploadInventoryStore();
