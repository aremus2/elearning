var canvas = document.getElementById("testcanvas")
var container = document.getElementById("container")
var image = document.getElementById("testimg")
var edit = document.getElementById("edit")

//minimum size of a box
var MINIMUM_SIZE_BOX=10
var COLOR_RECT_DEFAULT="#ff5733" 
var COLOR_RECT_HIGHLIGHT="#33ff39" 
var COLOR_RECT_PREVIEW="#11aa13" 

var editmap=new Map()

var canvasIndex = 1

var canvasX = 0
var canvasY = 0

var activeIndex=-1

//classes
function edititem(){
  this.id=-1
  this.dimX=-1
  this.dimY=-1
  this.startX=-1
  this.startY=-1
}

//handlers
image.onload = imageLoadHandler
canvas.onmousedown = mouseDownHandler
canvas.onmouseup = mouseUpHandler
canvas.onclick=canvasClickHandler

function canvasClickHandler(event){
  //console.log("click")
  //console.log(event)
}

function imageLoadHandler(){
  
  
  
  canvas.style.position = "absolute";
  canvas.style.top="0"
  canvas.style.left="0"
  canvas.width = image.width
  canvas.height = image.height
  canvas.style.zIndex = 100
  canvas.style.width = imgWidth(image)
  canvas.style.height = imgHeight(image)
  
  container.style.width = imgWidth(image)
  container.style.height = imgHeight(image)
  
  image.style.position="absolute"
  image.top="0"
  image.left="0"
  
  edit.style.height = imgHeight(image)
}

function mouseDownHandler(event){
  //console.log(event)
  canvasX = event["layerX"]
  canvasY = event["layerY"]
  canvas.addEventListener("mousemove", mouseMoveHandler)
  event.preventDefault()
}

function mouseMoveHandler(event){
  var dims=getDims(event)
  var canvas2 = document.getElementById("temprect")
  if(canvas2!=null){
    canvas2.remove()
  }
  var canvas2 = createCanvas(dims.id,dims.startX,dims.startY,dims.dimX,dims.dimY,COLOR_RECT_PREVIEW)
  canvas2.id="temprect"
  canvas2.style.zIndex = 50
  container.appendChild(canvas2)
}

function getDims(event){
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

function mouseUpHandler(event){
  canvas.removeEventListener("mousemove", mouseMoveHandler)
  var canvas2 = document.getElementById("temprect")
  if(canvas2!=null){
    canvas2.remove()
  }
  
  //canvas.onmousemove=null
  var canvasX2 = event["layerX"]
  var canvasY2 = event["layerY"]
  var startX = canvasX < canvasX2 ? canvasX : canvasX2
  var startY = canvasY < canvasY2 ? canvasY : canvasY2
  var dimX = Math.abs(canvasX - canvasX2)
  var dimY = Math.abs(canvasY - canvasY2)
  if(dimX < MINIMUM_SIZE_BOX || dimY < MINIMUM_SIZE_BOX){
    it=getEditItem(canvasX2,canvasY2)
    if(it!=-1){
      //console.log("in")
      unhighlightItem(activeIndex)
      highlightItem(it)
    }
    return
  }
  //console.log(canvasX+","+canvasY)
  //console.log(canvasX2+","+canvasY2)
  //console.log(startX+" "+startY)
  //console.log(dimX+" "+dimY)
  
  if(activeIndex!=-1){
    unhighlightItem(activeIndex)
  }
  var canvas2 = createCanvas(canvasIndex,startX,startY,dimX,dimY,COLOR_RECT_HIGHLIGHT)
  container.appendChild(canvas2)
  
  //EDIT FIELD
  var newdiv = document.createElement("div")
  newdiv.id="edit_"+canvasIndex
  newdiv.style.background=COLOR_RECT_HIGHLIGHT
  newdiv.style.minHeight="20px"
  newdiv.style.minWidth="50px"
  newdiv.onclick=editClickHandler
  var info=document.createElement("p")
  var lineedit=document.createElement("input")
  lineedit.type="text"
  var deletebutton=document.createElement("button")
  deletebutton.innerHTML="Delete"
  deletebutton.id="delete_"+canvasIndex
  deletebutton.onclick=deleteClickHandler
  info.innerHTML="canvasIndex:"+canvasIndex+"\nstartX:"+startX+"\nstartY:"+startY+"\ndimX:"+dimX+"\ndimY:"+dimY
  newdiv.appendChild(info)
  newdiv.appendChild(lineedit)
  newdiv.append(deletebutton)
  edit.insertBefore(newdiv, edit.firstChild)
  
  var item=new edititem()
  item.id=canvasIndex
  item.dimX=dimX
  item.dimY=dimY
  item.startX=startX
  item.startY=startY
  editmap.set(canvasIndex, item)
  
  activeIndex=canvasIndex
  canvasIndex++
}

function mouseOverHandler(event){
  //for creating preview rect
  console.log(event)
}

function editClickHandler(event){
  //console.log(event)
  //console.log(event.target.parent)
  var id=event.target.id.split("_")[1]
  //console.log(id)
  highlightItem(id)
}



function deleteClickHandler(event){
  //console.log(event)
  //console.log(event.target.id)
  var c=event.target.id.replace("delete","canvas")
  var d= event.target.id.replace("delete","edit")
  document.getElementById(c).remove()
  document.getElementById(d).remove()
  //editmap.
}

function imgHeight(image){
  return image.height + "px";
}

function imgWidth(image){
  return image.width + "px";
}

function getEditItem(posX,posY){
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

function unhighlightItem(id){
  //console.log(id)
  var cav=getCanvas(id)
  var cai=editmap.get(id)
  var currentActiveEdit=getEditDiv(id)
  currentActiveEdit.style.background=COLOR_RECT_DEFAULT
  container.removeChild(cav)
  container.appendChild(createCanvas(id,cai.startX,cai.startY,cai.dimX,cai.dimY,COLOR_RECT_DEFAULT))
}

function getCanvas(id){
  var item = document.getElementById("canvas_"+id)
  return item
}

function getEditDiv(id){
  var item = document.getElementById("edit_"+id)
  //console.log(item)
  return item
}

function createCanvas(id,startx,starty,dimx,dimy,color){
  //console.log(id)
  var canvas2 = document.createElement("canvas")
  canvas2.style.position="absolute"
  canvas2.id="canvas_"+id
  canvas2.width = image.width
  canvas2.height = image.height
  canvas.style.top="0"
  canvas.style.left="0"
  canvas2.style.zIndex = id
  canvas2.style.width = image.width
  canvas2.style.height = image.height
  var ctx = canvas2.getContext("2d");
  ctx.beginPath();
  ctx.rect(startx, starty, dimx, dimy);
  ctx.strokeStyle = color;
  ctx.stroke();
  return canvas2
}
