

function arrayFind(array, subarray, begin=-1, end=-1){
  console.log("arrayFind");
  if(end + subarray.length >= array.length){
    return -1;
  }
  if(typeof(subarray) === "string"){
    subarray = stringConvertBytearrayTo(subarray);
  }
  if(begin < 0){
    begin = 0;
  }
  if(end == -1 || end >= array.length){
    end = array.length - subarray.length;
  }
  for(var i = begin; i < end; ++i){
    if(array[i] == subarray[0]){
      var found = 1;
      for(var i2 = 1; i2 < subarray.length; ++i2){
        if(array[i + i2] != subarray[i2]){
          found = 0;
          break;
        }
      }
      if(found == 1){
        return i;
      }
    }
  }
  return -1;
}



//V0.1 (Jahongir Rahmonov)
function fileSaveBinary(filename, text){
  console.log("fileSaveBinary");
  var binary=text;
  if(typeof(text)==="string"){
    var binary=stringConvertBytearrayTo(text);
  }
  var blob = new Blob([binary]);
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = filename;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



function pdfImagesExtract(data){
  console.log("pdfImagesExtract");
  var start=-1;
  var end=-1;
  var stream="stream";
  var endStream="endstream";
  while(1){
    start=arrayFind(data,stream,start+1);
    end=arrayFind(data,endStream,start+stream.length+1);
    start=arrayFind(data,['0xFF','0xD8'],start+stream.length+1,end);
    end=arrayFind(data,['0xFF','0xD9'],start+1,end);
    if(start==-1||end==-1){
      break;
    }
  }
}

function pdfPageCountGet(data){
  
}

function pdfVersionGet(data){
  
}



function stringConvertBytearrayTo(string){
  console.log("stringConvertBytearrayTo");
  var binaryString = string//window.atob(string);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
     var ascii = binaryString.charCodeAt(i);
     bytes[i] = ascii;
  }
  return bytes;
}

function stringConvertHexFrom(string){
  console.log("stringConvertHexFrom");
  var ret="";
  for(int=0;i<string.length-1;i+=2){
    var byte=string.substring(i,i+2);
    var toNumber=Number(byte,16);
    ret+=String.fromCharCode(toNumber);
  }
  return ret;
}

function stringConvertHexTo(string){
  console.log("stringConvertHexTo");
  var ret="";
  for(i=0;i<string.length;++i){
    ret+=string.charCodeAt(i).toString(16);
  }
  return ret;
}