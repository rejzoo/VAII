export default function Stats( {params}: {params : {name: string}} ) {
    
    return (
        <h1>Stats page for player { params.name }</h1>
    )
}