(function(){var useLocalStorage=!!localStorage;var STORAGE_KEY_NAME="fa-qu";var retryTimeout;var eventTimeout;var analyticsURL="https://analytics.forms.app";var isOnline=true;var isClosing=false;var queues=getValueFromStorage(STORAGE_KEY_NAME);if(!Array.isArray(queues)){queues=[];}
function fireEvent(events,sendQueue,callback){if(retryTimeout){clearTimeout(retryTimeout);}
sendXmlHttpRequest(events,callback?(status)=>{if(!status){if(sendQueue){sendToQueue(events);}
setValueInStorage(STORAGE_KEY_NAME,queues);retryTimeout=setTimeout(function(){fireEventFromQueue();},2000);}else{retryTimeout=null;}
callback(status);}:null);}
function sendToQueue(events){queues.push(...events);}
function sendXmlHttpRequest(events,callback){try{var URL=analyticsURL+"/e";var eventData={sdk:'web',events};eventData=JSON.stringify(eventData);if(callback){var xhr=null;if(window.XMLHttpRequest){xhr=new window.XMLHttpRequest();}else if(window.ActiveXObject){xhr=new window.ActiveXObject("Microsoft.XMLHTTP");}
xhr.withCredentials=true;xhr.open("POST",URL,true);xhr.setRequestHeader("Content-type","text/plain");xhr.onreadystatechange=function(){if(this.readyState===4){if(this.status===200){isOnline=true;var response=JSON.parse(this.responseText);if(response){delete response.trackId;for(let key in response){createCookie(key,response[key]);}}
callback(true);}else{isOnline=false;callback(false);}}};xhr.send(eventData);}else{if(isOnline&&navigator.sendBeacon){let result=navigator.sendBeacon(URL,new Blob([eventData],headers={type:"text/plain"}));if(result){removeValueFromStorage(STORAGE_KEY_NAME);}}}}catch(e){if(callback){callback(false);}}}
function readCookie(cookieKey){var cookies=document.cookie?document.cookie.split('; '):[];var jar={};for(var i=0;i<cookies.length;i++){var parts=cookies[i].split('=');var cookie=parts.slice(1).join('=');jar[parts[0]]=cookie;}
return jar[cookieKey];}
function createCookie(name,value,days=365){var expires="";if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toGMTString();}
var mainDomain=window.location.hostname.split(".");mainDomain="."+mainDomain[mainDomain.length-2]+"."+mainDomain[mainDomain.length-1];document.cookie=name+"="+value+expires+";domain="+mainDomain+";path=/";}
function getValueFromStorage(key){var data;if(useLocalStorage){data=localStorage.getItem(key);}else{data=readCookie(key);}
return JSON.parse(data);}
function setValueInStorage(key,value){if(typeof value!=="undefined"&&value!==null){var jsonValue=JSON.stringify(value);if(useLocalStorage){localStorage.setItem(key,jsonValue);}else{createCookie(key,jsonValue);}}}
function removeValueFromStorage(key){if(useLocalStorage){localStorage.removeItem(key);}else{createCookie(key,"",-1);}}
function routeGetParameterByName(name,url=window.location.href){name=name.replace(/[\[\]]/g,'\\$&');var regex=new RegExp('[?&]'+name+'(=([^&#]*)|&|#|$)');var results=regex.exec(url);if(!results){return null;}
if(!results[2]){return '';}
return decodeURIComponent(results[2].replace(/\+/g,' '));}
function fireEventFromQueue(immediately){if(queues&&queues.length>0){fireEvent(queues,false,!immediately?function(status){if(status){removeValueFromStorage(STORAGE_KEY_NAME);queues=[];}}:null);}}
if(Array.isArray(window.faDataLayer)&&window.faDataLayer.length>0){sendToQueue(window.faDataLayer);}
var source=routeGetParameterByName('utm_source');var visitEvent={eventName:'visit',referrer:document.referrer,path:window.location.hostname+window.location.pathname};if(source){visitEvent.source=source;visitEvent.medium=routeGetParameterByName('utm_medium');visitEvent.campaign=routeGetParameterByName('utm_campaign');visitEvent.term=routeGetParameterByName('utm_term');visitEvent.gclid=routeGetParameterByName('gclid');localStorage.setItem('source',source);createCookie('source',source);sendToQueue([visitEvent]);}else{var alreadyVisited=readCookie('__fa-v');if(!alreadyVisited){sendToQueue([visitEvent]);}}
sendToQueue([{...visitEvent,eventName:'traffic'}]);createCookie('__fa-v',1,0.25);fireEventFromQueue();window.faDataLayer=new Proxy([],{set:(obj,prop,value)=>{if(prop!=="length"){var pushEvent=new CustomEvent("fadatalayerpush",{detail:value});window.dispatchEvent(pushEvent);}
return Reflect.set(obj,prop,value);}});window.addEventListener("fadatalayerpush",event=>{sendToQueue([event.detail]);if(isClosing){setValueInStorage(STORAGE_KEY_NAME,queues);return fireEventFromQueue(true);}
clearTimeout(eventTimeout);eventTimeout=setTimeout(function(){fireEventFromQueue();},1000);});window.addEventListener('beforeunload',()=>{setValueInStorage(STORAGE_KEY_NAME,queues);fireEventFromQueue(true);isClosing=true;});})();