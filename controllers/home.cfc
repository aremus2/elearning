<cfcomponent accessors="true">
	<cfscript>
		misc=createObject("component","cfc.misc")
		helper=createObject("component","funcs.helper")
		string=createObject("component","cfc.string")
	</cfscript>
	<!--- DEFAULT BEGIN --->
	<cffunction name="default" >
		<cfargument name="rc" >
		<cfscript>
      rc["solve"]="false"
      // SHOW DOCUMENT BEGIN
      var q=new query()
      if(structKeyExists(rc,"id")){
        q.addparam(name="invoice_id",cfsqltype="cf_sql_int",value=rc.id)
        q.setsql("
          select *
          from invoices
          where invoice_id =:invoice_id
        ")
        
      }
      else{
      	q.setsql("
          select *
          from invoices
          limit 1
        ")
      }
      
      var r=q.execute().getresult()
      var s=helper.row2struct(r,r.invoice_id)
      rc.invoice=s
      rc.invoice["invoice_lots"]=helper.getLots(r.invoice_lots)
      // SHOW DOCUMENT END
			
			// LOGOut begin
      if(structkeyexists(rc, "do")){
        if(rc.do == "logout"){
          structdelete(session, "loginid")
          structdelete(session, "user")
          location("index.cfm" ,false)
        }
      }
      // logout end
      // LOGIN BEGIN
      if(structkeyexists(form, "name")
      && structkeyexists(form, "pass")){
        local.name = rc.name;
        local.pass = rc.pass;
        var q = new query();
        q.addparam(name = "name", cfsqltype="cf_sql_varchar", value = local.name);
        q.addparam(name = "pass",cfsqltype="cf_sql_varchar", value =local.pass);
        q.setsql("
          select user_id
          from users
          where user_login = :name
          and user_pass = :pass
        ");
        var r=q.execute().getresult();
        if(r.recordcount!=1){
          return 1;
        }
        else{
          session.loginid=r.user_id[1];
          var d0=new query()
          d0.addparam(name="user_id",cfsqltype="cf_sql_int",value=session.loginid)
          d0.setsql("
            select user_name_first
            from users
            where user_id=:user_id
          ")
          d0=d0.execute().getresult()
          session["user"]=structnew()
          session.user["user_name"]=d0.user_name_first
        }
      
      }
      // LOGIN END
			
			// VERIFY BEGIN
			writedump(var=rc.invoice,label="1")
			if(structKeyExists(rc,"verify")){
				if(structKeyExists(form,"fieldNames")){
					var formlist=string.split(form.fieldNames,",")
  				for(var i=1;i<arrayLen(formlist);i++){
  					//
  				  if(string.find(formlist[i],"$")!=-1){
  					  var fieldlist=string.split(formlist[i],"$")
              var fieldname=fieldlist[1]
  						if(structKeyExists(rc.invoice,fieldname)){
  							var temp=string.searchRe(fieldlist[2],"([^0-9]+)([0-9]+)")
  							var subfieldname=temp[1][1]
  							var fieldindex=temp[1][2]
  							rc.invoice[fieldname][fieldindex][subfieldname]["user"]=form[formlist[i]]
  						}
  						else{
                rc.invoice[formlist[i]].user=form[formlist[i]]
  						}
  					}
  				}
  				rc["solve"]="true"
				}
				/*writedump(form)
				writedump(var=rc.invoice,label="2")*/
			}
			// VERIFY END
			
		</cfscript>
	</cffunction>
	<!--- DEFAULT END --->
	
	
	
</cfcomponent>