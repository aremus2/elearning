<cfcomponent >
<cfscript>
	helper=createObject("component", "funcs.helper")
</cfscript>
<cfoutput >
	<!--- PRINTFORM BEGIN --->
	<cffunction name="printForm" >
		<cfargument name="solve" default="false" >
		<cfargument name="invoice" >
		<cfscript>
			var color_fail="##e08484"
			var color_success="##bee084"
			
			var invoice_recipient_name_tooltip ="The invoice recipient, the adress the invoice was sent to."
			var invoice_sender_name_tooltip    ="Sender"
			var invoice_number_tooltip         ="Invoice number"
			var invoice_date_tooltip           ="Invoice date"
      var invoice_ustid_tooltip          ="Invoice ustid"
      var invoice_tax_id_tooltip         ="Invoice tax id"
			var invoice_iscredit_tooltip       ="iscredit"
			var invoice_isinvoice_tooltip      ="isinvoice"
			var invoice_lots_pos_tooltip       ="The lot number of the lot item. If no lot number is printed on the invoice, please leave this field blank."
			var invoice_lots_artno_tooltip     ="artno"
			var invoice_lots_desc_tooltip      ="desc"
			var invoice_lots_amount_tooltip    ="amnt"
			var invoice_lots_ppi_tooltip       ="ppi"
			var invoice_lots_ptot_tooltip      ="Total price, amount of items times the price per single item"
			var invoice_lots_hasartno_tooltip  ="hasartno tooltip"
			
			var invoice_recipient_name_placeholder ="Recipient"
      var invoice_sender_name_placeholder    ="Sender"
      var invoice_number_placeholder         ="Invoice number"
      var invoice_date_placeholder           ="Invoice date"
      var invoice_ustid_placeholder          ="Invoice ustid"
      var invoice_tax_id_placeholder         ="Invoice tax id"
      var invoice_lots_pos_placeholder       ="Lot position"
      var invoice_lots_artno_placeholder     ="Lot article number"
      var invoice_lots_desc_placeholder      ="Lot description"
      var invoice_lots_amount_placeholder    ="Lot amount"
      var invoice_lots_ppi_placeholder       ="Price per item"
      var invoice_lots_ptot_placeholder      ="Price total"
      var invoice_lots_hasartno_placeholder  ="hasartno PH"
		</cfscript>
		<form id=dataform name="dataform" method="post" action="index.cfm?action=home.default&id=1&verify=true">
      <input type="submit">
      <div style="border:1px dashed black">
        <div id="container_lots">
      	<cfif #arguments.solve# == "true">
          <cfset var counter=1>
          <!---<cfdump var=#arguments.invoice# label="2">--->
      		<cfloop array="#arguments.invoice.invoice_lots#" index="lot">
    			<div id="#field#" style="margin:1px;border:1px solid black;">
    				<cfset fieldnames=#structKeyArray(#lot#)#>
    				<cfloop array="#fieldnames#" index="field">
    					<cfscript>
    						if(evaluate("lot.#field#.db")!=evaluate("lot.#field#.user")){
    							var color=color_fail
    						}
    						else{
    							var color=color_success
    						}
    						var fieldtype=evaluate("lot.#field#.type")
    						if(fieldtype=="b"){
    							var placeholder=""
    							var type="checkbox"
    						}
    						else{
    							var placeholder="#evaluate("invoice_lots_#field#_placeholder")#"
                  var type="text"
    						}
    					</cfscript>
    					<input  name="invoice_lots$#field##counter#"
    					        id="invoice_lots_#field##counter#"
                      placeholder="#placeholder#"
                      title="#evaluate("lot.#field#.db")# "
                      value="#evaluate("lot.#field#.user")#"   
                      type="#type#"
                      style="background-color:#color#" 
                      disabled>
    				</cfloop>
          </div>
          <cfset counter=#counter+1#>
      		</cfloop>
      	<cfelseif #arguments.solve#=="false">
          <cfset itemlist=#structKeyArray(arguments.invoice)#>
          <cfloop array=#itemlist# index=field>
          	<cfset temp="#evaluate("arguments.invoice.#field#")#">
          	<cfif #isArray(temp)#>
          		<div class=array_container>
          			<p>#field#</p>
            		<cfset itemlist2=#structKeyArray(temp[1])#>
                <div id="lot_1" class=array>
            		<cfloop array=#itemlist2# index=field2>
            			<cfscript>
            				var fieldtype=evaluate("temp[1].#field2#.type")
                    if(fieldtype=="b"){
                      var placeholder=""
                      var type="checkbox"
                      var text="#evaluate("#field#_#field2#_placeholder")#"
                    }
                    else{
                      var placeholder="#evaluate("#field#_#field2#_placeholder")#"
                      var type="text"
                      var text=""
                    }
            			</cfscript>
            			<input 
                     name="invoice_lots$#field2#1"
                     id="invoice_lots_#field2#1"
                     placeholder="#placeholder#"
                     title="#evaluate("#field#_#field2#_tooltip")#"
                     type=#type#>#text#<br>
            		</cfloop>
                  <input id="button_new_lot" type="button" style="display:inline-block" title="Add another lot">
            		</div>
          		</div>
          	<cfelseif !#isArray(temp)#>
          	  <cfif #field#=="invoice_path"||#field#=="invoice_id">
          	   <cfcontinue>	
          	  </cfif>
            	<cfscript>
                var fieldtype=evaluate("arguments.invoice.#field#.type")
                if(fieldtype=="b"){
                  var placeholder=""
                  var type="checkbox"
                }
                else{
                  var placeholder=evaluate("#field#_placeholder")
                  var type="text"
                }
              </cfscript>
              <input 
                     name="#field#"
                     id="#field#"
                     placeholder="#placeholder#"
                     title="#evaluate("#field#_tooltip")#"
                     type=#type#>
          	</cfif><!---isArray --->
          </cfloop>
          </div>
        </cfif><!---arguments.solve --->
        </div>
      </div>
  </form>
	</cffunction>
	<!--- PRINTFORM END --->
</cfoutput>
</cfcomponent>