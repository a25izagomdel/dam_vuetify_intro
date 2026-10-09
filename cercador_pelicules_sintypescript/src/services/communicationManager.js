const URL = "http://www.omdbapi.com/?i=tt3896198&apikey=c0b6da99&"
export async function cercar(text) {
    const url = `${URL}s=${text}`

    const resposta = await fetch(url)

    const dades = await resposta.json()

    console.log(dades)

    return dades.Search
}

export async function mesInfoPelis(id) {

    const url = `https://www.omdbapi.com/?i=${id}&apikey=c0b6da99`
    const resposta = await fetch(url)
    const dades = await resposta.json()

    return dades
}