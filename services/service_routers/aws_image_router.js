//../..
var aws_controller = require("../aws_image_upload/image_controller");

//define get and post routes here
var routes = {
  gets : {
    input:aws_controller.getInputForm,
    index:aws_controller.index,
    remove:aws_controller.remove
  },
  posts : {
    add:aws_controller.add,
    addtags:aws_controller.addTags
  }
}

module.exports.base_route_path = "image";
module.exports.routes = routes;
module.exports.active = false;
