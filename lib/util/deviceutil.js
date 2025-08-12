/**
 * Copyright © 2019 contains code contributed by Orange SA, authors: Denis Barbaron - Licensed under the Apache license 2.0
 **/

var logger = require("./logger");

var log = logger.createLogger("util:deviceutil");

var deviceutil = (module.exports = Object.create(null));

deviceutil.isOwnedByUser = function (device, user) {
  /* ---------------------------------- Debug --------------------------------- */
  console.log("device:", device);
  console.log("user:", user);
  console.log("device.present:", device.present);
  console.log("device.ready:", device.ready);
  console.log("device.owner:", device.group.owner);
  console.log(
    "device.group.owner.email === user.email:",
    device.group.owner && device.group.owner.email === user.email
  );
  console.log('user.privilege === "admin":', user.privilege === "admin");
  console.log("device.using:", device.using);
  /* -------------------------------------------------------------------------- */
  return (
    device.present &&
    device.ready &&
    device.group.owner &&
    (device.group.owner.email === user.email || user.privilege === "admin") &&
    device.using
  );
};

deviceutil.isAddable = function (device, user) {
  return device.present && device.ready && !device.using && !device.owner;
};
