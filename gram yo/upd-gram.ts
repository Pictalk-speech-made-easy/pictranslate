import { Gram } from './gram'; 
import * as fs from 'fs';


try {
    
    const gramJson = fs.readFileSync('gram.json', 'utf-8');
    const gram = new Gram(gramJson);  

    const word1 = process.argv[2];
    const word2 = process.argv[3];
    const word3 = process.argv[4];

    console.log(word1, word2, word3);

    // gram.add([word1, word2], word3);
    gram.add(['i', 'want'], 'oats'); 
    console.log(gram.get(['i', 'want']));

    const serialized = gram.serialize();
    const gram2 = new Gram(serialized);
    gram2.export();

} catch (err) {
    console.error('Error reading file:', err);
}
