export default function Tank( { params }: { params: {tankID: string}} ) {

    return (
        <div>
            <h1> TANK !</h1>
            <h2>ID: {params.tankID}</h2>
        </div>
    )
}