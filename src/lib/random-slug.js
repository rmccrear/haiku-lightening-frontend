import { generateSlug } from "random-word-slugs"

function randomGameId(){
    return generateSlug(2);
}

export default randomGameId;