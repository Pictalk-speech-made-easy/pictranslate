
import { Gram } from './gram'; 
import * as fs from 'fs';


const gram = new Gram(); 
const gramJson = fs.readFileSync('gram.json', 'utf-8');
gram.deserialize(gramJson);

console.log(gram.get(['$START', 'I']));