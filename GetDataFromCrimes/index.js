//Récupération du json à partir des urls présentes dans le fichier source
const urlFile = "./Datas/sources/urls.txt";
const url="/statistiques/fr/stats-pol/criminality_table/content?nis=";
import fs from 'fs'; 
import  https  from 'https';
 
 



const getCrimDatas=function()
{
    const allFileContents = fs.readFileSync(urlFile, 'utf-8');
    allFileContents.split(/\r?\n/)
    .forEach(
        line =>  {
                    let nis = line.split("?nis=")[1];
                     
                    let options = {
                        hostname: 'www.police.be',
                        path: url+nis,
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    };
                    
                    console.log(nis);
        https.get(options,(res) => 
        {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    fs.writeFile(`./Datas/${nis}.json`, body, function(err) {
                        if (err) {
                        return console.error(err);
                        }
                        
                        console.log(`Ecriture : ./Datas/${nis}.json`); 
                        
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });

        });
    
        });
}
 const getLocations =function ()
{
   
    let options = {
        hostname: 'www.police.be',
        path: '/statistiques/fr/stats-pol/locations_criminality/content',
        headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    https.get(options,(res) => 
        {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {

                    let jsonInfo = JSON.parse(body);
                    console.log(jsonInfo);

                    fs.writeFile(`./Datas/location.json`, body, function(err) {
                        if (err) {
                        return console.error(err);
                        }
                        
                        console.log(`Ecriture : location.json`); 
                        
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });

        });
}
const extractLabels= function(obj, labels){
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractLabels(obj[key], labels); // Appel récursif pour les objets imbriqués
      } else if (key === 'label') {
        labels.push(obj[key]);
      }
    }
  }
const LoadGps = function()
{
  
    
    // Lire le fichier JSON
    fs.readFile('./Datas/location.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    
      // Convertir le contenu JSON en objet JavaScript
      const jsonData = JSON.parse(data);
    
      // Extraire les propriétés "label"
      const labels = [];
      extractLabels(jsonData, labels);
    
      // Afficher les propriétés extraites
      labels.forEach(label => {
        if(!label.toLowerCase().includes("inconnu") && label !== label.toUpperCase())
        {
            let nomurl = `https://nominatim.openstreetmap.org/search?q=${label},%20Belgique&format=json&polygon_geojson=1&addressdetails=1`;
            console.log(nomurl);
        }
         

        
      });
    });
    
}

if(process.argv.length<3){throw new Error("Use node index.js crim or  node index.js location");}
if(process.argv[2]=="crim")
{
    getCrimDatas();
}
if(process.argv[2]=="location")
{
    getLocations();
}

if(process.argv[2]=="gps")
{
    LoadGps();
}

