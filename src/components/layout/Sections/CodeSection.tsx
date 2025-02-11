export default function CodeSection(){
    return (
        <div className='w-full border-2 shadow-lg rounded-xl h-full flex flex-col p-3'>
            <div className="h-7 w-full flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"/>
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <div className="w-3 h-3 rounded-full bg-green-400"/>
            </div>
            <div className="w-full h-full rounded-md border-2"></div>
        </div>
    )
}