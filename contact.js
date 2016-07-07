$(function() {
  var dialog, form,
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    name = $( "#name" ),
    email = $( "#email" ),
    company = $( "#company" ),
    region = $( "#region" ),
    cc = $( "#cc" ),
    allFields = $( [] ).add( name ).add( email ).add( company ).add( region ).add( cc ),
    tips = $( ".validateTips" );
  function updateTips( t ) {
    tips
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
      tips.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
  }

function getToken(){
  if (window.XMLHttpRequest){
	xmlhttp=new XMLHttpRequest();
}else{
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
  xmlhttp.open("GET","/Portals/0/tokenAcces.xml",false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;
  var keys =xmlDoc.getElementsByTagName("key");
  token=keys[0].getElementsByTagName("token")[0].childNodes[0].nodeValue
  return token;
}

  function checkLength( o, n, min, max ) {
    if ( o.val().length > max || o.val().length < min ) {
      o.addClass( "ui-state-error" );
      updateTips( "Length of " + n + " must be between " +
        min + " and " + max + "." );
      return false;
    } else {
      return true;
    }
  }

  function checkRegexp( o, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
      o.addClass( "ui-state-error" );
      updateTips( n );
      return false;
    } else {
      return true;
    }
  }

  function addUser() {
    var valid = true;
    allFields.removeClass( "ui-state-error" );
    var dict="";
    valid = valid && checkLength( name, "username", 3, 16 );
    valid = valid && checkLength( email, "email", 6, 80 );
    valid = valid && checkLength( company, "company", 0, 16 );
    valid = valid && checkLength( region, "region", 3, 16 );

    valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
    valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
    valid = valid && checkRegexp( company, /^([0-9a-zA-Z])+$/, "Company field only allow : a-z " );
    valid = valid && checkRegexp( region, /^([0-9a-zA-Z])+$/, "Region field only allow : a-z ");
    if ( valid ) {
      cc=$("#cc").is(":checked");
      dict+= name.val() +" "+ email.val() +" "+ company.val() +" "+ region.val() + " "+ cc;
      var token = getToken();
      var github = new Github({token:token,auth:"oauth"});
      var file = name.val();
      var texto = JSON.stringify(dict);
      var rep = github.getRepo("jenniRC", "DNN");
      rep.write('master',file, texto, "Download",function(err) {});//Cambiar master por gh-pages
      dialog.dialog( "close" );
    }
    return valid;
  }

  dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      "Submit": addUser,
    },
    close: function() {
      form[ 0 ].reset();
      allFields.removeClass( "ui-state-error" );
    }
  });

  form = dialog.find( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    addUser();
  });
  $(" #contact-form a.contact").click( function(event) {
    var ok=GetCookie("cookies_download");
    if (ok==null){
      dialog.dialog( "open" );
      event.preventDefault();
      alert("COOKINOT");
    }
    aceptar_cookies();
        var ok3=GetCookie("cookies_download");
    alert(ok3);
  });
});

function GetCookie(name) {
var arg=name+"=";
var alen=arg.length;
var clen=document.cookie.length;
var i=0;

while (i<clen) {
    var j=i+alen;

    if (document.cookie.substring(i,j)==arg)
        return "1";
    i=document.cookie.indexOf(" ",i)+1;
    if (i==0)
        break;
}

return null;
}

function aceptar_cookies(){
var expire=new Date();
expire=new Date(expire.getTime()+7776000000);
document.cookie="cookies_download=aceptada; expires="+expire;
}
