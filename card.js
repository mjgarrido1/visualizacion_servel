
export function partidosFunction(data){
    var partidos = new Map()

    data.forEach(person => {
    if(!partidos.has(person.data.partido)){
        partidos.set(person.data.partido, 'partido-' + partidos.size)
    }      
    })

    return partidos
} 

export function colorScaleFunction(partidos){
    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeSet1)
        .domain(partidos)

    return colorScale
}

export function personFunction(event, i, data){

    var container = document.getElementById('person')
    var summary = document.getElementById('summary')

    const person = data[i]
    summary.innerHTML = `
    <h3>${person['name']}</h3>
    <h4>${person['data']['partido']} - ${person['data']['region']}</h4>
    <p>
        <b>Ingreso Total</b> : ${person['data']['ingreso_total']} <br />
        <b>Votos</b> : ${person['data']['votos']}
    </p>`

    var incomes = document.getElementById('incomes')
    const aportantes = person['data']['ficha']
    var table = `
    <table border=1 width=40%>
        <tr>
        <th>Aportante</th>
        <th>Rut aportante</th>
        <th>Monto</th>
        </tr>
    `
    aportantes.forEach((aportante) => {
    table += `
        <tr>
        <td>${aportante['aportante']}</td>
        <td>${aportante['rut_aportante']}</td>
        <td>${aportante['monto']}</td>
        </tr>
        `
    })

      table += `
      </table>
      `
      incomes.innerHTML = table

      container.appendChild(summary)
      container.appendChild(incomes)

}

