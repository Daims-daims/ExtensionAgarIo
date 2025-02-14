 export default function getPosFromMessage(dataArray:ArrayBuffer){
    const dataView = new DataView(dataArray)
    console.log(dataView.getUint8(0))
    console.log(dataView.getUint16(1))
}