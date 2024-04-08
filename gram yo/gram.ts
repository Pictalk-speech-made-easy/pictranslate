import * as fs from 'fs';
import * as crypto from 'crypto';

type Entry = {
        gram: string;
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

function encrypt(text: string, password: string) {
        const iv = crypto.randomBytes(16);
        const salt = crypto.randomBytes(64);
        const key = crypto.pbkdf2Sync(password, salt, 2145, 32, 'sha512');
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        const ivHex = iv.toString('hex');
        const saltHex = salt.toString('hex');
        return `${saltHex}:${ivHex}:${encrypted}`;
}
function decrypt(encrypted: string, password: string) {
        const parts = encrypted.split(':');
        const salt = Buffer.from(parts[0], 'hex');
        const iv = Buffer.from(parts[1], 'hex');
        const encryptedText = parts[2];
        const key = crypto.pbkdf2Sync(password, salt, 2145, 32, 'sha512');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        return decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
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
                const gram = keys.join(' ');

                if (found) {
                        found.count++;
                } else {
                        current.push({gram, word, count: 1 });
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
        import(filename: string = 'gram', password?: string) {
                try {
                        const data = fs.readFileSync(`${filename}.json`, 'utf-8');
                        const text = password ? decrypt(data, password) : data;
                        this.deserialize(text);
                } catch (e) {
                        console.error(e);
                }
        }
        export(filename: string = 'gram', password?: string) {
                try {
                        const gram = this.serialize();
                        if (!gram) return;
                        if (!password) {
                                fs.writeFileSync(`${filename}.json`, gram);
                        } else {
                                fs.writeFileSync(`${filename}.txt`, encrypt(gram, password));
                        }
                        return;
                } catch (e) {
                        console.error(e);
                }
        }
}
