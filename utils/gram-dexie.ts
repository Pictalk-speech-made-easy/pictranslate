import Dexie from "dexie"
import { Gram } from '../gram yo/gram';  

export const download_latest_gram_version = async () => {
    // The file is stored in the /public folder
    // The file is a text file containing the data
    const response: any = await $fetch("/gram.json")
    return response
}

// Initialize the IndexedDB with Dexie.js
export const initialize_gram_indexeddb = async () => {
    try{
        const db = new Dexie("gram-response")
    db.version(1).stores({
        gram_response: "++gram"
    })
    return db
    } catch (error) {
        console.debug(error)
    }
}

export const save_gram_to_indexeddb = async (db: any, data: any) => {

    data.querySelectorAll("gram").forEach((gram: any) => {
        let responses:Array<{ word: string; count: number }> = []
        gram.querySelectorAll("response").forEach((response: any) => {
            responses.push({
                word: response.getAttribute("word"),
                count: response.getAttribute("count")
            })
        })
        db.gram_response.put({
            gram: gram.getAttribute("word"),
            predictions: responses
        })
    });
}


// export const save_gram_to_indexeddb = async (db: any, data: any) => {
//     // Create a new Gram instance and deserialize the data
//     const gram = new Gram(data);

//     // Iterate over each entry in the Gram's map
//     for (const [key, entries] of gram.map.entries()) {
//         // Save the gram and responses to the database
//         db.gram_response.put({
//             gram: key,
//             responses: entries,
//         });
//     }
// };