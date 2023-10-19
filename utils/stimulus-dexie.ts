import Dexie from "dexie"
export const download_latest_datafile_version = async () => {
    // The file is stored in the /public folder
    // The file is a XML file containing the data
    const response: any = await $fetch("/eat-stimulus-response.xml")
    return response
}

export const parse_xml_data = (data: string) => {
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, "text/xml")
    return xml
}

// Initialize the IndexedDB with Dexie.js
export const initialize_indexeddb = async () => {
    try{
        const db = new Dexie("eat-stimulus-response")
    db.version(1).stores({
        stimulus_response: "++stimulus"
    })
    return db
    } catch (error) {
        console.debug(error)
    }
    
}

export const save_data_to_indexeddb = async (db: any, data: any) => {
    // Save the data to the indexeddb
    // All <stimulus> elements have an "word" attribute we can use as the key
    // All <response> elements have an "word" attribute we store as the value

    /* <stimulus word="SPECIAL" all="100" diff="68">
      <response word="TRAIN" n="7" r="0.07"/>
      <response word="PARTICULAR" n="5" r="0.05"/>
      <response word="EXTRA" n="4" r="0.04"/>
      <response word="ORDINARY" n="4" r="0.04"/>
      <response word="CASE" n="3" r="0.03"/>
      <response word="PERSON" n="3" r="0.03"/>
    </stimulus> */
    data.querySelectorAll("stimulus").forEach((stimulus: any) => {
        let responses:Array<{ word: string; n: number; r: number }> = []
        stimulus.querySelectorAll("response").forEach((response: any) => {
            responses.push({
                word: response.getAttribute("word"),
                n: response.getAttribute("n"),
                r: response.getAttribute("r")
            })
        })
        db.stimulus_response.put({
            stimulus: stimulus.getAttribute("word"),
            responses: responses
        })
    });
}