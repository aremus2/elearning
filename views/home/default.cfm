<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
     
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <title>elearning</title>
    <link rel="stylesheet" type="text/css" href="./assets/css/styles.css">
  </head>
  
  
  <body>
    <cfoutput >
    <!--- ##### Login Area End ##### --->
    <cfif !structkeyexists(session,"user") || !structkeyexists(session,"loginid")>
    <form  name="loginform" method="post" >
      <input type="text" name="name" required>
      <input type="text" name="pass" required>
      <input formaction="index.cfm?action=home.default" type="submit">
    </form>
      
    <cfelse>
    <script>
        
      var t = #server.secondstimeout#;
        
      var x = setInterval(function(){
      if(t != "Expired"){
        t -= 1;
      }
      if(t<0){
        t="Expired";
        window.location.href="index.cfm";
      }
      document.getElementById("timer").innerHTML=t;
      }, 1000);
    </script>
    <p id="timer">Time to session expire</p>
    <form name="newform" method="post">
      <span>Hello, #session.user.user_name#!</span>
      <button formaction="index.cfm?action=home.default&do=logout">Logout</button>
    </form>
    </cfif>
    <!--- ##### Login Area End ##### --->
    <div class="container">
      <div class="row">
        <div class="col-8">
        	<div style="border:1px dashed black">
        		<!---<img src="./assets/img/rechnung0.jpg" style="width:100%;heigth:auto">--->
        		<embed src="#rc.invoice.invoice_path.db#" width="100%" height="1000px" type='application/pdf'>
        	</div>
          
        </div>
        <div class="col-4">
        	<cfset args["invoice"]=#rc.invoice#>
        	<cfset args["solve"]=#rc.solve#>
        	<!---<cfdump var=#rc.invoice# label="1">--->
          <cfinvoke method="printForm" component="funcs.printer" argumentcollection="#args#" >
        </div>
      </div>
    </div>
    </cfoutput>
    <script >
    	function newLot(){
    		
    		var container=document.getElementById("container_lots");
    		var children=document.getElementById("container_lots").children;
    		
    		var newDiv=document.getElementById("lot_1").cloneNode(false);
    		var re=/([^0-9]+)[0-9]+/
        newDiv.id=(newDiv.id.replace(re,"$1"+children.length+1))
        
    		var grandChildren=children[0].children;
    		for(i=0;i<grandChildren.length;++i){
    			item=grandChildren[i];
    			var re=/invoice_lots_.+/
    			if(item.id.match(re)!=null){
    				var new1=document.getElementById(item.id).cloneNode(true);
    				var re=/([^0-9]+)[0-9]+/
    			  var basename=new1.name.match(re)[1]
    			  var newname=basename+(children.length+1)
    				new1.name=newname
    				new1.value=""
    				newDiv.append(new1)
    			}
    			
    		}
        newDiv.appendChild(document.getElementById("button_new_lot"));
        container.appendChild(newDiv)        
        
    	}
    	b=document.getElementById("button_new_lot");
    	if(b!=null){
    		b.addEventListener("click",newLot);
    	}
    </script>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
  </body>
  
</html>