export default function Server( { params, }: { params: { region: string } } ) {
    
    return (
        <div>
            <h1>Server:</h1>
            <h2>{ params.region }</h2>            
        </div>
    )
}