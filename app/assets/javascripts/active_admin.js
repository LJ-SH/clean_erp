//= require active_admin/base

$(document).on('change', '#component_category_ancestry_depth', function() {	
  $.ajax({
    url: "/admin/component_categories/category_select",
    type: "get",
    data: {"category_type" : $(this).val()},
    //dataType: "script",
    dataType: "html",
    success: function(data){
      $("#active_admin_content").empty();
      $("#active_admin_content").append(data);
    }
  })
});

$(document).on('change', '#component_category_level0', function() {		
  $.ajax({
    url: "/admin/component_categories/level1_collection",
    type: "GET",
    data: "level0=" + $(this).val(),
    dataType: "json",
    success: function(data){
      var level1 = $("#component_category_level1");
      level1.empty();
      level1.append("<option value=''></option>");       
      $.each(data, function(index, value) {
        // append an option
        var opt = $('<option/>');
        // value is an array: [:id, :name]
        opt.attr('value', value[0]);
        // set text
        opt.text(value[1]);
        // append to select
        opt.appendTo(level1);
      });    
      var level2 = $("#component_category_level2");
      level2.empty();
      level2.append("<option value=''></option>");
      level2.append("<option value=''>请选择分类类型</option>");        
    }
  })
}); 

$(document).on('change', '#component_category_level1', function() {			
  $.ajax({
    url: "/admin/component_categories/level2_collection",
    type: "GET",
    data: "level1=" + $(this).val(),
    dataType: "json",
    success: function(data){
      var level2 = $("#component_category_level2");
      level2.empty();
      level2.append("<option value=''></option>");       
      $.each(data, function(index, value) {
        // append an option
        var opt = $('<option/>');
        // value is an array: [:id, :name]
        opt.attr('value', value[0]);
        // set text
        opt.text(value[1]);
        // append to category_select
        opt.appendTo(level2);
      });      
    }
  })
});

//$("#new_component_category").live('submit', function() {
$(document).on('submit', '#new_component_category', function() {  
    var form = $(this);
    var depth = form.find("#component_category_ancestry_depth").val();
    var ancestry_input = form.find("#component_category_ancestry");
    var ancestry_value;
    var errMsg = "请选择正确的值";

    if (depth == 0) {
      //ancestor is nil 
      ancestry_input.parent('li').remove();
      return true;
    }

    if (depth == 1) {
      var level0_element = $("#component_category_level0");
      if (!fn_integer_id_validate(level0_element.val())) {  
        if($("#new_category_level0_err_tip").length == 0) {
          var errTip = $('<p class="inline-errors" id="new_category_level0_err_tip"></p>').html(errMsg);
          level0_element.after(errTip);          
        }
        //event.preventDefault();
        return false;
      } else {
        ancestry_input.val(level0_element.val());
        return true;
      }
    }

    if (depth == 2) {
      var level0_element = $("#component_category_level0");
      var level1_element = $("#component_category_level1");
      if (!fn_integer_id_validate(level0_element.val())) {
        if($("#new_category_level0_err_tip").length == 0) {
          var errTip = $('<p class="inline-errors" id="new_category_level0_err_tip"></p>').html(errMsg);
          level0_element.after(errTip);          
        } 
        return false;
      }
      if (!fn_integer_id_validate(level1_element.val())) {
        if($("#new_category_level1_err_tip").length == 0) {
          var errTip = $('<p class="inline-errors" id="new_category_level1_err_tip"></p>').html(errMsg);
          level1_element.after(errTip);          
        } 
        return false;
      }  
      //value have been verified already
      ancestry_input.val(level0_element.val()+"/"+level1_element.val());
      return true;
    }

    if (depth == 3) {
      var level0_element = $("#component_category_level0");
      var level1_element = $("#component_category_level1");
      var level2_element = $("#component_category_level2");
      if (!fn_integer_id_validate(level0_element.val())) {
        if($("#new_category_level0_err_tip").length == 0) {
          var errTip = $('<p class="inline-errors" id="new_category_level0_err_tip"></p>').html(errMsg);
          level0_element.after(errTip);          
        } 
        return false;
      }
      if (!fn_integer_id_validate(level1_element.val())) {
        if($("#new_category_level1_err_tip").length == 0) {
          var errTip = $('<p class="inline-errors" id="new_category_level1_err_tip"></p>').html(errMsg);
          level1_element.after(errTip);          
        } 
        return false;
      }
      if (!fn_integer_id_validate(level2_element.val())) {
        if($("#new_category_level2_err_tip").length == 0) {
          var errTip = $('<p class="inline-errors" id="new_category_level2_err_tip"></p>').html(errMsg);
          level2_element.after(errTip);          
        } 
        return false;
      }        
      //value have been verified already
      ancestry_input.val(level0_element.val()+"/"+level1_element.val()+"/"+level2_element.val());
      return true;
    }
});

function fn_integer_id_validate(value) {
  //digital with 3-5 bits
  var regExp = new RegExp(/^\d{1,3}$/);  
  return regExp.test(value);
}


//functions related with category search panel
$(document).on('change', '#q_level0_eq', function() { 
  $.ajax({
    url: "/admin/component_categories/level1_collection",
    type: "GET",
    data: "level0=" + $(this).val(),
    dataType: "json",
    success: function(data){
      var level1 = $("#q_level1_eq");
      level1.empty();
      level1.append("<option value=''>任何</option>");
      $.each(data, function(index, value) {
        // append an option
        var opt = $('<option/>');
        // value is an array: [:id, :name]
        opt.attr('value', value[0]);
        // set text
        opt.text(value[1]);
        // append to select
        opt.appendTo(level1);
      });      
      //reset level2 settings
      var level2 = $("#q_level2_eq");
      level2.empty();
      level2.append("<option value=''>任何</option>");
    }
  })
});

$(document).on('change', '#q_level1_eq', function() {  
  $.ajax({
    url: "/admin/component_categories/level2_collection",
    type: "GET",
    data: "level1=" + $(this).val(),
    dataType: "json",
    success: function(data){
      var level2 = $("#q_level2_eq");
      level2.empty();
      level2.append("<option value=''>任何</option>");
      $.each(data, function(index, value) {
        // append an option
        var opt = $('<option/>');
        // value is an array: [:id, :name]
        opt.attr('value', value[0]);
        // set text
        opt.text(value[1]);
        // append to select
        opt.appendTo(level2);
      });      
    }
  })
});

$(document).ready(function() {
  $("#q_search").submit(function() {
    if ($("#q_level2_eq").val() != "") {
      alert("level2 is not empty");
      $("#q_level0_eq").attr("disabled", true);
      $("#q_level1_eq").attr("disabled", true);    	
    } else {
      if ($("#q_level1_eq").val() != "") {
      	alert("level1 is not empty");
        $("#q_level0_eq").attr("disabled", true);	
      }	
    }
  });
});