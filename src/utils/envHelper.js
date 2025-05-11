const read = (envName) =>{
    return import.meta.env[envName] ;
}

export default {
    read
}