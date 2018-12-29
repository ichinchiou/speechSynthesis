var synth;
const MAX_DIGIT = 10;

var init = function(){
    synth = window.speechSynthesis;
    initButtonClick();
    
    initVoiceSelect();

    initDigitClick();
};

var initVoiceSelect = function() {
    var voiceSelect = document.getElementById("langSelect");
    var voices = [];
    var populateVoiceList = function() {
        voices = synth.getVoices();
        // default: Google UK English Female (en-GB)
        var selectedIndex = voiceSelect.selectedIndex < 0 ? 6 : voiceSelect.selectedIndex;
        voiceSelect.innerHTML = '';
        for(i = 0; i < voices.length ; i++) {
            var option = document.createElement('option');
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
            
            // if(voices[i].default) {
            //     option.textContent += ' -- DEFAULT';
            // }

            option.setAttribute('data-lang', voices[i].lang);
            option.setAttribute('data-name', voices[i].name);
            if(i==6){ 
                // default: Google UK English Female (en-GB)
                option.setAttribute('selected', true);
            }
            voiceSelect.appendChild(option);
        }
        voiceSelect.selectedIndex = selectedIndex;
    }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
};

var initButtonClick = function() {
    $("#speak").on("click", function(){
        synthesis.speakDigits();
        $("#repeat").removeClass("disabled");
    });
    $("#repeat").on("click", function(){
        synthesis.repeatDigits();
    });
};

var initDigitClick = function() {
    $("#digits").on("click", "label", function(e){
        var $labelElem = $(e.target).closest("label");
        if($labelElem.hasClass("active")){
            $labelElem.find("span").text("0");
        } else {
            $labelElem.find("span").text("X");
        }
    });
};

var synthesis = {
    getVoiceObject: function(){
        var voices = synth.getVoices();
        var selectedOption = $("#langSelect").find("option:selected")[0].getAttribute('data-name');
        for(i = 0; i < voices.length ; i++) {
            if(voices[i].name === selectedOption) {
                return voices[i];
            }
        }
    },
    speakDigits: function(){
        var activeDigitsIdx = getActiveDigitsIdx();
        var text = "";
        for(var i=0; i<MAX_DIGIT; i++){
            // +1 是為了避免出現 0 的狀況
            text += (activeDigitsIdx.indexOf(i)!=-1)? Math.floor(Math.random()*(MAX_DIGIT-1))+1: "0";
        }
        $("#dispDigits").text(utils.commafy(Number(text))).data("value", text);
        synthesis.speak(text);
    },
    repeatDigits: function(){
        var lastTimeText = $("#dispDigits").data("value");
        synthesis.speak(lastTimeText);
    },
    speak: function(text) {
        var utterThis = new SpeechSynthesisUtterance(Number(text));
        utterThis.voice = synthesis.getVoiceObject();
        synth.speak(utterThis);
    }
};

var getActiveDigitsIdx = function() {
    var activeDigitsIdx = [];
    $("#digits > label").map(function(index, elem){
        if($(elem).hasClass("active")){
            activeDigitsIdx.push(index);
        }
    });
    return activeDigitsIdx;
};

var utils = {
    commafy: function(nStr) {
        if (nStr == null) {
            return "";
        }
        
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
};

window.onload = init;