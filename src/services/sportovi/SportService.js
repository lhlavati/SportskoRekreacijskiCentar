import { data } from "react-router-dom";
import { sportovi } from "./SportPodaci";

async function get() {
    return {data: sportovi}
}

export default {
    get
}