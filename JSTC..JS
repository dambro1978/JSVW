 async function bindJ(data, Type, url, contentType, dataType) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: data,
         contentType: contentType,
         dataType: dataType,
         success: function (response) {
             const structJson = JSON.stringify(response);
             storeCapsule = JSON.parse(structJson);
         },
         failure: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }

 async function bindJ(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: data,
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (response) {

             const structJson = JSON.stringify(response);
             storeCapsule = JSON.parse(structJson);
         },
         failure: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindS(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: data,
         contentType: "charset=utf-8",
         dataType: "string",
             success: function (response) {
             storeCapsule = response;
         },
         failure: function (response) {
             storeCapsule = response; return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response; return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindX(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         dataType: "xml",
	data: data,
         contentType: "charset=utf-8",
         success: function (response) {
             const structXML = response.toXMLString();
             const parser = new DOMParser();
             storeCapsule = parser.parseFromString(structXML, "application/xml");
         },
         failure: function (response) {
             storeCapsule = response;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindH(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
	data: data,
         dataType: 'html',
         contentType: "charset=utf-8",
         success: function (response) {
             storeCapsule = response;
         },
         failure: function (response) {
             storeCapsule = response;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindB(data, Type, url) {
     datab=textToBinary(data);
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: datab,
         contentType: "charset=utf-8",
         dataType: "string",
             success: function (response) {
	     storeCapsuleB = response;
	     storeCapsule = binaryToText(storeCapsuleB);
         },
         failure: function (response) {
             storeCapsule = response; return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response; return storeCapsule;
         }

     });

     return storeCapsule;
 }


function binaryToText(str) {
  let output = [];
  str.split(" ").forEach((element) => {
   if (element!=""){
    output.push(String.fromCharCode(parseInt(element, 2)));
	}
  });
  return output.join("");
}


function textToBinary(str) {
  let output = "";
  str.split("").forEach((element) => {
    let char = element.charCodeAt(0).toString(2);
	
    output += ("00000000" + char).slice(-8).concat(" ");
  });
  return output;
}

async function bindS(data, url) {
     let storeCapsule;
     await $.ajax({
         type: 'POST',
         url: url,
         data: data,
         contentType: "charset=utf-8",
         dataType: "string",
             success: function (response) {
             storeCapsule = response;
         },
         failure: function (response) {
             storeCapsule = response; return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response; return storeCapsule;
         }

     });

     return storeCapsule;
 }
	//Created by Giuseppe D'Ambrosio
