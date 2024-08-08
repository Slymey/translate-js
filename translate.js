const translateEscapePolicy = (()=>{
    try{ 
        return (window.trustedTypes && trustedTypes.createPolicy)?trustedTypes.createPolicy('translate-deafult', {
            createHTML: s => s,
            createScript: s => s,
            createScriptURL: s => s
        }):undefined;
    }catch(e){return undefined;}
 })();
function translate(ell, lang, base=null, mandatory=null, optional=null, escapePolicy=null, maxdepth=32){
function parseToken(string, lang, depth = 0){
    var out="";
    var token="";
    for(var j=0;j<string.length;j++){
        var c = string.charAt(j);
        if(c=='$'||token!=""){
            if(token==""){
                token="$";
                continue;
            }else if(c=="$"){
                if(token.length>1){
                    if(depth>maxdepth){
                        out+=lang[token.substring(1)];
                    }else{
                        out+=parseToken(lang[token.substring(1)], lang, depth+1);
                    }
                }else{
                    out+="$";
                }
                token="";
                continue;
            }else{
                token+=c;
            }
        }else{
            out+=c;
        }
    }
    return out;
}
function parseVal(ell, lang){
    var trval = ell.getAttribute("translation-value");
    if(trval==null)return [];
    if(trval.indexOf(",")>=0){
        var trvals = trval.split(",");
    }else{
        var trvals = [trval];
    }
    var values = [];
    for(var i=0;i<trvals.length;i++){
        if(trvals[i].indexOf(":")<0)continue;
        var spl= trvals[i].split(":");
        if(spl[1].indexOf("$")>=0){
            spl[1]=parseToken(spl[1], lang);
        }
        values[spl[0]]=spl[1];
    }
    return values;
}
function getEllValue(string, lang, mandatory, attribute, optional, depth = 0){
    var out="";
    var val="";
    var hadVal=false;
    for(var j=0;j<string.length;j++){
        var c = string.charAt(j);
        if((c=='%'||val!="")){
            if(val==""){
                val="%";
                continue;
            }else if(c=="%"){
                if(val.length>1){
                    var name = val.substring(1);
                    var value = undefined;
                    if(mandatory!=undefined&&mandatory!=null)value = mandatory[name];
                    if(value==undefined&&attribute!=undefined&&attribute!=null)value = attribute[name];
                    if(value==undefined&&optional!=undefined&&optional!=null)value = optional[name];
                    if(value==undefined)value = "";
                    out+=value;
                    hadVal=true;
                }else{
                    out+="%";
                }
                val="";
                continue;
            }else{
                val+=c;
            }
        }else{
            out+=c;
        }
    }
    if(hadVal&&depth<=maxdepth){
        out = getEllValue(string, lang, mandatory, attribute, optional, depth+1);
    }
    return out;
}
function managePolicy(value, policy, defaultPolicy){
    var trustedText;
    if(policy!=null){
        trustedText = policy.createHTML(val);
    }else if(defaultPolicy!=undefined){
        trustedText = defaultPolicy.createHTML(val);
    }else{
        trustedText = value;
    }
    return trustedText;
}

if(ell.classList!=undefined&&ell.classList.contains("translatable")){
    var all = [ell];
}else{
    var all = ell.querySelectorAll(".translatable");
}

for(var i=0;i<all.length;i++){
    var txt = undefined;;
    if(base!=null){
        var id = all[i].getAttribute("translation-id");
        txt = base[id];
    }
    if(txt==undefined)txt = all[i].getAttribute("translation-text");
    var token = parseToken(txt, lang);
    var attr = parseVal(all[i], lang);
    var val = getEllValue(token, lang, mandatory, attr, optional);
    all[i].innerHTML=managePolicy(val, escapePolicy, translateEscapePolicy);
}
}