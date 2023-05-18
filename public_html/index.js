/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL="http://api.login2explore.com:5577";
var jpdbIRL="/api/irl";
var jpdbIML="/api/iml";
var empDBName="SCHOOL-DB";
var empRelationName="STUDENT-TABLE";
var connToken="90933188|-31949319807818497|90951095"; 
$("#studentid").focus();


function getEmpIdAsJsonObj(){
    var studentid=$('#studentid').val();
    var jsonStr={
        id:studentid
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record=JSON.parse(jsonObj.data).record;
    $("#studentname").val(record.studentname);
    $("#class").val(record.class);
    $("#birthdate").val(record.birthdate);
    $("#address").val(record.address);
    $("#enroll").val(record.enroll);
    
}

function getStudent(){
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false); 
        $("#reset").prop("disabled",false);
        $("#studentname").focus();
    
    } else if (resJsonObj.status === 200) {
        $("#studentid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false); 
        $("#reset").prop("disabled",false);        
        $("#studentname").focus();
    }
}
function resetForm() {
    $("#studentid").val("");
    $("#studentname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enroll").val("");
    $("#studentid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#studentid").focus();
}
function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken,
            jsonStrObj, empDBName,empRelationName);

    jQuery.ajaxSetup({async: false});
    var reJsonObj = executeCommandAtGivenBaseUrl(putRequest,"http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#studentid").focus();
}

function validateData() {
    var studentid = $("#studentid").val();
    if (studentid === "") {
        alert("Student ID Required Value");
        $("#studentid").focus();
        return "";
    }
    var studentname = $("#studentname").val();
    if (studentname === "") {
        alert("Student Name is Required");
        $("#studentname").focus();
        return "";
    }
    var sclass = $("#class").val();
    if (sclass === "") {
        alert("Class is missing");
        $("#class").focus();
        return "";
    }
    var birthdate= $("#birthdate").val();
    if (birthdate === "") {
        alert("DOB is missing");
        $("#birthdate").focus();
        return "";
    }
    var enroll = $("#enroll").val();
    if (enroll === "") {
        alert("Enrollment-Date is missing");
        $("#enroll").focus();
        return "";
    }
    var address = $("#address").val();
    if (address === "") {
        alert("Address is Required ");
        $("address").focus();
        return "";
    }    
    var jsonStrObj = {
        id: studentid,
        name: studentname,
        class: sclass,
        address:address,
        enroll:enroll,
        birthdate:birthdate
    };
    return JSON.stringify(jsonStrObj);
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonChg=validateData(); 
    var updateRequest=createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,
            "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj); 
    resetForm();
    $("#studentid").focus();    
}


