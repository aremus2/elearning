<cfcomponent extends="framework.one">
  
  <cfscript>
    if(server.debug==1){
      writedump("elearning.cfc")
    }
    // FW/1 - configuration:
    variables.framework = {
      //home = "blog.default",
      home = "home.default",
          trace = false,
          /*[AR]Framework One instant reload.*/
      reloadApplicationOnEveryRequest = true
    };
    function setupSession(){
    }
  </cfscript>
  
</cfcomponent>