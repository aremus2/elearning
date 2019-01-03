component{
	
	this.messagecount=0
	this.outfile="C:/Users/Alexander Remus/Documents/log.txt"
	
	public any function write(text,indent=0){
		fw=createObject("Java","java.io.FileWriter");
		fw.init(this.outfile,true);
		bw=createobject("Java", "java.io.BufferedWriter");
		bw.init(fw);
		spaces=""
		for(i=0;i<indent;++i){
			spaces=spaces&" "
		}
		str=formatBaseN(this.messagecount++, 16)
		pad=repeatString("0", 10 - len(str))
		str=pad&str
		bw.write("["&str&"] "&dateformat(now(), "[yyyy-mm-dd")&" | "&timeformat(now(),"HH:MM:SS.lll] ")&spaces&text);
		bw.newLine();
		bw.close();
	}
	
	//
}