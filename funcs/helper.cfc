<cfcomponent >
	<cfscript>
		string=createObject("component","cfc.string")
	</cfscript>
	
	<!--- EVALUATE BEGIN --->
	<cffunction name="evaluate" >
		<cfargument name="term" >
		<cfscript>
      var ret=""
			try{
        writedump(var=arguments.term,label="try")
				ret=evaluate(arguments.term)
        writedump(var=ret,label="tried")
			}
			catch ( any error ){
        writedump(var=ret,label="catch")
        return ret
      }
      return ret
		</cfscript>
	</cffunction>
	<!--- EVALUATE END --->
	
	<!--- GETLOTS BEGIN --->
  <cffunction name="getLots" >
    <cfargument name="invoice_lots" >
    <cfscript>
      ret=arrayNew()
      var lines=string.split(arguments.invoice_lots,string.detectNewLineType(arguments.invoice_lots))
      for(line in lines){
        var s=structNew()
        atts=string.split(line,chr(9))
        for(att in atts){
        	s0=structNew()
          sep=string.split(att,"=")
          type=string.split(sep[1],":")
          s0["type"]=type[1]
          s0["db"]=sep[2]
          s0["user"]=""
          s[type[2]]=s0
        }
        arrayAppend(ret,s)
      }
      return ret
    </cfscript>
  </cffunction>
  <!--- GETLOTS END --->
	
	<!--- NEWSTRUCT BEGIN --->
	<cffunction name="newStruct" >
	 <cfargument name="value" >
	 <cfargument name="type" >
	 <cfscript>
	 	var type0=""
	 	if(arguments.type=="date"){
	 		type0="d"
	 	}
	 	else if(arguments.type=="character varying"){
	 		type0="c"
	 	}
	 	else if(arguments.type=="text"){
	 		type0="t"
	 	}
	 	else if(arguments.type=="integer"){
	 		type0="i"
	 	}
	 	else{
	 		throw
	 	}
	 	ret=structNew()
	 	ret["db"]=arguments.value
	 	ret["user"]=""
	 	ret["type"]=type0
	 	return ret
	 </cfscript>
	</cffunction>
	<!--- NEWSTRUCT END --->
	
	<!--- ROW2STRUCT BEGIN --->
	<cffunction name="row2struct" >
		<cfargument name="q">
		<cfargument name="rowNumber" >
		<cfscript>
      var i = 0
      var rowData = StructNew()
      var cols    = ListToArray(q.columnList)
      for (i = 1; i lte ArrayLen(cols); i = i + 1) {
      	var q1=new query()
      	q1.addParam(name="column_name",cfsqltype="cf_sql_varchar",value=lCase(cols[i]))
      	q1.setSql("
      	 SELECT data_type 
      	 FROM information_schema.columns
      	 WHERE table_name='invoices'
      	 AND column_name=:column_name
      	")
      	var type=q1.execute().getResult().data_type
      	news=newStruct(q[cols[i]][rowNumber],type)
        rowData[cols[i]] = news
      }
      return rowData
		</cfscript>
	</cffunction>
	<!--- ROW2STRUCT END --->
</cfcomponent>