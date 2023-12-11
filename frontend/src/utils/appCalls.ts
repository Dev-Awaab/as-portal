import axios from 'axios';
import { serverInstance } from './baseUrl';

const url: string = '/api/weeklyfigures/retrive';

export async function retrive() {
	const { data } = await axios.get(
		`https://trade-accounting-demo.onrender.com/api/transactions/monthfigures`
	);

	return data.data;
}
