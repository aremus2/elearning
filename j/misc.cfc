component{
	public string function newline(){
		return chr(13)&chr(10)
	}
	public function row2struct(q, rowNumber){
		var i = 0
        var rowData = StructNew()
        var cols    = ListToArray(q.columnList)
        for (i = 1; i lte ArrayLen(cols); i = i + 1) {
            rowData[cols[i]] = q[cols[i]][rowNumber]
        }
        return rowData
	}
	public function query2array(q){
		ret=arraynew()
		for(i=1;i<=q.recordcount();++i){
			s=row2struct(q,i)
			arrayappend(ret,s)
		}
		return ret
	}
}//component{