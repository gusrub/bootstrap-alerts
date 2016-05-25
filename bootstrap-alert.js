"use strict";

var BootstrapAlert = BootstrapAlert || {};

BootstrapAlert.TEMPLATES = {
  "modal": '<div class="modal fade" id="bootstrap-alert-modal" tabindex="-1" role="dialog" aria-labelledby="bootstrap-alert-modal-label"><div class="modal-dialog" id="bootstrap-alert-modal-dialog" role="document"><div class="modal-content">{{content}}</div</div></div>',
  "modalHeader": '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="bootstrap-alert-modal-label">{{content}}</h4></div>',
  "modalBody": '<div class="modal-body">{{content}}</div>',
  "modalFooter": '<div id="bootstrap-alert-footer" class="modal-footer"></div>',
  "alert" : '<div id="bootstrap-alert" class="alert alert-{{type}} role="alert">{{content}}</div>',
  "dismissableAlert": '<div id="bootstrap-alert" class="alert alert-{{type}} alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>{{content}}</div>'
};

BootstrapAlert.modal = function(options, callback) {
  var title = options.title;
  var message = options.message;
  var size = options.size;
  var buttons = options.buttons;

  // Buttons are mandatory
  if (buttons == null) {
    console.error("Must provide buttons!");
    return false;
  }

  // We should at least get a title or a message, can't show a blank alert can we?
  if (title == null && message == null) {
    console.error("Must provide at least the title or a message!");
    return false;
  }

  var header = null;
  if (title != null) {
    header = this.TEMPLATES.modalHeader.replace("{{content}}", title);
  }

  var body = null;
  if (message != null) {
    body = this.TEMPLATES.modalBody.replace("{{content}}", message);
  }

  var footer = this.TEMPLATES.modalFooter;

  // remove older modal if any
  $("#bootstrap-alert-modal").remove();

  // build the new one and append it to the body
  var modal = $(this.TEMPLATES.modal.replace("{{content}}", header+body+footer)).appendTo("body");
  
  //check size
  if(size != null) {
    switch(size) {
      case "large":
        size = "modal-lg";
        break;
      case "small":
        size = "modal-sm";
        break;
      default:
        size = null;
        break;
    }
    $("#bootstrap-alert-modal-dialog").addClass(size);
  }

  // build buttons
  $(buttons).each(function(i,e){
    var button = $('<button type="button" data-result="'+e.result+'" class="btn btn-'+e.type+'">'+e.label+'</button>').appendTo("#bootstrap-alert-footer");

    button.click(function(){ 
      modal.result = e.result;
      callback(modal); 
    });
  });

  modal.modal();

  return this;
};

BootstrapAlert.alert = function(options, callback) {
  var target = options.target;
  var message = options.message;
  var type = options.type;
  var dismissable = options.dismissable;
  self = this;

  if (target == null) {
    console.error("You must set a target where alert will be displayed");
    return false;
  }

  if (message == null) {
    console.error("You must set a message to be shown");
    return false; 
  }

  if (type == null) {
    console.error("You must set the type of alert to be displayed!");
    return false;    
  }

  // fade out and remove older alert if any
  var target = $("#alerts-container");
  $(target).slideUp(400, function(){
    $("#bootstrap-alert").remove();

    if (dismissable) {
      $(target).append(self.TEMPLATES.dismissableAlert.replace("{{type}}", type).replace("{{content}}", message));
    } else {
      $(target).append(self.TEMPLATES.alert.replace("{{type}}", type).replace("{{content}}", message));
    }

    target.slideDown(400, callback);

  }); 

  return this;  
};