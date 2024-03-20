import * as fs from 'fs';

type Entry = {
        word: string;
        count: number;
}
function sanitize(input: string) {
        return input.normalize('NFC')
                .replace('+', '')
                .toLowerCase()
                .trim();
}
function compose(key: string[]) {
        key.forEach((key) => sanitize(key));
        return key.join('+');
}

export class Gram {
        map: Map<String, Entry[]> = new Map();
        constructor(data?: string) {
                if (data) {
                        this.deserialize(data);
                }
        }
        set(keys: string[], item: Entry[]) {
                const ckey = compose(keys);
                this.map.set(ckey, item);
        }
        add(keys: string[], word: string) {
                const ckey = compose(keys);
                const current = this.map.get(ckey) || [];
                const found = current.find(entry => entry.word === word);
                if (found) {
                        found.count++;
                } else {
                        current.push({ word, count: 1 });
                }
                this.map.set(ckey, current);
        }
        get(keys: string[]) {
                const ckey = compose(keys);
                return this.map.get(ckey);
        }
        delete(keys: string[]) {
                const ckey = compose(keys);
                return this.map.delete(ckey);
        }
        serialize() {
                try {
                        return JSON.stringify(Array.from(this.map.entries()));
                } catch (e) {
                        console.error(e);
                }
        }
        deserialize(data: string) {
                try {
                        this.map = new Map(JSON.parse(data));
                } catch (e) {
                        console.error(e);
                }
        }
        export() {
                try {
                        const gram = this.serialize();
                        if(!gram) return;
                        fs.writeFileSync('gram.json', gram);
                } catch (e) {
                        console.error(e);
                }
        } 
}

 
const gram = new Gram();

// const filePath = './BD/test-todo-sin-oraal_uncased.txt';
// const filePath = './BD/AACTextBD.txt'
const filePath = './BD/test.txt'

const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split('\n');

lines.forEach((line) => {
        if (line === '\n') {
                return; // Skip empty lines
        }

        const words = line.split(' ');
        console.log(words);
        gram.add(['$START', words[0]], words[1])
        for (let i = 0; i < words.length - 2; i++) {
                gram.add([words[i], words[i+1]], words[i+2]);
        }
         
                
});

gram.add(['i', 'want'], 'pizza');
gram.add(['i', 'want'], 'pizza');
gram.add(['i', 'want'], 'pizza'); 
 
const serialized = gram.serialize();
const gram2 = new Gram(serialized);
gram2.export();


