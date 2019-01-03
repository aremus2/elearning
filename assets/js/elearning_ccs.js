//var container = document.getElementById("img-container");
//var edit = document.getElementById("img-edit");

//console.log=function(){}

//minimum size of a box


var canvasIndex = 1;

var canvasX = 0;
var canvasY = 0;

var activeIndex=-1;


//TODO
//*js in js
//*dump vars to file

//classes
class edititem{
  constructor(){
    this.id=-1;
    this.dimX=-1;
    this.dimY=-1;
    this.startX=-1;
    this.startY=-1;
  }
}
class Data{
  constructor(){
    this.canvasLoaded = false;
    this.imgLoaded    = false;
    this.indexEdit    = -1;
    this.pageEdits    = new Map();
    this.startY       = new Number();
  }
}
//holds global variables
var elearning = {};

function dimensionsGet(event){
  console.log("dimensionsGet");
  var canvasX2 = event["layerX"]
  var canvasY2 = event["layerY"]
  var startX = canvasX < canvasX2 ? canvasX : canvasX2
  var startY = canvasY < canvasY2 ? canvasY : canvasY2
  var dimX = Math.abs(canvasX - canvasX2)
  var dimY = Math.abs(canvasY - canvasY2)
  var ei=new edititem()
  ei.dimX=dimX
  ei.dimY=dimY
  ei.startX=startX
  ei.startY=startY
  return ei
}

function edititemGet(posX,posY){
  var keys = Array.from(editmap.keys())
  for (var i=0;i<keys.length;++i){
    var it=editmap.get(keys[i])
    //console.log("getEditItem:"+it,it.id,posX,posY)
    if(it.startX < posX && it.startX+it.dimX > posX && it.startY < posY && it.startY+it.dimY > posY){
      return it.id
    }
  }
  return -1
}

function canvasGet(xCord,yCord){
  for(var i=1;i<=elearning.pdfPageCount;++i){
    if(elearning.pdfPages[i].startY>yCord){
      return i-1;
    }
  }
}

function highlightItem(id){
  if(activeIndex==id){
    console.log("return")
    return
  }
  unhighlightItem(activeIndex)
  activeIndex=id
  var cai=editmap.get(Number(activeIndex))
  var newActiveEdit=getEditDiv(activeIndex)
  newActiveEdit.style.background=COLOR_RECT_HIGHLIGHT
  var cav=getCanvas(activeIndex)
  container.removeChild(cav)
  var newcav=createCanvas(activeIndex,cai.startX,cai.startY,cai.dimX,cai.dimY,COLOR_RECT_HIGHLIGHT)
  container.appendChild(newcav)
}

function init(){
  console.log("init");
  //Initial handlers
  document.getElementById("input-file-new").addEventListener("change", listenerOnChangeInputFileNew);
  
  document.addEventListener("mouseup", listenerOnMouseUpDocument);
  // create an observer instance. we observe if all pages have been loaded, after that they are inserted into the document.
  elearning.observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var nodeName=mutation.addedNodes[0].id;
      var nodeId=Number(nodeName.split("_")[1]);
      if(nodeName.indexOf("canvas")!=-1){
        elearning.pdfPages[nodeId].canvasLoaded=true;
      }
      else if(nodeName.indexOf("img")!=-1){
        elearning.pdfPages[nodeId].imgLoaded=true;
      }
      if(elearning.pdfPages[nodeId].imgLoaded==true&&elearning.pdfPages[nodeId].canvasLoaded==true){
        elearning.pdfPagesLoaded++;
      }
      if(elearning.pdfPagesLoaded==elearning.pdfPageCount){
        elearning.observer.disconnect();
        loadImages();
      }
    });
  });
  
  reinit();
  //elearning.observer.observe(elearning.layoutImages, {/*attributes:true,*/ childList: true/*, characterData: true*/});
}

function layoutBuild(){
  console.log("layoutBuild "+elearning.pdfPageCount);
  
  for(var i=1;i<=elearning.pdfPageCount;++i){
    let newcanvas = document.createElement("canvas");
    newcanvas.id="img-canvas_" + i;
    let newimage = document.createElement("img");
    newimage.id = "img-img_" + i;
    //console.log(newcanvas.id)
    newcanvas.addEventListener("mousedown", listenerOnMouseDownCanvas);
    
    elearning.layoutImages.appendChild(newcanvas);
    elearning.layoutImages.appendChild(newimage);
  }
}

function listenerOnChangeInputFileNew(evt){
  console.log("listenerOnChangeInputFileNew");
  
  var tgt = evt.target || window.event.srcElement,
  files = tgt.files;
  
  if (FileReader && files && files.length) {
    fr = new FileReader();
    fr.onload = function(e){
      listenerOnLoadFile(e);
    }
    //fr.readAsBinaryString(files[0]);
    //fr.readAsArrayBuffer(files[0])
    fr.readAsDataURL(files[0]);
    //fr.readAsText(files[0]);
    elearning.pdfFile = files[0].name;
  }
  else {
    console.error("No FileReader support!")
  }
}

function listenerOnClickButtonLoad(){
  console.log("listenerOnClickButtonLoad");
}

function listenerOnClickCanvas(event){
  //console.log("click")
  //console.log(event)
}

function listenerOnClickDeleteEdit(event){
  console.log("listenerOnClickDeleteEdite")
  var c=event.target.id.replace("delete","canvas")
  var d= event.target.id.replace("delete","edit")
  document.getElementById(c).remove()
  document.getElementById(d).remove();
}

function listenerOnClickEdit(event){
  console.log("listenerOnClickEdit");
  var id=event.target.id.split("_")[1]
  highlightItem(id)
}


function listenerOnClickButtonNew(){
  console.log("listenerOnClickButtonNew");
  var fileinput=document.getElementById("input-file-new");
  fileinput.click();
}

function listenerOnClickButtonSave(){
  console.log("listenerOnClickButtonSave");
}

function listenerOnLoadFile(event){
  console.log("listenerOnLoadFile");
  reinit();
  elearning.pdfData = event.target.result;
  //elearning.pdfBinary = stringConvertBytearrayTo(elearning.pdfText);
  processPdf();
}

function listenerOnLoadImage(){
  console.log("listenerOnLoadImage");
  
  canvas.style.height = image.height+"px";
  canvas.style.left="0px";
  canvas.style.position = "absolute";
  canvas.style.top="0px";
  canvas.style.width = image.width+"px";
  canvas.style.zIndex = 100;

  container.style.height = image.height+"px";
  container.style.width = image.width+"px";

  image.style.left="0px";
  image.style.position="absolute";
  image.style.top="0px";
  
  edit.style.height = image.height+"px";
}

function listenerOnMouseDownBottomdiv(){
  console.log("listenerOnMouseDownBottomdiv");
}


function listenerOnMouseDownBottomleftdiv(){
  console.log("listenerOnMouseDownBottomleftdiv");
}

function listenerOnMouseDownBottomrightdiv(){
  console.log("listenerOnMouseDownBottomrightdiv");
}

function listenerOnMouseDownCanvas(event){
  console.log("listenerOnMouseDownCanvas",event.target);
  //console.log(event,canvasid)
  let canvas=document.getElementById(event.target.id)
  canvasX = event["layerX"]
  canvasY = event["layerY"]
  canvas.addEventListener("mousemove", listenerOnMouseMoveCanvas)
  canvas.addEventListener("mouseup", listenerOnMouseUpCanvas)
  //canvas.addEventListener("mouseout", listenerOnMouseOutCanvas);
  event.preventDefault()
}

function listenerOnMouseDownLeftdiv(){
  console.log("listenerOnMouseDownLeftdiv");
}

function listenerOnMouseDownMaindiv(event){
  console.log("listenerOnMouseDownMaindiv",event);
  elearning.startX=event["clientX"];
  elearning.startY=event["clientY"];
  event.target.addEventListener("mousemove", listenerOnMouseMoveMaindiv)
  event.target.addEventListener("mouseup", listenerOnMouseUpMaindiv)
}

function listenerOnMouseDownRightdiv(){
  console.log("listenerOnMouseDownRightdiv");
}

function listenerOnMouseDownTopdiv(){
  console.log("listenerOnMouseDownTopdiv");
}

function listenerOnMouseDownTopleftdiv(){
  console.log("listenerOnMouseDownTopleftdiv");
}

function listenerOnMouseDownToprightdiv(){
  console.log("listenerOnMouseDownToprightdiv");
}

function listenerOnMouseMoveCanvas(event){
  console.log("listenerOnMouseMoveCanvas");
  var dims=dimensionsGet(event)
  var canvas2 = document.getElementById("temprect")
  if(canvas2!=null){
    canvas2.remove()
  }
  var canvas2 = rectCreatePreview(dims.id,dims.startX,dims.startY,dims.dimX,dims.dimY,this.id)
  canvas2.id="temprect"
}

function listenerOnMouseMoveMaindiv(event){
  console.log("listenerOnMouseMoveMaindiv", event)
  var newX=event["clientX"];
  var newY=event["clientY"];
  var startX  = newX-elearning.startX
  var startY  = newY  - elearning.startY;
  var dimX  = event.target.style.width;
  var dimY  = event.target.style.height;

  //delete old position
  //while(document.querySelector('[id^="active-rect-"]') !== null){
  //  document.querySelector('[id^="active-rect-"]').remove();
  //}
  var canvasid=canvasGet(newX,newY);
  //TODO parse ints
  console.log(newX,newY,startX,startY,dimX,dimY,canvasid)
  //rectCreateActive(newX,newY,dimX,dimY,canvasid);
  return
}

function listenerOnMouseOutCanvas(event){
  console.log("listenerOnMouseOutEventCanvas");
  return;
  var target=event.target;
  target=document.getElementById(target.id);
  target.removeEventListener("mousemove", listenerOnMouseMoveCanvas);
}

function listenerOnMouseUpCanvas(event){
  console.log("listenerOnMouseUpCanvas");
  console.log(event,this.id)
  var canvas=document.getElementById(this.id)
  canvas.removeEventListener("mousemove", listenerOnMouseMoveCanvas)
  var canvas2 = document.getElementById("temprect")
  if(canvas2!=null){
    canvas2.remove()
  }
  
  //canvas.onmousemove=null
  var canvasX2 = event["layerX"]
  var canvasY2 = event["layerY"]+canvas.offsetTop;
  var startX = canvasX < canvasX2 ? canvasX : canvasX2
  var startY = canvasY < canvasY2 ? canvasY : canvasY2
  var dimX = Math.abs(canvasX - canvasX2)
  var dimY = Math.abs(canvasY - canvasY2)
  if(dimX < elearning.MINIMUM_SIZE_BOX || dimY < elearning.MINIMUM_SIZE_BOX){
    it=edititemGet(canvasX2,canvasY2)
    if(it!=-1){
      //console.log("in")
      unhighlightItem(activeIndex)
      highlightItem(it)
    }
    return
  }
  
  if(activeIndex!=-1){
    unhighlightItem(activeIndex)
  }
  var canvas2 = rectCreateActive(startX,startY,dimX,dimY,event.target.id)
  
  //EDIT FIELD
  var newdiv = document.createElement("div")
  newdiv.id="edit_"+canvasIndex
  newdiv.style.background=elearning.COLOR_RECT_HIGHLIGHT
  newdiv.style.minHeight="20px"
  newdiv.style.minWidth="50px"
  newdiv.onclick=listenerOnClickEdit;
  var info=document.createElement("p")
  var lineedit=document.createElement("input")
  lineedit.type="text"
  var deletebutton=document.createElement("button")
  deletebutton.innerHTML="Delete"
  deletebutton.id="delete_"+canvasIndex
  deletebutton.onclick=listenerOnClickDeleteEdit;
  info.innerHTML="canvasIndex:"+canvasIndex+"\nstartX:"+startX+"\nstartY:"+startY+"\ndimX:"+dimX+"\ndimY:"+dimY
  newdiv.appendChild(info)
  newdiv.appendChild(lineedit)
  newdiv.append(deletebutton)
  elearning.layoutEdits.insertBefore(newdiv, elearning.layoutEdits.firstChild)
  
  var item=new edititem()
  item.id=canvasIndex
  item.dimX=dimX
  item.dimY=dimY
  item.startX=startX
  item.startY=startY
  elearning.editmap.set(canvasIndex, item)
  
  activeIndex=canvasIndex
  canvasIndex++
}

function listenerOnMouseUpMaindiv(event){
  console.log("listenerOnMouseUpMaindiv")
  event.target.removeEventListener("mousemove", listenerOnMouseMoveMaindiv);
}

function listenerOnMouseUpDocument(event){
  console.log("listenerOnMouseUpDocument");
  for (var i=1;i<=elearning.pdfPageCount;++i){
    var elem=document.getElementById("img-canvas_"+i);
    elem.removeEventListener("mousemove", listenerOnMouseMoveCanvas);
  }
}

function loadImages(){
  console.log("loadImages");
  //start with first image
  loadNextImage(1);
}

function loadNextImage(id){
  console.log("loadNextImage",id);
  if(typeof(id)!== "number"){
    var img=document.getElementById(id.target.id);
    id=this.id.split("_")[1];
    id=Number(id)+1;
    elearning.pdfPages[id-1].startY=img.offsetTop;
  }
  if(id>elearning.pdfPageCount){
    return;
  }
  elearning.pdfObject.getPage(id).then(function(page) {
    var __CANVAS=document.getElementById("img-canvas_"+id);
    var __IMAGE=document.getElementById("img-img_"+id);
    var __CANVAS_CTX = __CANVAS.getContext('2d');
    var width=page.getViewport(1).width;
    var scale_required = __CANVAS.width / page.getViewport(1).width;
    elearning.layoutImages.style.width=width*1.1+"px";//no vertical scroll after *1.1
    var viewport = page.getViewport(1);
    __CANVAS.style.display="none";
    __CANVAS.width=width;
    __CANVAS.style.width=width+"px";
    __CANVAS.height = viewport.height;
    __CANVAS.style.height=viewport.height+"px";

    var renderContext = {
      canvasContext: __CANVAS_CTX,
      viewport: viewport
    };
    
    page.render(renderContext).then(function(canvas=__CANVAS){
      var id=Number(canvas.id.split("_")[1]);
      //get previous element
      var prev=document.getElementById("img-canvas_"+(id-1))
      var top=0;
      if(prev!==null){
        top=prev.offsetTop+prev.height;
      }
      var img=document.getElementById("img-img_"+id);
      
      //postion canvas
      canvas.style.position="absolute";
      canvas.style.top=top+"px";
      //position img under canvas;
      img.style.position="absolute";
      img.style.top=canvas.style.top;
      //img.style.left=canvas.offsetLeft+"px";
      //set canvas z-index
      canvas.style.zIndex=100;
      //prepare canvas clear
      var ctx=canvas.getContext("2d");
      //make canvas visible again
      canvas.style.display="inline";
      //copy data to img
      
      img.addEventListener("load", loadNextImage);
      
      //img.addEventListener("load", function(){loadNextImage(id+1);});
      //to remove anonymous function, remove the inner one
      //img.removeEventListener("load", loadNextImage);
      
      img.src=canvas.toDataURL();
      //clear canvas
      ctx.clearRect(0,0,canvas.width,canvas.height);
    });
  
  });
}

function processPdf(){
  console.log("processPdf");
  pdfjsLib.getDocument(elearning.pdfData)
  .then(function(pdf) {
    elearning.pdfObject = pdf;
    elearning.pdfPageCount = elearning.pdfObject.numPages;
    for(var i=1;i<=elearning.pdfPageCount;++i){
      elearning.pdfPages[i]=new Data();
    }
    elearning.pdfCurrentPage=1;
    return pdf;
  })
  .then(function(pdf){
    layoutBuild();
  });
}

function rectCreateActive(startX,startY,dimX,dimY,divid){
  console.log("rectCreateActive",startX,startY,dimX,dimY,divid);
  var id;
  if(typeof(divid)!=="number"){
    id=divid.split("_")[1];
  }
  else{
    id=divid;
  }
  
  
  startY  = elearning.pdfPages[id].startY+startY;
//main
  var div                   = document.createElement("div")
  div.style.top             = startY    +"px"
  div.style.left            = startX    +"px"
  div.style.width           = dimX      +"px"
  div.style.height          = dimY      +"px";
  div.style.backgroundColor = elearning.COLOR_RECT_ACTIVE;
  div.style.zIndex          = elearning.ZINDEX_ACTIVE_RECT
  div.style.position        = "absolute";
  div.addEventListener("mousedown", listenerOnMouseDownMaindiv);
  div.id  = "active-rect-main_"+id;
  
  //top
  var topdiv                    = document.createElement("div");
  topdiv.style.top              = startY-elearning.SIZE_BORDER_RECT     + "px"
  topdiv.style.left             = startX                                + "px"
  topdiv.style.width            = dimX                                  + "px"
  topdiv.style.height           = elearning.SIZE_BORDER_RECT            + "px";
  topdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  topdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  topdiv.style.position         = "absolute";
  topdiv.addEventListener("mousedown", listenerOnMouseDownTopdiv);
  topdiv.id = "active-rect-top_"+id;
  
  //bottom
  var bottomdiv                    = document.createElement("div");
  bottomdiv.style.top              = startY+dimY                           + "px"
  bottomdiv.style.left             = startX                                + "px"
  bottomdiv.style.width            = dimX                                  + "px"
  bottomdiv.style.height           = elearning.SIZE_BORDER_RECT            + "px";
  bottomdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  bottomdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  bottomdiv.style.position         = "absolute";
  bottomdiv.addEventListener("mousedown", listenerOnMouseDownBottomdiv);
  bottomdiv.id = "active-rect-bottom_"+id;
  
//right
  var rightdiv                    = document.createElement("div");
  rightdiv.style.top              = startY                          + "px"
  rightdiv.style.left             = startX+dimX                     + "px"
  rightdiv.style.width            = elearning.SIZE_BORDER_RECT      + "px"
  rightdiv.style.height           = dimY                            + "px";
  rightdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  rightdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  rightdiv.style.position         = "absolute";
  rightdiv.addEventListener("mousedown", listenerOnMouseDownRightdiv);
  rightdiv.id = "active-rect-right_"+id;
  
//left
  var leftdiv                    = document.createElement("div");
  leftdiv.style.top              = startY                             + "px"
  leftdiv.style.left             = startX-elearning.SIZE_BORDER_RECT  + "px"
  leftdiv.style.width            = elearning.SIZE_BORDER_RECT         + "px"
  leftdiv.style.height           = dimY                               + "px";
  leftdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  leftdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  leftdiv.style.position         = "absolute";
  leftdiv.addEventListener("mousedown", listenerOnMouseDownLeftdiv);
  leftdiv.id = "active-rect-left_"+id;
  
  //topright
  var toprightdiv                    = document.createElement("div");
  toprightdiv.style.top              = startY-elearning.SIZE_BORDER_RECT     + "px"
  toprightdiv.style.left             = startX+dimX                           + "px"
  toprightdiv.style.width            = elearning.SIZE_BORDER_RECT            + "px"
  toprightdiv.style.height           = elearning.SIZE_BORDER_RECT            + "px";
  toprightdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  toprightdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  toprightdiv.style.position         = "absolute";
  toprightdiv.addEventListener("mousedown", listenerOnMouseDownToprightdiv);
  toprightdiv.id = "active-rect-topright_"+id;
  
  //topleft
  var topleftdiv                    = document.createElement("div");
  topleftdiv.style.top              = startY-elearning.SIZE_BORDER_RECT     + "px"
  topleftdiv.style.left             = startX -elearning.SIZE_BORDER_RECT    + "px";
  topleftdiv.style.width            = elearning.SIZE_BORDER_RECT            + "px"
  topleftdiv.style.height           = elearning.SIZE_BORDER_RECT            + "px";
  topleftdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  topleftdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  topleftdiv.style.position         = "absolute";
  topleftdiv.addEventListener("mousedown", listenerOnMouseDownTopleftdiv);
  topleftdiv.id = "active-rect-topleft_"+id;
  
  //bottomleft
  var bottomleftdiv                    = document.createElement("div");
  bottomleftdiv.style.top              = startY+dimY                        + "px"
  bottomleftdiv.style.left             = startX-elearning.SIZE_BORDER_RECT  + "px"
  bottomleftdiv.style.width            = elearning.SIZE_BORDER_RECT         + "px"
  bottomleftdiv.style.height           = elearning.SIZE_BORDER_RECT         + "px";
  bottomleftdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  bottomleftdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  bottomleftdiv.style.position         = "absolute";
  bottomleftdiv.addEventListener("mousedown", listenerOnMouseDownBottomleftdiv);
  bottomleftdiv.id = "active-rect-bottomleft_"+id;
  
  //bottomright
  var bottomrightdiv                    = document.createElement("div");
  bottomrightdiv.style.top              = startY+dimY                   + "px"
  bottomrightdiv.style.left             = startX +dimX                  + "px"
  bottomrightdiv.style.width            = elearning.SIZE_BORDER_RECT    + "px"
  bottomrightdiv.style.height           = elearning.SIZE_BORDER_RECT    + "px";
  bottomrightdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  bottomrightdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT
  bottomrightdiv.style.position         = "absolute";
  bottomrightdiv.addEventListener("mousedown", listenerOnMouseDownBottomrightdiv);
  bottomrightdiv.id = "active-rect-bottomright_"+id;
  

  elearning.layoutImages.appendChild(div)
  elearning.layoutImages.appendChild(leftdiv)
  elearning.layoutImages.appendChild(rightdiv)
  elearning.layoutImages.appendChild(topdiv)
  elearning.layoutImages.appendChild(bottomdiv)
  elearning.layoutImages.appendChild(topleftdiv)
  elearning.layoutImages.appendChild(toprightdiv)
  elearning.layoutImages.appendChild(bottomleftdiv)
  elearning.layoutImages.appendChild(bottomrightdiv)
  return div;
}

function rectCreatePreview(id,startX,startY,dimX,dimY,divid){
  console.log("rectCreatePreview");
  var div=document.createElement("div")
  var id=divid.split("_")[1];
  startY=elearning.pdfPages[id].startY+startY;

  div.style.top=startY+"px"
  div.style.left=startX+"px"
  div.style.width=dimX+"px"
  div.style.height=dimY+"px";
  
  
  div.style.backgroundColor=elearning.COLOR_RECT_PREVIEW;
  div.style.zIndex=50
  div.style.position = "absolute";
  elearning.layoutImages.appendChild(div)
  return div;
}

function reinit(){
  console.log("reinit");
  elearning.observer              ;
  elearning.pdfCurrentPage        = new Number();
  elearning.pdfData               = new String();
  elearning.pdfFile               = new String();
  elearning.pdfObject             ;//= new Uint8Array();
  elearning.pdfPageCount          = new Number();
  elearning.pdfPagesLoaded        = new Number();
  elearning.pdfPages              = new Map();
  elearning.pdfVersion            = new String();
  elearning.pdfImagesByPage       = new Map();
  elearning.layoutImages          = document.getElementById("img-container");
  elearning.layoutEdits           = document.getElementById("img-edit");
  elearning.editmap               = new Map();
  elearning.MINIMUM_SIZE_BOX      = 10;
  elearning.COLOR_RECT_DEFAULT    = "#ff5733";
  elearning.COLOR_RECT_ACTIVE     = "#1a33ff39";
  elearning.COLOR_RECT_PREVIEW    = "#1a11aa13";
  elearning.COLOR_RECT_TOP        = "#1a11dd13";
  elearning.COLOR_RECT_CORNER     = "#1a1122ff";
  elearning.SIZE_BORDER_RECT      = 20;
  elearning.ZINDEX_ACTIVE_RECT    = 200;
  
  elearning.startX = 0;
  elearning.startY = 0;
  
  elearning.layoutImages.style.height="600px";
  
  elearning.layoutEdits.style.height="600px";
  elearning.layoutEdits.style.minWidth="400px";

  //clear old dom
  elearning.observer.disconnect();
  var canvi=document.getElementsByTagName("canvas")
  for(var i=canvi.length-1;i>=0;--i){
    elearning.layoutImages.removeChild(canvi[i]);
  }
  var imgs=document.getElementsByTagName("img")
  for(var i=imgs.length-1;i>=0;--i){
    elearning.layoutImages.removeChild(imgs[i]);
  }
  elearning.observer.observe(elearning.layoutImages, {/*attributes:true,*/ childList: true/*, characterData: true*/});
}

function unhighlightItem(id){
  //console.log(id)
  var cav=getCanvas(id)
  var cai=editmap.get(id)
  var currentActiveEdit=getEditDiv(id)
  currentActiveEdit.style.background=COLOR_RECT_DEFAULT
  container.removeChild(cav)
  container.appendChild(createCanvas(id,cai.startX,cai.startY,cai.dimX,cai.dimY,COLOR_RECT_DEFAULT))
}

