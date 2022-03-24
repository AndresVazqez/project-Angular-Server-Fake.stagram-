const cloudinary = require('cloudinary').v2

const deleteFile = (imgUrl) => {
 
    //dividimos la query donde tenga barra
    const imgSplited = imgUrl.split('/')
    //nos quedamos con el último dato para obtener el nombre del archivo 
    const nameSplited = imgSplited[imgSplited.length - 1].split('.')
  
    //obtenemos el nombre de la carpeta donde se almacenan los archivos  
    const folderSplited = imgSplited[imgSplited.length - 2]
    
    //convertimos en string con nombre de carpeta y nombre de archivo para pasar a la 
    //funcion de claudinary    
    const public_id = `${folderSplited}/${nameSplited[0]}`;

    //funcion de claudinary
    cloudinary.uploader.destroy(public_id, () => {
        console.log('image deleted successfully')
    })
}

module.exports = { deleteFile }