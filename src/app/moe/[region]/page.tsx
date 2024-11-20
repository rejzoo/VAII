export default function Moe( {params }: {params: {region: string}} ) {
    return (
        <h1>MOE Page for {params.region} region</h1>
    ) 
}