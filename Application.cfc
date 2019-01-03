component {
    server.debug=0;
  if(server.debug==1){
      writedump("[ENTRY]Application.cfc")
  }
    // copy this to your application root to use as your Application.cfc
    // or incorporate the logic below into your existing Application.cfc

    // you can provide a specific application name if you want:
    //this.name = hash( getBaseTemplatePath() );
    this.name = 'elearning';
    this.datasource = "elearning";

    // any other application settings:
    this.sessionManagement = true;
    days=10;
    hours=0;
    minutes=10;
    seconds=10;
    server.secondsTimeout=seconds+minutes*60+hours*60*60+days*24*60*60;
    server.timeout = createTimeSpan( days, hours, minutes, seconds );
  this.sessionTimeout = server.timeout;
  // set up per-application mappings as needed:
    //this.mappings[ '/framework' ] = expandPath( '../../framework' );
    this.mappings["/cfc"] = expandpath('./j');
    this.mappings["/funcs"] = expandpath('./funcs');
    

    function _get_framework_one() {
        if ( !structKeyExists( request, '_framework_one' ) ) {

            // create your FW/1 application:
            request._framework_one = new elearning();

        }
        return request._framework_one;
    }

    // delegation of lifecycle methods to FW/1:
    function onApplicationStart() {
      if(server.debug==1){
        writedump("onApplicationStart")
    }
        return _get_framework_one().onApplicationStart();
    }
    
    function onError( exception, event ) {
      if(server.debug==1){
        writedump("onError")
    }
        return _get_framework_one().onError( exception, event );
    }
    
    function onRequest( targetPath ) {
      if(server.debug==1){
        writedump("onRequest: " & targetPath)
    }
        return _get_framework_one().onRequest( targetPath );
    }
    
    function onRequestEnd() {
      if(server.debug==1){
        writedump("onRequestEnd")
    }
        return _get_framework_one().onRequestEnd();
    }
    
    function onRequestStart( targetPath ) {
      if(server.debug==1){
        writedump("onRequestStart")
    }
        return _get_framework_one().onRequestStart( targetPath );
    }
    
    function onSessionStart() {
      if(server.debug==1){
        writedump("onSessionStart")
    }
        return _get_framework_one().onSessionStart();
    }
    function onSessionEnd(){
      if(server.debug==1){
        writedump("onSessionEnd")
    }
    }
    if(server.debug==1){
      writedump("[EXIT]Application.cfc")
  }
}